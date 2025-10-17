# Gemini Project Context: Astronomy Starship Control Deck

This document serves as a concise summary of the 'Astronomy Starship Control Deck' project, designed to provide quick context and reference for development and understanding.

## 1. Project Overview

The Astronomy Starship Control Deck is a futuristic web application that functions as a space exploration command center. It provides real-time analytics, mission tracking, and threat monitoring by integrating with various NASA and space agency APIs. The application features a visually rich, sci-fi themed user interface.

**Key Technologies:**
- **Frontend**: Next.js 13.5.11 (React 18, App Router), TypeScript, Material-UI (MUI) 7.3.4, Recharts, Three.js 0.180.0, React Three Fiber 8.18.0, Drei 9.122.0, Leaflet.
- **Backend**: FastAPI (Python 3.11+), PostgreSQL 13 (SQLAlchemy ORM), Redis 6 (caching), HTTPX, Pydantic 2.
- **DevOps**: Docker, Docker Compose.

## 2. Architecture

The project follows a client-server architecture:

-   **Client (Next.js)**: A single-page application responsible for the user interface and interaction. It fetches data from the FastAPI backend.
-   **Server (FastAPI)**: A Python-based API that acts as a proxy and aggregator for various external space APIs. It also handles database operations and caching.
-   **Database (PostgreSQL)**: Stores persistent data, likely for celestial objects or mission-related information.
-   **Cache (Redis)**: Used by the FastAPI backend to cache responses from external APIs, reducing API calls and improving performance.

**Data Flow:**
Client (Next.js) <--- HTTP/REST API ---> Server (FastAPI) <--- External APIs (NASA, Launch Library) / PostgreSQL / Redis

## 3. Key Features

-   **Cinematic Landing Page**: Epic launch sequence, countdown, feature cards.
-   **Real-time Analytics Dashboard**: KPIs, various charts (area, bar, donut) for missions, launches, system health.
-   **3D Solar System Visualization**: Interactive 3D model of the solar system.
-   **Live ISS Tracking**: Real-time position on an interactive map.
-   **Mission Control**: Detailed mission status, launch calendar with T-minus countdowns.
-   **Planetary Defense**: Asteroid tracking (Near-Earth Objects), space weather monitoring (solar flares, CMEs).
-   **Mars Exploration**: Mars Rover photo gallery, Martian weather data.
-   **Earth Observation**: EPIC Earth full-disk images from DSCOVR satellite.
-   **Astronomy Picture of the Day (APOD)**: Daily NASA imagery and explanations.

## 4. Development Setup

### Using Docker (Recommended)

```bash
git clone https://github.com/nomad3/astronomy.git
cd astronomy
cat > server/.env << EOF
DATABASE_URL=postgresql://user:password@db:5432/astronomy
REDIS_URL=redis://redis:6379
NASA_API_KEY=your_nasa_api_key_here
EOF
docker-compose up --build -d
```

Access: Frontend (http://localhost:3000), Backend API (http://localhost:8000), API Docs (http://localhost:8000/docs).

### Local Development (Without Docker)

**Backend Setup:**
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create .env file with DATABASE_URL, REDIS_URL, NASA_API_KEY
uvicorn main:app --reload
```

**Frontend Setup:**
```bash
cd client
npm install
npm run dev
```

## 5. Important Files and Directories

-   `/client`: Next.js frontend application.
    -   `/client/src/app`: Main application pages and layout.
    -   `/client/src/components`: Reusable React components (dashboard, UI, visualizations).
    -   `/client/src/app/theme.ts`: MUI theme customization.
    -   `/client/src/app/globals.css`: Global styles, animations (scanline, flicker).
-   `/server`: FastAPI backend application.
    -   `/server/api/endpoints`: API route definitions (missions, launches, mars, etc.).
    -   `/server/services`: Logic for interacting with external APIs.
    -   `/server/core/config.py`: Pydantic settings for environment variables.
    -   `/server/db`: Database initialization and session management.
    -   `/server/models`: SQLAlchemy ORM models.
    -   `/server/schemas`: Pydantic schemas for request/response validation.
-   `docker-compose.yml`: Defines the multi-container Docker environment.
-   `README.md`: Project documentation (updated).

## 6. API Endpoints (Base URL: `http://localhost:8000/api`)

-   `/missions`, `/launches`: Mission and launch data.
-   `/asteroids`, `/space-weather`: Planetary defense data.
-   `/iss-tracking`, `/astronomy-images/apod`: Tracking and observation data.
-   `/mars/rover-photos`, `/mars/weather`, `/earth/epic`: Mars and Earth observation data.
-   `/celestial-objects`: CRUD operations for celestial objects.

Interactive API Documentation available at `http://localhost:8000/docs`.

## 7. Performance & Caching

-   **Redis Caching**: Implemented in the backend to cache responses from external APIs.
-   **Cache Durations**: Optimized for each data type (e.g., APOD: 6 hours, Space Weather: 10 minutes).
-   **Rate Limit Management**: Designed to respect NASA API rate limits (1,000 requests/hour with personal key).

## 8. Troubleshooting

-   **API Rate Limits (429 errors)**: Obtain a personal NASA API key and update `server/.env`. Restart the server.
-   **Port Conflicts**: Use `lsof -i :<port>` to identify conflicting processes or modify `docker-compose.yml` ports.
-   **Docker Build Fails**: Perform a clean rebuild (`docker-compose down -v && docker system prune -f && docker-compose build --no-cache && docker-compose up`).
-   **Hydration Warnings**: Addressed by using `mounted` state flags in time-based components.

## 9. Roadmap / Future Considerations

-   Additional chart types.
-   User authentication.
-   Mission favorites/bookmarks.
-   Email alerts.
-   Mobile app (React Native).
-   Voice commands interface.
-   AR/VR control deck experience.
-   Real-time chat/collaboration.
-   Custom mission planning tools.
-   Export data to CSV/PDF.
