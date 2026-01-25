"""API endpoints for the AI intelligence system."""

from typing import Optional, List
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel

from services import news_collector, intelligence_service, chat_service

router = APIRouter()


# Request/Response models
class ChatRequest(BaseModel):
    query: str
    conversation_history: Optional[List[dict]] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[dict]
    conversation_id: Optional[str] = None


# =============================================================================
# Dashboard & Stats
# =============================================================================

@router.get("/intelligence/stats")
async def get_dashboard_stats():
    """Get dashboard statistics."""
    try:
        stats = await intelligence_service.get_dashboard_stats()
        return stats
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# =============================================================================
# News Collection
# =============================================================================

@router.get("/intelligence/news")
async def get_collected_news(limit: int = 50):
    """Get recently collected news."""
    try:
        news = await news_collector.get_recent_news(limit)
        return {"news": news, "count": len(news)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/intelligence/collect")
async def trigger_news_collection(background_tasks: BackgroundTasks):
    """Manually trigger news collection (admin endpoint)."""
    try:
        # Run collection in background
        result = await news_collector.collect_all_news()
        return {
            "status": "completed",
            "result": result,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# =============================================================================
# Pattern Analysis
# =============================================================================

@router.get("/intelligence/insights")
async def get_insights(
    type: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 20,
):
    """Get AI-detected insights."""
    try:
        insights = await intelligence_service.get_insights(
            insight_type=type,
            category=category,
            limit=limit,
        )
        return {"insights": insights, "count": len(insights)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/intelligence/insights/{insight_id}")
async def get_insight_detail(insight_id: str):
    """Get detailed insight with related news."""
    try:
        insight = await intelligence_service.get_insight_by_id(insight_id)
        if not insight:
            raise HTTPException(status_code=404, detail="Insight not found")
        return insight
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/intelligence/analyze")
async def trigger_pattern_analysis(days: int = 7):
    """Manually trigger pattern analysis (admin endpoint)."""
    try:
        result = await intelligence_service.analyze_patterns(days)
        return {
            "status": "completed",
            "result": result,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# =============================================================================
# Alerts
# =============================================================================

@router.get("/intelligence/alerts")
async def get_alerts(unread_only: bool = True, limit: int = 20):
    """Get alerts for significant patterns."""
    try:
        alerts = await intelligence_service.get_alerts(
            unread_only=unread_only,
            limit=limit,
        )
        return {"alerts": alerts, "count": len(alerts)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.put("/intelligence/alerts/{alert_id}/seen")
async def mark_alert_seen(alert_id: str):
    """Mark an alert as seen."""
    try:
        success = await intelligence_service.mark_alert_seen(alert_id)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"status": "success"}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# =============================================================================
# Chat
# =============================================================================

@router.post("/intelligence/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the AI assistant about space science."""
    try:
        result = await chat_service.chat(
            user_query=request.query,
            conversation_history=request.conversation_history,
        )
        return ChatResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/intelligence/chat/history")
async def get_chat_history(limit: int = 20):
    """Get chat conversation history."""
    try:
        history = await chat_service.get_chat_history(limit)
        return {"conversations": history, "count": len(history)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/intelligence/chat/suggestions")
async def get_suggested_questions():
    """Get suggested questions to ask."""
    try:
        suggestions = await chat_service.get_suggested_questions()
        return {"suggestions": suggestions}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
