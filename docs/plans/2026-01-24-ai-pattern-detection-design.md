# AI-Powered Space Intelligence Platform - Design Document

## Overview

Transform the astronomy platform from a news aggregator into an AI-powered pattern detection system that analyzes NASA discoveries to find connections, trends, and research gaps.

## Vision

**Phase 1 (Current)**: AI pattern detection across space news/discoveries
**Phase 2 (Future)**: Earth monitoring - wildfires, earthquakes, climate patterns for Chile

## Architecture

```
Data Collection (Daily) → Embedding Pipeline (Daily) → Pattern Analysis (Weekly)
                                    ↓
                    Dashboard | Chat | Alerts
```

## Data Sources

- NASA News API / Webb Telescope News
- NASA Image Library
- DONKI (Space Weather)
- APOD
- Future: arXiv astronomy papers

## Technology Stack

- **Vector Store**: ChromaDB
- **AI Analysis**: Anthropic Claude API
- **Database**: PostgreSQL (existing)
- **Backend**: FastAPI (existing)
- **Frontend**: Next.js (existing)

## Data Model

### PostgreSQL Tables

```sql
-- Collected news/discoveries
CREATE TABLE space_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) NOT NULL,
    external_id VARCHAR(255),
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    url TEXT,
    image_url TEXT,
    category VARCHAR(50),
    published_at TIMESTAMP,
    embedding_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(source, external_id)
);

-- Claude-generated insights
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- connection, trend, gap, anomaly
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    confidence_score FLOAT,
    related_news_ids UUID[],
    category VARCHAR(50),
    evidence TEXT, -- Claude's reasoning
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Chat history
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_query TEXT NOT NULL,
    assistant_response TEXT NOT NULL,
    sources_used UUID[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Alerts for significant patterns
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_id UUID REFERENCES insights(id),
    priority VARCHAR(20) DEFAULT 'medium',
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### ChromaDB Collections

```
Collection: space_news_embeddings
- id: matches space_news.id
- embedding: vector from Claude/voyage
- metadata: {source, category, date, title}
- document: summary + key content
```

## Backend Services

### 1. News Collector Service
- Runs daily via cron/scheduled task
- Fetches from all NASA sources
- Deduplicates and stores in PostgreSQL
- Triggers embedding pipeline

### 2. Embedding Service
- Processes new news items
- Generates embeddings via Claude/voyage
- Stores in ChromaDB with metadata

### 3. Pattern Analysis Service
- Runs weekly
- Retrieves recent news from ChromaDB
- Sends to Claude with analysis prompt
- Detects: connections, trends, gaps, anomalies
- Stores insights in PostgreSQL
- Creates alerts for high-confidence patterns

### 4. Chat Service
- RAG-based question answering
- Searches ChromaDB for relevant context
- Sends context + question to Claude
- Stores conversation history

## API Endpoints

```
# News & Insights
GET  /intelligence/news          - Recent collected news
GET  /intelligence/insights      - AI-detected patterns
GET  /intelligence/insights/{id} - Single insight detail

# Chat
POST /intelligence/chat          - Ask a question
GET  /intelligence/chat/history  - Conversation history

# Alerts
GET  /intelligence/alerts        - Unread alerts
PUT  /intelligence/alerts/{id}   - Mark as seen

# Admin/Manual triggers
POST /intelligence/collect       - Trigger news collection
POST /intelligence/analyze       - Trigger pattern analysis
```

## Frontend Pages

```
/intelligence                    - Dashboard with insights, trends, alerts
/intelligence/chat               - Chat interface
/intelligence/insights/{id}      - Insight detail with evidence
```

## Pattern Detection Prompts

### Weekly Analysis Prompt
```
You are analyzing recent space science news and discoveries.
Given the following items from the past week:

{news_items}

Identify:
1. CONNECTIONS: Findings from different areas that relate to each other
2. TRENDS: Topics getting increased attention
3. GAPS: Areas with observations but lacking analysis
4. ANOMALIES: Unusual findings that warrant attention

For each pattern, provide:
- Title
- Description
- Confidence score (0-1)
- Evidence/reasoning
- Related news IDs
```

## Implementation Order

1. Database migrations for new tables
2. ChromaDB setup and embedding service
3. News collector service
4. Pattern analysis service with Claude
5. API endpoints
6. Frontend dashboard
7. Chat interface
8. Alerts system

## Environment Variables

```
ANTHROPIC_API_KEY=
CHROMADB_HOST=localhost
CHROMADB_PORT=8000
```

## Cost Considerations

- Claude API: ~$0.01-0.03 per analysis batch
- Embeddings: Using Claude's embedding or voyage
- ChromaDB: Self-hosted, no cost
- Estimated monthly: $5-20 depending on volume
