"""Chat service - RAG-based Q&A using Claude and ChromaDB."""

from typing import List, Dict, Any, Optional
import anthropic

from core.config import settings
from db.session import SessionLocal
from db.models import SpaceNews, ChatConversation, Insight
from services import chromadb_service


def get_claude_client() -> anthropic.Anthropic:
    """Get Anthropic client."""
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


CHAT_SYSTEM_PROMPT = """You are an expert space science assistant with access to recent NASA news, discoveries, and AI-detected patterns. Your role is to help users understand space science developments and find connections between discoveries.

You have access to:
1. Recent news and discoveries from NASA, Webb Telescope, and other space agencies
2. AI-detected patterns including connections between findings, emerging trends, research gaps, and anomalies

When answering questions:
- Be accurate and cite specific sources when possible
- Explain complex concepts in accessible terms
- Point out relevant patterns or connections when applicable
- Acknowledge uncertainty when appropriate
- Be enthusiastic about space science!

If the user asks about something not covered in the provided context, you can use your general knowledge but make it clear you're going beyond the provided sources."""


async def chat(
    user_query: str,
    conversation_history: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, Any]:
    """Process a chat query using RAG."""
    if not settings.ANTHROPIC_API_KEY:
        return {
            "response": "Chat is not available. Please configure ANTHROPIC_API_KEY.",
            "sources": [],
        }

    # Search for relevant context in ChromaDB
    similar_docs = await chromadb_service.query_similar(
        query_text=user_query,
        n_results=10,
    )

    # Build context from similar documents
    context_parts = []
    source_ids = []

    for i, (doc_id, doc, metadata) in enumerate(zip(
        similar_docs["ids"],
        similar_docs["documents"],
        similar_docs["metadatas"]
    )):
        source_ids.append(doc_id)
        context_parts.append(f"""
Source {i + 1}: [{metadata.get('source', 'unknown')}] {metadata.get('title', 'Untitled')}
Date: {metadata.get('date', 'Unknown')}
Category: {metadata.get('category', 'Unknown')}
Content: {doc[:500]}...
""")

    # Get recent insights for additional context
    db = SessionLocal()
    try:
        recent_insights = db.query(Insight).filter(
            Insight.confidence_score >= 0.6
        ).order_by(Insight.generated_at.desc()).limit(5).all()

        if recent_insights:
            context_parts.append("\n--- AI-Detected Patterns ---\n")
            for insight in recent_insights:
                context_parts.append(f"""
Pattern ({insight.type}): {insight.title}
{insight.description}
Confidence: {insight.confidence_score:.0%}
""")
    finally:
        db.close()

    context = "\n".join(context_parts)

    # Build messages
    messages = []

    # Add conversation history if provided
    if conversation_history:
        for msg in conversation_history[-6:]:  # Keep last 6 messages for context
            messages.append(msg)

    # Add current query with context
    user_message = f"""Based on the following recent space science information:

{context}

User Question: {user_query}

Please provide a helpful, accurate response based on this context. If citing specific sources, reference them by number."""

    messages.append({"role": "user", "content": user_message})

    # Call Claude
    client = get_claude_client()
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=CHAT_SYSTEM_PROMPT,
        messages=messages,
    )

    assistant_response = response.content[0].text

    # Store conversation
    db = SessionLocal()
    try:
        conversation = ChatConversation(
            user_query=user_query,
            assistant_response=assistant_response,
            sources_used=source_ids[:5] if source_ids else None,  # Store top 5 source IDs
        )
        db.add(conversation)
        db.commit()

        conversation_id = str(conversation.id)
    except Exception as e:
        db.rollback()
        conversation_id = None
    finally:
        db.close()

    # Get source details
    sources = []
    if source_ids:
        db = SessionLocal()
        try:
            news_items = db.query(SpaceNews).filter(
                SpaceNews.id.in_(source_ids[:5])
            ).all()
            sources = [
                {
                    "id": str(n.id),
                    "title": n.title,
                    "source": n.source,
                    "url": n.url,
                }
                for n in news_items
            ]
        finally:
            db.close()

    return {
        "response": assistant_response,
        "sources": sources,
        "conversation_id": conversation_id,
    }


async def get_chat_history(limit: int = 20) -> List[Dict[str, Any]]:
    """Get recent chat history."""
    db = SessionLocal()
    try:
        conversations = db.query(ChatConversation).order_by(
            ChatConversation.created_at.desc()
        ).limit(limit).all()

        return [c.to_dict() for c in conversations]
    finally:
        db.close()


async def get_suggested_questions() -> List[str]:
    """Get suggested questions based on recent news and insights."""
    suggestions = [
        "What are the latest discoveries from the James Webb Space Telescope?",
        "Are there any new findings about exoplanet atmospheres?",
        "What connections have been found between recent observations?",
        "What are the emerging trends in space science this week?",
        "Are there any research gaps that need attention?",
    ]

    # Try to add dynamic suggestions based on recent insights
    db = SessionLocal()
    try:
        recent_insight = db.query(Insight).filter(
            Insight.confidence_score >= 0.7
        ).order_by(Insight.generated_at.desc()).first()

        if recent_insight:
            suggestions.insert(0, f"Tell me more about: {recent_insight.title}")
    finally:
        db.close()

    return suggestions[:6]
