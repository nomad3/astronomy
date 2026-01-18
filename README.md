# Cosmos - Space Explorer

A modern, clean space exploration dashboard built with Next.js 16 and FastAPI. Monitor launches, track the ISS, explore Mars rover imagery, and view NASA's stunning space photography.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat&logo=tailwind-css)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=flat&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-enabled-2496ED?style=flat&logo=docker)

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview with stats, launches, ISS tracker, APOD, asteroids, and space weather |
| **Launches** | Upcoming rocket launches with countdowns, images, and details |
| **ISS Tracker** | Live map showing International Space Station position |
| **Asteroids** | Near-Earth Object monitoring with hazard classification |
| **Space Weather** | Solar activity alerts from NASA DONKI |
| **Mars Explorer** | Rover photos from Curiosity, Perseverance, Opportunity & Spirit |
| **Gallery** | Astronomy Picture of the Day + DSCOVR Earth images |
| **Telescopes** | James Webb & Hubble Space Telescope imagery |

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/nomad3/astronomy.git
cd astronomy

# Copy environment example
cp .env.example .env

# Start all services
docker-compose up --build
```

Access the app:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

### Environment Variables

Create a `.env` file or edit `.env.example`:

```env
NASA_API_KEY=your_nasa_api_key  # Get free at https://api.nasa.gov/
DATABASE_URL=postgresql://user:password@db:5432/astronomy
REDIS_URL=redis://redis:6379
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js 16)                                      │
│  ├─ Dashboard      - Overview with key metrics              │
│  ├─ /launches      - Upcoming rocket launches               │
│  ├─ /iss           - Live ISS tracker map                   │
│  ├─ /asteroids     - Near-Earth Object monitoring           │
│  ├─ /weather       - Space weather alerts                   │
│  ├─ /mars          - Mars rover gallery & weather           │
│  ├─ /gallery       - APOD & Earth imagery                   │
│  └─ /telescopes    - JWST & Hubble images                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (FastAPI)                                          │
│  ├─ /api/launches          - Launch Library 2 API           │
│  ├─ /api/asteroids         - NASA NEO API                   │
│  ├─ /api/space-weather     - NASA DONKI API                 │
│  ├─ /api/iss-tracking      - Where The ISS At? API          │
│  ├─ /api/astronomy-images  - NASA APOD API                  │
│  ├─ /api/mars/*            - NASA Mars Rover & InSight      │
│  ├─ /api/earth/epic        - NASA EPIC (DSCOVR)             │
│  ├─ /api/telescopes/*      - NASA Image Library             │
│  └─ /api/analytics         - Aggregated metrics             │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        PostgreSQL        Redis          External APIs
        (Database)        (Cache)        (NASA, etc.)
```

## Tech Stack

### Frontend
- **Next.js 16** with App Router
- **TypeScript 5**
- **Tailwind CSS 4**
- **Leaflet** for maps
- **Lucide React** for icons

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** ORM
- **Redis** caching
- **PostgreSQL** database

### External APIs
- NASA (NEO, DONKI, APOD, Mars Rover, EPIC, Image Library)
- Launch Library 2
- Where The ISS At?

## Project Structure

```
astronomy/
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── launches/
│   │   │   ├── iss/
│   │   │   ├── asteroids/
│   │   │   ├── weather/
│   │   │   ├── mars/
│   │   │   ├── gallery/
│   │   │   └── telescopes/
│   │   ├── components/
│   │   │   ├── dashboard/     # Dashboard widgets
│   │   │   ├── layout/        # Sidebar, Header, MobileNav
│   │   │   ├── ui/            # Card, Badge, Button, Skeleton
│   │   │   └── iss/           # ISS Map component
│   │   └── lib/
│   │       ├── api.ts         # API client & types
│   │       └── utils.ts       # Utility functions
│   ├── Dockerfile             # Production build
│   ├── Dockerfile.dev         # Development
│   └── next.config.ts
│
├── server/                     # FastAPI backend
│   ├── api/endpoints/         # API routes
│   ├── services/              # External API clients
│   ├── core/                  # Config & caching
│   ├── db/                    # Database setup
│   ├── models/                # SQLAlchemy models
│   ├── schemas/               # Pydantic schemas
│   └── main.py
│
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── nginx.conf                  # Reverse proxy config
└── .env.example
```

## Development

### Local Development (Without Docker)

**Backend:**
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

### Docker Commands

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build

# View logs
docker-compose logs -f

# Restart service
docker-compose restart client

# Stop all
docker-compose down
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/launches` | Upcoming rocket launches |
| `GET /api/asteroids` | Near-Earth Objects |
| `GET /api/space-weather` | Solar activity alerts |
| `GET /api/iss-tracking` | Real-time ISS position |
| `GET /api/astronomy-images/apod` | Astronomy Picture of the Day |
| `GET /api/mars/rover-photos` | Mars rover imagery |
| `GET /api/mars/weather` | Mars atmospheric data |
| `GET /api/earth/epic` | Earth from DSCOVR satellite |
| `GET /api/telescopes/jwst` | James Webb images |
| `GET /api/telescopes/hubble` | Hubble images |
| `GET /api/analytics/overview` | Dashboard metrics |

Interactive docs: http://localhost:8000/docs

## Caching Strategy

| Data Type | Cache Duration |
|-----------|----------------|
| Launches | 5 minutes |
| Space Weather | 10 minutes |
| NEO Asteroids | 1 hour |
| APOD | 6 hours |
| Mars Rover Photos | 12 hours |
| EPIC Earth | 2 hours |
| JWST/Hubble | 12 hours |

## Production Deployment

1. Set production environment variables
2. Get a NASA API key at https://api.nasa.gov/
3. Run production compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

The production setup includes:
- Multi-stage Docker builds
- Nginx reverse proxy
- Redis persistence
- Health checks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- **NASA Open APIs** - NEO, DONKI, APOD, Mars Rover, EPIC, Image Library
- **Launch Library 2** - Launch and mission data
- **Where The ISS At?** - ISS tracking
- **Next.js** - React framework
- **FastAPI** - Python API framework
- **Tailwind CSS** - Styling

---

**Made for space exploration enthusiasts**

*Powered by NASA & Space Agencies Worldwide*
