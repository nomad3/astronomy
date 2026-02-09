# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Atlas X - Space Explorer is a full-stack space data aggregation dashboard with AI-powered intelligence. It pulls real-time data from NASA APIs, Launch Library, and other space data sources to display rocket launches, ISS tracking, asteroid monitoring, Mars rover photos, telescope imagery, and AI-generated insights.

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Backend**: FastAPI (Python 3.11) + PostgreSQL + Redis
- **AI/ML**: Anthropic Claude API + ChromaDB (vector DB) + sentence-transformers
- **Maps**: Leaflet for ISS tracking
- **Container**: Docker & Docker Compose

## Quick Start

```bash![alt text](image.png)
# Docker (recommended)
cp .env.example .env
docker-compose up --build
# Frontend: http://localhost:3000
# API docs: http://localhost:8000/docs

# Local development
# Backend
cd server && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt && uvicorn main:app --reload

# Frontend
cd client && npm install && npm run dev
```

## Commands

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | client | Start Next.js dev server (port 3000) |
| `npm run build` | client | Production build |
| `npm run lint` | client | ESLint v9 check |
| `uvicorn main:app --reload` | server | Start FastAPI (port 8000) |
| `docker-compose logs -f server` | root | View backend logs |
| `docker-compose restart client` | root | Restart frontend container |
| `docker-compose -f docker-compose.prod.yml up` | root | Production deployment |

## Architecture

```
Next.js Frontend (3000) → FastAPI Backend (8000) → External APIs (NASA, Launch Library)
                                                 → PostgreSQL (persistence)
                                                 → Redis (caching)
                                                 → ChromaDB (vector embeddings)
                                                 → Claude API (AI enrichment)
```

**Data Flow**: Frontend makes typed API calls via `client/src/lib/api.ts` → Backend routers in `server/api/endpoints/` → Services fetch from external APIs → Redis caches responses with TTLs (5min for launches → 12hrs for telescope images).

**AI Enrichment Flow**: APScheduler runs daily at 2 AM UTC → `enrichment_service.py` fetches upcoming launches → Claude API generates crew profiles, mission context, technical details → Results stored in `EnrichedContent` table with 7-day TTL.

## Key Directories

| Path | Purpose |
|------|---------|
| `client/src/app/` | Next.js App Router pages (dashboard, /launches, /iss, /asteroids, /weather, /mars, /gallery, /telescopes, /intelligence) |
| `client/src/components/` | React components (dashboard widgets, layout, ISS map, intelligence chat) |
| `client/src/lib/api.ts` | Centralized typed API client - all backend calls go through here |
| `server/api/endpoints/` | FastAPI routers (launches, asteroids, space-weather, iss-tracking, mars, telescopes, intelligence) |
| `server/services/` | External API integrations + AI services (enrichment_service.py, intelligence_service.py, chat_service.py) |
| `server/db/models.py` | SQLAlchemy models (SpaceNews, Insight, EnrichedContent, ChatConversation, Alert) |
| `server/core/config.py` | Pydantic Settings for env vars (NASA_API_KEY, DATABASE_URL, REDIS_URL, ANTHROPIC_API_KEY) |
| `server/core/cache.py` | Async Redis caching utilities |

## AI Systems

**Enrichment Service** (`server/services/enrichment_service.py`): Uses Claude API to generate rich content for launches (crew profiles, mission objectives, historical context). Runs daily via APScheduler. Stores in `EnrichedContent` table.

**Intelligence Service** (`server/services/intelligence_service.py`): Analyzes collected news to detect patterns (connections, trends, gaps, anomalies). Results stored as `Insight` records with confidence scores.

**RAG Chat** (`server/services/chat_service.py`): Q&A system using ChromaDB for vector search over news/insights, with Claude generating contextual responses. History stored in `ChatConversation` table.

## API Conventions

- All frontend API calls use the typed client in `client/src/lib/api.ts`
- Backend endpoints follow RESTful patterns under `/api` prefix
- Request/response schemas defined in `server/schemas/`
- External API responses are cached in Redis with data-specific TTLs

## Configuration

- **Frontend env**: `NEXT_PUBLIC_API_URL` in `.env`
- **Backend env**: `NASA_API_KEY`, `DATABASE_URL`, `REDIS_URL` in `.env`
- **Next.js images**: Remote patterns configured in `client/next.config.ts` for nasa.gov, thespacedevs.com
- **API proxy**: Next.js rewrites `/api/*` to backend in development

## Adding Features

**New API endpoint**: Create router in `server/api/endpoints/`, add schemas in `server/schemas/`, register in `server/api/router.py`, add typed function in `client/src/lib/api.ts`.

**New dashboard widget**: Create component in `client/src/components/dashboard/`, add to dashboard page in `client/src/app/page.tsx`.
