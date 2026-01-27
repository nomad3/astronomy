"""Database models for the AI intelligence system."""

import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ARRAY, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB

from db.base import Base


class SpaceNews(Base):
    """Collected news and discoveries from NASA sources."""
    __tablename__ = "space_news"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source = Column(String(50), nullable=False)  # nasa_news, webb, apod, donki
    external_id = Column(String(255))
    title = Column(Text, nullable=False)
    summary = Column(Text)
    content = Column(Text)
    url = Column(Text)
    image_url = Column(Text)
    category = Column(String(50))  # exoplanets, galaxies, nebulae, etc.
    published_at = Column(DateTime)
    embedding_id = Column(String(255))  # Reference to ChromaDB
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "source": self.source,
            "external_id": self.external_id,
            "title": self.title,
            "summary": self.summary,
            "content": self.content,
            "url": self.url,
            "image_url": self.image_url,
            "category": self.category,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Insight(Base):
    """AI-detected patterns and insights from Claude analysis."""
    __tablename__ = "insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String(50), nullable=False)  # connection, trend, gap, anomaly
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    confidence_score = Column(Float)
    related_news_ids = Column(ARRAY(UUID(as_uuid=True)))
    category = Column(String(50))
    evidence = Column(Text)  # Claude's reasoning
    generated_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "type": self.type,
            "title": self.title,
            "description": self.description,
            "confidence_score": self.confidence_score,
            "related_news_ids": [str(id) for id in self.related_news_ids] if self.related_news_ids else [],
            "category": self.category,
            "evidence": self.evidence,
            "generated_at": self.generated_at.isoformat() if self.generated_at else None,
        }


class ChatConversation(Base):
    """Chat history for RAG-based Q&A."""
    __tablename__ = "chat_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_query = Column(Text, nullable=False)
    assistant_response = Column(Text, nullable=False)
    sources_used = Column(ARRAY(UUID(as_uuid=True)))
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_query": self.user_query,
            "assistant_response": self.assistant_response,
            "sources_used": [str(id) for id in self.sources_used] if self.sources_used else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Alert(Base):
    """Alerts for significant patterns detected."""
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    insight_id = Column(UUID(as_uuid=True))
    priority = Column(String(20), default="medium")  # high, medium, low
    seen = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": str(self.id),
            "insight_id": str(self.insight_id) if self.insight_id else None,
            "priority": self.priority,
            "seen": self.seen,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class EnrichedContent(Base):
    """AI-enriched content for launches, asteroids, and other astronomical events."""
    __tablename__ = "enriched_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50), nullable=False)  # launch, asteroid, telescope
    entity_id = Column(String(255), nullable=False)  # External ID (launch UUID, asteroid designation)
    content_type = Column(String(100), nullable=False)  # crew_profile, mission_objectives, etc.
    content = Column(JSONB, nullable=False)  # Structured content block
    sources = Column(JSONB)  # List of source URLs used
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)  # For cache invalidation

    __table_args__ = (
        Index('idx_enriched_entity', 'entity_type', 'entity_id'),
        Index('idx_enriched_expires', 'expires_at'),
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if self.expires_at is None and self.created_at:
            self.expires_at = self.created_at + timedelta(days=7)
        elif self.expires_at is None:
            self.expires_at = datetime.utcnow() + timedelta(days=7)

    def to_dict(self):
        return {
            "id": str(self.id),
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "content_type": self.content_type,
            "content": self.content,
            "sources": self.sources,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
        }
