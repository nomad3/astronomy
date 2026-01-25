"""Intelligence service - Pattern analysis using Claude."""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json
import anthropic

from core.config import settings
from db.session import SessionLocal
from db.models import SpaceNews, Insight, Alert
from services import chromadb_service


# Initialize Anthropic client
def get_claude_client() -> anthropic.Anthropic:
    """Get Anthropic client."""
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


ANALYSIS_PROMPT = """You are an expert space science analyst. Your task is to analyze recent space news and discoveries to identify meaningful patterns that could contribute to scientific understanding.

Given the following news items from the past week:

{news_items}

Analyze this data and identify:

1. **CONNECTIONS**: Findings from different areas that relate to each other in non-obvious ways. Look for:
   - Cross-domain links (e.g., an exoplanet finding that relates to stellar formation)
   - Complementary observations from different telescopes
   - Theoretical predictions being confirmed by observations

2. **TRENDS**: Topics or areas getting increased attention. Look for:
   - Multiple teams studying similar phenomena
   - New techniques being applied across different fields
   - Emerging areas of interest

3. **GAPS**: Areas where there are observations but lacking analysis, or questions raised but not answered. Look for:
   - Observations that warrant follow-up
   - Unanswered questions in the news
   - Opportunities for citizen science or further research

4. **ANOMALIES**: Unusual findings that don't fit existing patterns and might be scientifically significant. Look for:
   - Unexpected results
   - Contradictions to existing theories
   - Potential new discoveries

For EACH pattern you identify, provide a JSON object with:
- type: "connection" | "trend" | "gap" | "anomaly"
- title: Short descriptive title
- description: 2-3 sentence explanation
- confidence_score: 0.0 to 1.0 based on evidence strength
- evidence: Your reasoning
- category: The primary scientific category
- related_news_ids: List of news item IDs that support this pattern

Return your analysis as a JSON array of pattern objects. Only include patterns you have reasonable confidence in (>0.5).

JSON Response:"""


async def analyze_patterns(days: int = 7) -> Dict[str, Any]:
    """Run pattern analysis on recent news using Claude."""
    if not settings.ANTHROPIC_API_KEY:
        return {"error": "ANTHROPIC_API_KEY not configured", "insights": []}

    db = SessionLocal()
    try:
        # Get recent news
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        news_items = db.query(SpaceNews).filter(
            SpaceNews.created_at >= cutoff_date
        ).order_by(SpaceNews.published_at.desc()).limit(100).all()

        if not news_items:
            return {"message": "No news items to analyze", "insights": []}

        # Format news for Claude
        news_text = ""
        news_id_map = {}
        for i, news in enumerate(news_items):
            news_id_map[i + 1] = str(news.id)
            news_text += f"""
---
ID: {i + 1}
Source: {news.source}
Category: {news.category}
Title: {news.title}
Date: {news.published_at.strftime('%Y-%m-%d') if news.published_at else 'Unknown'}
Summary: {news.summary or news.content[:300] if news.content else 'No summary'}
---
"""

        # Call Claude for analysis
        client = get_claude_client()
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": ANALYSIS_PROMPT.format(news_items=news_text)
                }
            ]
        )

        # Parse response
        response_text = message.content[0].text.strip()

        # Extract JSON from response
        try:
            # Try to find JSON array in response
            if "[" in response_text:
                json_start = response_text.index("[")
                json_end = response_text.rindex("]") + 1
                json_str = response_text[json_start:json_end]
                patterns = json.loads(json_str)
            else:
                patterns = []
        except (json.JSONDecodeError, ValueError) as e:
            print(f"Error parsing Claude response: {e}")
            patterns = []

        # Store insights
        stored_insights = []
        for pattern in patterns:
            # Map news IDs back to UUIDs
            related_ids = []
            for news_id in pattern.get("related_news_ids", []):
                if isinstance(news_id, int) and news_id in news_id_map:
                    related_ids.append(news_id_map[news_id])

            insight = Insight(
                type=pattern.get("type", "connection"),
                title=pattern.get("title", "Untitled Pattern"),
                description=pattern.get("description", ""),
                confidence_score=float(pattern.get("confidence_score", 0.5)),
                related_news_ids=related_ids if related_ids else None,
                category=pattern.get("category", "other"),
                evidence=pattern.get("evidence", ""),
            )

            db.add(insight)
            db.flush()

            # Create alert for high-confidence insights
            if insight.confidence_score >= 0.7:
                alert = Alert(
                    insight_id=insight.id,
                    priority="high" if insight.confidence_score >= 0.85 else "medium",
                )
                db.add(alert)

            stored_insights.append(insight.to_dict())

        db.commit()

        return {
            "analyzed_news_count": len(news_items),
            "patterns_found": len(stored_insights),
            "insights": stored_insights,
        }

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


async def get_insights(
    insight_type: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 20,
) -> List[Dict[str, Any]]:
    """Get insights from database."""
    db = SessionLocal()
    try:
        query = db.query(Insight)

        if insight_type:
            query = query.filter(Insight.type == insight_type)
        if category:
            query = query.filter(Insight.category == category)

        insights = query.order_by(
            Insight.confidence_score.desc(),
            Insight.generated_at.desc()
        ).limit(limit).all()

        return [i.to_dict() for i in insights]
    finally:
        db.close()


async def get_insight_by_id(insight_id: str) -> Optional[Dict[str, Any]]:
    """Get a single insight with related news."""
    db = SessionLocal()
    try:
        insight = db.query(Insight).filter(Insight.id == insight_id).first()
        if not insight:
            return None

        result = insight.to_dict()

        # Get related news
        if insight.related_news_ids:
            related_news = db.query(SpaceNews).filter(
                SpaceNews.id.in_(insight.related_news_ids)
            ).all()
            result["related_news"] = [n.to_dict() for n in related_news]

        return result
    finally:
        db.close()


async def get_alerts(unread_only: bool = True, limit: int = 20) -> List[Dict[str, Any]]:
    """Get alerts."""
    db = SessionLocal()
    try:
        query = db.query(Alert)

        if unread_only:
            query = query.filter(Alert.seen == False)

        alerts = query.order_by(
            Alert.created_at.desc()
        ).limit(limit).all()

        result = []
        for alert in alerts:
            alert_dict = alert.to_dict()

            # Include insight info
            if alert.insight_id:
                insight = db.query(Insight).filter(Insight.id == alert.insight_id).first()
                if insight:
                    alert_dict["insight"] = insight.to_dict()

            result.append(alert_dict)

        return result
    finally:
        db.close()


async def mark_alert_seen(alert_id: str) -> bool:
    """Mark an alert as seen."""
    db = SessionLocal()
    try:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return False

        alert.seen = True
        db.commit()
        return True
    finally:
        db.close()


async def get_dashboard_stats() -> Dict[str, Any]:
    """Get statistics for the dashboard."""
    db = SessionLocal()
    try:
        # Get counts
        total_news = db.query(SpaceNews).count()
        total_insights = db.query(Insight).count()
        unread_alerts = db.query(Alert).filter(Alert.seen == False).count()

        # Get insight type breakdown
        insight_types = {}
        for insight_type in ["connection", "trend", "gap", "anomaly"]:
            count = db.query(Insight).filter(Insight.type == insight_type).count()
            insight_types[insight_type] = count

        # Get category breakdown
        categories = db.query(SpaceNews.category).distinct().all()
        category_counts = {}
        for (cat,) in categories:
            if cat:
                count = db.query(SpaceNews).filter(SpaceNews.category == cat).count()
                category_counts[cat] = count

        # Get recent high-confidence insights
        recent_insights = db.query(Insight).filter(
            Insight.confidence_score >= 0.7
        ).order_by(
            Insight.generated_at.desc()
        ).limit(5).all()

        return {
            "total_news": total_news,
            "total_insights": total_insights,
            "unread_alerts": unread_alerts,
            "insight_types": insight_types,
            "categories": category_counts,
            "recent_high_confidence": [i.to_dict() for i in recent_insights],
        }
    finally:
        db.close()
