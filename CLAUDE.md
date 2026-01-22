# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cosmos - Space Explorer is a full-stack space data aggregation dashboard. It pulls real-time data from NASA APIs, Launch Library, and other space data sources to display rocket launches, ISS tracking, asteroid monitoring, Mars rover photos, and telescope imagery.

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Backend**: FastAPI (Python 3.11) + PostgreSQL + Redis
- **Maps**: Leaflet for ISS tracking
- **Container**: Docker & Docker Compose

## Quick Start

```bash
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

## Architecture

```
Next.js Frontend (3000) → FastAPI Backend (8000) → External APIs (NASA, Launch Library)
                                                 → PostgreSQL (persistence)
                                                 → Redis (caching)
```

**Data Flow**: Frontend makes typed API calls via `client/src/lib/api.ts` → Backend routers in `server/api/endpoints/` → Services fetch from external APIs → Redis caches responses with TTLs (5min for launches → 12hrs for telescope images).

## Key Directories

| Path | Purpose |
|------|---------|
| `client/src/app/` | Next.js App Router pages (dashboard, /launches, /iss, /asteroids, /weather, /mars, /gallery, /telescopes) |
| `client/src/components/` | React components (dashboard widgets, layout, ISS map) |
| `client/src/lib/api.ts` | Centralized typed API client - all backend calls go through here |
| `server/api/endpoints/` | FastAPI routers (launches, asteroids, space-weather, iss-tracking, mars, telescopes, etc.) |
| `server/services/` | External API integrations (launch_library.py, nasa.py, mars.py) |
| `server/core/config.py` | Pydantic Settings for env vars (NASA_API_KEY, DATABASE_URL, REDIS_URL) |
| `server/core/cache.py` | Async Redis caching utilities |

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
