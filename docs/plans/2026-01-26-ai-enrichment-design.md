# AI Enrichment System Design

**Date**: 2026-01-26
**Status**: Approved
**Goal**: Automatically enrich notable astronomical events with AI-researched content for the Artemis II launch and beyond.

## Overview

Enhance launches, asteroids, space weather, and telescope observations with rich contextual content using AI-powered web research. Content integrates seamlessly into existing UI without "AI generated" labels.

## Architecture

### Storage Strategy (Dual)

- **PostgreSQL**: Structured content for display (`enriched_content` table)
- **ChromaDB**: Embeddings for semantic search and RAG chat

### Data Flow

```
Scheduler (2 AM UTC)
    ↓
Notability Scoring
    ↓
Web Research (Google Search)
    ↓
Content Synthesis (Claude)
    ↓
├── PostgreSQL (structured JSON)
└── ChromaDB (embeddings)
    ↓
API serves enriched content
    ↓
Frontend displays inline
```

## Notability Scoring

Uses existing algorithm from frontend:

| Category    | Keywords                                          | Score |
|-------------|---------------------------------------------------|-------|
| Crewed      | crew, crewed, astronaut, cosmonaut, taikonaut     | +100  |
| Lunar       | moon, lunar, artemis, gateway                     | +80   |
| Mars        | mars, martian                                     | +70   |
| Deep Space  | jupiter, saturn, asteroid, comet, europa, titan   | +60   |
| Historic    | first, maiden, inaugural                          | +40   |
| Programs    | artemis, apollo, iss, tiangong, starship          | +30   |

Items scoring > 0 are candidates for enrichment.

## Content Types

### Launches
- **Crew Profiles**: Background, experience, role (for crewed missions)
- **Mission Objectives**: Primary goals, scientific experiments
- **Historical Context**: Program history, significance, milestones
- **Technical Details**: Vehicle specs, trajectory, mission duration

### Asteroids
- Composition analysis
- Discovery history
- Close approach significance

### Telescopes
- Current observation targets
- Scientific objectives
- Recent discoveries

### Space Weather
- Event analysis
- Earth impact assessment
- Historical comparisons

## Database Schema

```sql
CREATE TABLE enriched_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,      -- "launch", "asteroid", "telescope"
    entity_id VARCHAR(255) NOT NULL,        -- External ID
    content_type VARCHAR(100) NOT NULL,     -- "crew_profile", "mission_objectives", etc.
    content JSONB NOT NULL,                 -- Structured content block
    sources JSONB,                          -- List of source URLs
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,                   -- created_at + 7 days

    UNIQUE(entity_type, entity_id, content_type)
);

CREATE INDEX idx_enriched_entity ON enriched_content(entity_type, entity_id);
CREATE INDEX idx_enriched_expires ON enriched_content(expires_at);
```

## ChromaDB Integration

Extends existing collections with enrichment documents:

```python
collection.add(
    ids=[f"enriched_{entity_id}_{content_type}"],
    documents=[content_text],
    metadatas=[{
        "type": "enrichment",
        "entity_type": "launch",
        "entity_id": launch_id,
        "content_type": "crew_profile",
        "created_at": timestamp
    }]
)
```

## API Enhancement

The `/launches/{slug}` endpoint includes enrichment when available:

```json
{
  "id": "abc-123",
  "name": "SLS Block 1 | Artemis II",
  "slug": "sls-block-1-artemis-ii",
  "status": {...},
  "enrichment": {
    "crew_profiles": [
      {
        "name": "Reid Wiseman",
        "role": "Commander",
        "background": "NASA astronaut since 2009...",
        "photo_url": "..."
      }
    ],
    "mission_objectives": {
      "primary": "Test Orion spacecraft systems...",
      "experiments": [...]
    },
    "historical_context": {
      "summary": "First crewed mission beyond LEO since Apollo 17...",
      "milestones": [...]
    },
    "technical_details": {
      "duration": "10 days",
      "distance": "450,000 km",
      "trajectory": "Free-return lunar flyby"
    }
  }
}
```

## Research Pipeline

1. **Query Construction**
   - `"{mission_name}" crew members background`
   - `"{mission_name}" mission objectives experiments`
   - `"{mission_name}" historical significance NASA`

2. **Source Gathering**
   - 5-8 relevant articles per topic
   - Prioritize: NASA.gov, space agencies, reputable news

3. **Content Synthesis**
   - Claude processes sources with structured prompts
   - Each block: 150-300 words, standalone
   - Returns structured JSON matching schema

## Scheduled Job

```python
# server/services/enrichment.py

async def run_daily_enrichment():
    """Runs daily at 2 AM UTC."""

    # Launches - top 5 notable without recent enrichment
    launches = await fetch_upcoming_launches(limit=50)
    notable = sorted(
        [l for l in launches if calculate_notability(l) > 0],
        key=lambda x: calculate_notability(x),
        reverse=True
    )[:5]

    for launch in notable:
        if not await has_recent_enrichment("launch", launch["id"]):
            await enrich_launch(launch)

    # Asteroids - close approaches this week
    asteroids = await get_close_approaches(days=7)
    for asteroid in asteroids[:3]:
        await enrich_asteroid(asteroid)

    # Extend to telescopes, space weather as needed
```

## UI Integration

Content sections appear inline on detail pages when enrichment exists:

- **Crew section**: Photo cards with name, role, background
- **Mission objectives**: Bulleted list of goals and experiments
- **Historical context**: Narrative paragraph with key milestones
- **Technical details**: Specs grid (duration, distance, trajectory)

No loading states, no "AI generated" labels - content appears as native page content.

## Implementation Order

1. Database migration for `enriched_content` table
2. Enrichment service with research pipeline
3. API enhancement to include enrichment in responses
4. Frontend components for each content type
5. Scheduled job setup
6. Extend to asteroids, space weather, telescopes

## Content Freshness

- Enrichment expires after 7 days
- Daily job re-enriches expired notable items
- Manual trigger available for immediate enrichment
