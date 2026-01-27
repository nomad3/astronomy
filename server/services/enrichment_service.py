"""Enrichment service - AI-powered content enhancement for launches and astronomical events."""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json
import httpx
import anthropic

from core.config import settings
from db.session import SessionLocal
from db.models import EnrichedContent
from services import chromadb_service
from services.launch_library import fetch_upcoming_launches


# Notability scoring criteria (mirrors frontend)
NOTABLE_CRITERIA = {
    "crewed": ["crew", "crewed", "astronaut", "cosmonaut", "taikonaut"],
    "lunar": ["moon", "lunar", "artemis", "gateway"],
    "mars": ["mars", "martian"],
    "deep_space": ["jupiter", "saturn", "asteroid", "comet", "europa", "titan", "psyche"],
    "historic": ["first", "maiden", "inaugural"],
    "programs": ["artemis", "apollo", "iss", "tiangong", "starship"],
}

NOTABILITY_SCORES = {
    "crewed": 100,
    "lunar": 80,
    "mars": 70,
    "deep_space": 60,
    "historic": 40,
    "programs": 30,
}


def get_claude_client() -> anthropic.Anthropic:
    """Get Anthropic client."""
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def calculate_notability(launch: Dict[str, Any]) -> int:
    """Calculate notability score for a launch."""
    score = 0
    search_text = f"{launch.get('name', '')} {launch.get('mission', '')} {launch.get('mission_description', '')} {launch.get('orbit', '')}".lower()

    for category, keywords in NOTABLE_CRITERIA.items():
        if any(keyword in search_text for keyword in keywords):
            score += NOTABILITY_SCORES.get(category, 0)

    return score


def get_notability_tags(launch: Dict[str, Any]) -> List[str]:
    """Get notability category tags for a launch."""
    tags = []
    search_text = f"{launch.get('name', '')} {launch.get('mission', '')} {launch.get('mission_description', '')} {launch.get('orbit', '')}".lower()

    if any(k in search_text for k in NOTABLE_CRITERIA["crewed"]):
        tags.append("crewed")
    if any(k in search_text for k in NOTABLE_CRITERIA["lunar"]):
        tags.append("lunar")
    if any(k in search_text for k in NOTABLE_CRITERIA["mars"]):
        tags.append("mars")

    return tags


async def search_web(query: str, num_results: int = 5) -> List[Dict[str, str]]:
    """Search the web using DuckDuckGo HTML search."""
    results = []

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Use DuckDuckGo HTML endpoint
            response = await client.get(
                "https://html.duckduckgo.com/html/",
                params={"q": query},
                headers={"User-Agent": "Mozilla/5.0 (compatible; AstronomyBot/1.0)"}
            )

            if response.status_code == 200:
                # Simple parsing - extract titles and URLs from result links
                html = response.text
                # Find result blocks
                import re
                links = re.findall(r'<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>([^<]+)</a>', html)

                for url, title in links[:num_results]:
                    # Clean up DuckDuckGo redirect URLs
                    if "uddg=" in url:
                        actual_url = url.split("uddg=")[-1].split("&")[0]
                        import urllib.parse
                        actual_url = urllib.parse.unquote(actual_url)
                    else:
                        actual_url = url

                    results.append({
                        "title": title.strip(),
                        "url": actual_url,
                    })

    except Exception as e:
        print(f"Web search error: {e}")

    return results


ENRICHMENT_PROMPTS = {
    "crew_profiles": """You are researching the crew members for the space mission: {mission_name}

Based on the following search results about this mission's crew:
{search_results}

Create detailed crew profiles. For each crew member, provide:
- Full name
- Role on mission (Commander, Pilot, Mission Specialist, etc.)
- Background (nationality, agency, previous missions)
- A brief bio highlighting their experience

Return your response as a JSON object with this structure:
{{
  "crew": [
    {{
      "name": "Full Name",
      "role": "Role",
      "agency": "NASA/ESA/etc",
      "nationality": "Country",
      "previous_missions": ["Mission 1", "Mission 2"],
      "bio": "2-3 sentence biography"
    }}
  ]
}}

Only include crew members you can verify from the sources. If no crew information is found, return {{"crew": []}}.

JSON Response:""",

    "mission_objectives": """You are researching the mission: {mission_name}

Based on the following search results:
{search_results}

Summarize the mission objectives. Include:
- Primary mission goal
- Scientific experiments or payloads
- Key milestones during the mission
- Expected duration and trajectory

Return your response as a JSON object:
{{
  "primary_goal": "Main objective in 1-2 sentences",
  "experiments": ["Experiment 1", "Experiment 2"],
  "milestones": ["Milestone 1", "Milestone 2"],
  "duration": "Expected duration",
  "trajectory": "Mission path description"
}}

JSON Response:""",

    "historical_context": """You are researching the historical significance of: {mission_name}

Based on the following search results:
{search_results}

Provide historical context for this mission. Include:
- Why this mission is significant
- Previous related missions or programs
- What makes this a milestone (if applicable)
- Connection to broader space exploration goals

Return your response as a JSON object:
{{
  "significance": "2-3 sentences on why this matters",
  "program_history": "Brief history of the program",
  "milestones": ["Key historical milestone 1", "Milestone 2"],
  "future_implications": "What this enables for future exploration"
}}

JSON Response:""",

    "technical_details": """You are researching technical specifications for: {mission_name}

Based on the following search results:
{search_results}

Provide technical details about this mission. Include:
- Launch vehicle specifications
- Spacecraft details
- Mission parameters (orbit, distance, duration)
- Notable technical achievements

Return your response as a JSON object:
{{
  "vehicle": {{
    "name": "Vehicle name",
    "height": "Height in meters",
    "thrust": "Thrust specification",
    "stages": "Number of stages"
  }},
  "spacecraft": {{
    "name": "Spacecraft name",
    "capacity": "Crew or cargo capacity"
  }},
  "mission_parameters": {{
    "destination": "Target destination",
    "distance": "Distance traveled",
    "duration": "Mission duration",
    "orbit_type": "Type of orbit"
  }}
}}

JSON Response:""",
}

SEARCH_QUERIES = {
    "crew_profiles": [
        '"{mission}" crew members astronauts',
        '"{mission}" crew background biography',
    ],
    "mission_objectives": [
        '"{mission}" mission objectives goals',
        '"{mission}" scientific experiments payload',
    ],
    "historical_context": [
        '"{mission}" historical significance importance',
        '"{mission}" program history milestones',
    ],
    "technical_details": [
        '"{mission}" technical specifications rocket',
        '"{mission}" spacecraft details parameters',
    ],
}


async def research_and_synthesize(
    mission_name: str,
    content_type: str,
) -> Dict[str, Any]:
    """Research a topic and synthesize content using Claude."""

    if not settings.ANTHROPIC_API_KEY:
        return {"error": "ANTHROPIC_API_KEY not configured"}

    # Gather search results
    all_results = []
    queries = SEARCH_QUERIES.get(content_type, [])

    for query_template in queries:
        query = query_template.format(mission=mission_name)
        results = await search_web(query, num_results=3)
        all_results.extend(results)

    if not all_results:
        return {"error": "No search results found"}

    # Format search results for Claude
    search_text = ""
    sources = []
    for i, result in enumerate(all_results[:8], 1):
        search_text += f"\n[{i}] {result['title']}\nURL: {result['url']}\n"
        sources.append(result['url'])

    # Get the prompt for this content type
    prompt_template = ENRICHMENT_PROMPTS.get(content_type)
    if not prompt_template:
        return {"error": f"Unknown content type: {content_type}"}

    prompt = prompt_template.format(
        mission_name=mission_name,
        search_results=search_text,
    )

    # Call Claude for synthesis
    try:
        client = get_claude_client()
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text.strip()

        # Extract JSON from response
        try:
            if "{" in response_text:
                json_start = response_text.index("{")
                json_end = response_text.rindex("}") + 1
                json_str = response_text[json_start:json_end]
                content = json.loads(json_str)
            else:
                content = {}
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing Claude response: {e}")
            content = {}

        return {
            "content": content,
            "sources": sources,
        }

    except Exception as e:
        print(f"Claude API error: {e}")
        return {"error": str(e)}


async def enrich_launch(launch: Dict[str, Any]) -> Dict[str, Any]:
    """Enrich a launch with all content types."""
    launch_id = launch.get("id")
    launch_name = launch.get("name", "")
    tags = get_notability_tags(launch)

    results = {}
    db = SessionLocal()

    try:
        # Determine which content types to generate
        content_types = ["mission_objectives", "historical_context", "technical_details"]

        # Only generate crew profiles for crewed missions
        if "crewed" in tags:
            content_types.insert(0, "crew_profiles")

        for content_type in content_types:
            # Check if we already have recent enrichment
            existing = db.query(EnrichedContent).filter(
                EnrichedContent.entity_type == "launch",
                EnrichedContent.entity_id == launch_id,
                EnrichedContent.content_type == content_type,
                EnrichedContent.expires_at > datetime.utcnow(),
            ).first()

            if existing:
                results[content_type] = {"status": "cached", "content": existing.content}
                continue

            # Research and synthesize
            enrichment = await research_and_synthesize(launch_name, content_type)

            if "error" in enrichment:
                results[content_type] = {"status": "error", "error": enrichment["error"]}
                continue

            content = enrichment.get("content", {})
            sources = enrichment.get("sources", [])

            # Skip empty content
            if not content:
                continue

            # Store in PostgreSQL
            enriched = EnrichedContent(
                entity_type="launch",
                entity_id=launch_id,
                content_type=content_type,
                content=content,
                sources=sources,
            )
            db.add(enriched)

            # Store in ChromaDB for semantic search
            doc_text = json.dumps(content, indent=2)
            await chromadb_service.add_documents(
                documents=[doc_text],
                metadatas=[{
                    "type": "enrichment",
                    "entity_type": "launch",
                    "entity_id": launch_id,
                    "content_type": content_type,
                    "mission_name": launch_name,
                }],
                ids=[f"enriched_{launch_id}_{content_type}"],
                collection_name="space_news",  # Use existing collection
            )

            results[content_type] = {"status": "created", "content": content}

        db.commit()

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

    return results


async def get_enrichment_for_launch(launch_id: str) -> Dict[str, Any]:
    """Get all enrichment data for a launch."""
    db = SessionLocal()
    try:
        enrichments = db.query(EnrichedContent).filter(
            EnrichedContent.entity_type == "launch",
            EnrichedContent.entity_id == launch_id,
            EnrichedContent.expires_at > datetime.utcnow(),
        ).all()

        result = {}
        for e in enrichments:
            result[e.content_type] = e.content

        return result
    finally:
        db.close()


async def has_recent_enrichment(entity_type: str, entity_id: str) -> bool:
    """Check if entity has recent (non-expired) enrichment."""
    db = SessionLocal()
    try:
        exists = db.query(EnrichedContent).filter(
            EnrichedContent.entity_type == entity_type,
            EnrichedContent.entity_id == entity_id,
            EnrichedContent.expires_at > datetime.utcnow(),
        ).first() is not None
        return exists
    finally:
        db.close()


async def run_daily_enrichment() -> Dict[str, Any]:
    """Run daily enrichment job for notable items."""
    results = {
        "launches_processed": 0,
        "launches_enriched": 0,
        "errors": [],
    }

    try:
        # Get upcoming launches
        launches = await fetch_upcoming_launches(limit=50)

        # Score and sort by notability
        notable_launches = []
        for launch in launches:
            score = calculate_notability(launch)
            if score > 0:
                notable_launches.append((score, launch))

        notable_launches.sort(key=lambda x: x[0], reverse=True)

        # Process top 5 notable launches without recent enrichment
        processed = 0
        for score, launch in notable_launches:
            if processed >= 5:
                break

            launch_id = launch.get("id")
            if not launch_id:
                continue

            if await has_recent_enrichment("launch", launch_id):
                continue

            try:
                await enrich_launch(launch)
                results["launches_enriched"] += 1
            except Exception as e:
                results["errors"].append(f"Failed to enrich {launch.get('name')}: {str(e)}")

            results["launches_processed"] += 1
            processed += 1

    except Exception as e:
        results["errors"].append(f"Daily enrichment failed: {str(e)}")

    return results


async def trigger_enrichment(entity_type: str, entity_id: str) -> Dict[str, Any]:
    """Manually trigger enrichment for a specific entity."""
    if entity_type == "launch":
        # Fetch launch details
        from services.launch_library import fetch_launch_by_id
        launch = await fetch_launch_by_id(entity_id)
        if not launch:
            return {"error": "Launch not found"}
        return await enrich_launch(launch)

    return {"error": f"Unsupported entity type: {entity_type}"}
