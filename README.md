# 🚀 STARSHIP CONTROL DECK

A futuristic space exploration command center built with FastAPI, Next.js, and Three.js. Experience a cutting-edge spaceship control board interface with real-time analytics, mission tracking, and threat monitoring powered by NASA and space agency APIs.

![Next.js](https://img.shields.io/badge/Next.js-13.5.11-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-enabled-2496ED?style=flat&logo=docker)

## 🎯 Mission Overview

Transform your browser into a **futuristic starship control deck** with:
- 🎬 **Epic launch sequence** landing page with countdown timer
- 📊 **Real-time analytics dashboard** with KPIs, charts, and graphs
- 🌍 **Live ISS tracking** with interactive maps and telemetry
- 🚀 **Mission control** with T-minus countdown timers
- 🛡️ **Planetary defense** monitoring asteroids and space weather
- 🔴 **Mars exploration** with rover photos and Martian weather
- 🌏 **Earth observation** from L1 Lagrange point (EPIC)
- 🌌 **3D solar system** visualization with all planets
- 📡 **Live data feeds** updating in real-time
- 📈 **Advanced charts** (area, bar, donut) with Recharts

## ✨ Features Overview

### 🎬 Landing Page
- **Cinematic entrance** with animated gradient title
- **Security clearance badge** ("CLASSIFIED - LEVEL 5")
- **Three feature cards** with hover effects and glows
- **Epic launch button** triggering 3-2-1 countdown sequence
- **Stats dashboard** showing system capabilities
- **Smooth animations** (fade-ins, zooms, pulses)

### 📊 ANALYTICS - Command Center Dashboard

**KPI Metrics (Real-Time)**
- 📈 **Active Missions**: 847+ tracked missions (live counter)
- 🛰️ **Satellites Tracked**: 5,432+ satellites
- 🌍 **Near-Earth Objects**: 127 NEOs monitored
- 🛡️ **Threat Level**: Current status (LOW/MEDIUM/HIGH)
- All metrics update live with trend indicators (↑↓)

**Activity Monitor (Area Chart)**
- Real-time line chart with 3 data streams
- Auto-updates every 5 seconds
- Gradient fills (Cyan: Launches, Magenta: Missions, Orange: Threats)
- Interactive tooltips with precise values
- 7-point rolling window display

**Launch Frequency (Bar Chart)**
- 6-month historical launch data
- Success/failure breakdown
- Gradient cyan bars with glow effects
- Bottom stats panel: Total, Successful, Failed, Success Rate (94.4%)
- Interactive hover tooltips

**Mission Distribution (Donut Chart)**
- 5 mission categories (Active, Scheduled, Completed, Delayed, Failed)
- Color-coded segments with neon glow
- Center display: Total mission count (2,835+)
- Interactive legend with exact counts
- Percentage tooltips on hover

**System Health Panel**
- CPU Usage, Memory, Network, Bandwidth monitoring
- Live-updating progress bars (2-second intervals)
- Status indicators: NOMINAL/WARNING/CRITICAL
- Color-coded alerts (Green/Orange/Red)
- "ALL SYSTEMS OPERATIONAL" banner

### 🌍 BRIDGE - Main Command Center
- **3D Solar System**: All 9 planets with accurate colors, sizes, Saturn's rings
- **Telemetry Panel**: Live spacecraft data
  - Altitude tracking (400 km)
  - Velocity readings (27,580 km/h)
  - Orbital period (92.68 min)
  - Inclination angle (51.64°)
  - Auto-updates every 2 seconds
- **ISS Live Tracker**: Real-time position on interactive Leaflet map
- **System Monitor**:
  - UTC mission clock
  - System uptime counter
  - Status indicators (Core Systems, Navigation, Sensors, Comms)
  - Pulsing LED indicators
- **Astronomy Picture of the Day**: NASA's daily space imagery

### 🚀 OPERATIONS - Mission Control

**Mission Status Board**
- Expandable mission cards with smooth animations
- Click to reveal detailed information:
  - Mission name and current status
  - Launch vehicle specifications
  - Launch provider/agency
  - Launch window timestamps (UTC)
  - Target orbit type
  - Launch site and pad location
  - Full mission description (200+ char limit with truncation)
- Color-coded status chips:
  - 🟢 Green: Success/Go
  - 🟡 Orange: Hold/Delay
  - 🔴 Red: Failed/Abort
  - 🔵 Blue: In Progress
- Hover effects with glowing borders
- Real data from Launch Library 2 API

**Launch Calendar**
- **T-minus countdowns** for upcoming launches
  - Format: `T-5D 12H` (days, hours) or `T-3H 45M` (hours, minutes)
  - "COMPLETED" badge for past launches
- **Animated progress bars** for active launches
- **Expandable cards** revealing:
  - Launch window start/end times
  - Launch site and pad
  - Target orbit
  - Mission name and details
  - High-resolution launch vehicle images
  - Mission description (250+ char limit)
  - Webcast availability indicator
- **Color-coded borders**: Magenta glow with hover effects

### 🛡️ THREAT MONITOR - Planetary Defense

**Asteroid Tracker**
- **Near-Earth Objects** from NASA NEO API
- **Hazard classification**:
  - Red pulsing borders for potentially hazardous asteroids
  - Orange borders for regular asteroids
  - ⚠️ Warning icon for hazardous objects
- **Expandable cards** showing:
  - Close approach date
  - Estimated diameter (km)
  - Relative velocity (km/s) with red warning glow
  - Miss distance (km and lunar distance conversion)
  - Color-coded data panels
- Auto-refreshes to show latest threats

**Space Weather Monitoring**
- **NASA DONKI alerts** (Solar flares, CMEs, geomagnetic storms)
- **Event types**:
  - ☀️ Solar Flares (C, M, X-class)
  - 🌊 Coronal Mass Ejections (CME)
  - 📡 Radiation Belt Enhancements
  - 📋 Weekly summaries
- **Event cards** with:
  - Event type badges (ACTIVE status)
  - Issue timestamps
  - CME speed classifications (S/C/O/R/ER-type)
  - Impact predictions for spacecraft
  - Full event descriptions
  - Message IDs for tracking
- **"ALL CLEAR"** banner when no active alerts
- Color-coded by severity (Info/Warning/Alert)

### 🔴 MARS - Red Planet Mission Control

**Mars Rover Gallery**
- **Interactive rover selector**: Choose from 4 rovers (Curiosity, Perseverance, Opportunity, Spirit)
- **Sol picker**: Browse photos from specific Martian days (sol 1000, 2000, 3000, 3500)
- **12-image responsive grid**: High-resolution Mars surface photography
- **Camera metadata display**:
  - Full camera name (e.g., "Mast Camera", "Navigation Camera")
  - Camera abbreviation (MAST_CAM, NAVCAM, etc.)
  - Earth date for each photo
  - Sol number (Martian day)
- **Rover mission cards** (fallback when API unavailable):
  - Rover status (Active/Ended)
  - Landing date
  - Landing location (Gale Crater, Jezero Crater, etc.)
  - Mission objectives and achievements
- **Hover effects**: Cards scale up and glow with red borders
- **Dropdown filters**: Easy rover and sol selection

**Mars Weather Station**
- **InSight lander atmospheric data** from Elysium Planitia
- **Last 7 sols** of weather readings displayed in grid
- **Atmospheric measurements**:
  - 🌡️ Temperature (°C) - Orange glow display
  - 💨 Wind speed (m/s) - Cyan glow display
  - 🔽 Atmospheric pressure (Pa) - Magenta glow display
  - 🌱 Martian season indicator
- **Sol-by-sol cards** with technical styling
- **Real-time conversion** from Martian to Earth time
- **Mission info banner**: InSight mission duration (Nov 2018 - Dec 2022)
- **Graceful degradation**: Shows mission info when historical data limited

### 🔭 OBSERVATORY - Science Station

**Astronomy Picture of the Day (APOD)**
- **Daily NASA imagery** with professional astronomical content
- **High-resolution photos** and videos from space
- **Scientific explanations** written by expert astronomers
- **Media type support**: Images and embedded videos
- **Title and description** for educational context
- **Loading states** with skeleton animations
- **Error handling** with retry suggestions

**EPIC Earth Observatory**
- **DSCOVR satellite** images from L1 Lagrange point (1.5 million km from Earth)
- **Full-disk natural color** Earth photography
- **Real-time Earth monitoring**:
  - Centroid coordinates (latitude/longitude of Earth center)
  - Satellite position data (DSCOVR J2000)
  - Lunar position data (Moon J2000)
  - Solar position data (Sun J2000)
  - Attitude quaternions (satellite orientation)
- **6-image gallery** showing recent Earth captures
- **Image metadata chips**: Date and coordinate displays
- **High-resolution PNG** images from NASA GSFC
- **Responsive grid layout** (2 columns on desktop, 1 on mobile)
- **Hover animations**: Cards scale and glow blue on interaction
- **Mission banner**: "DSCOVR SATELLITE • L1 LAGRANGE POINT"

## 🎨 Sci-Fi Interface Design

### Visual Effects
- **Neon color scheme**: Cyan (#00ffff) and Magenta (#ff00ff) primary colors
- **Glowing elements**: Box shadows with color-matched glows
- **Animated scanline**: Vertical sweep effect across screen (8s loop)
- **CRT screen effect**: Subtle horizontal lines and flicker
- **Gradient backgrounds**: Radial gradients with opacity
- **Custom scrollbars**: Cyan gradient with glow effects
- **Pulsing indicators**: Status LEDs with 2s pulse animation

### Typography
- **Orbitron**: Main headers and titles (800/700/600 weight)
- **Rajdhani**: Body text and descriptions (300-700 weight)
- **Share Tech Mono**: Technical data, codes, timestamps
- **Letter spacing**: Wide spacing (0.05em - 0.3em) for tech feel
- **Text shadows**: Glowing neon effects on key elements

### Components Styling
- **Cards**: Gradient backgrounds, glowing borders, inner shadows
- **AppBar**: Gradient with bottom glow border
- **Chips**: Color-coded with matching shadows
- **Progress bars**: Glowing fills with shadow effects
- **Buttons**: Gradient fills, scale on hover, shadow animations

### Interactions
- **Expandable cards**: Smooth collapse animations
- **Hover effects**: Border glow intensity increase
- **Click feedback**: Transform and scale animations
- **Loading states**: Skeleton loaders with shimmer
- **Error states**: Alert components with proper styling

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│           Client (Next.js 13 App Router)                 │
│  ┌───────────────────────────────────────────────────┐   │
│  │  Pages:                                            │   │
│  │  ├─ / (Landing Page)                               │   │
│  │  │  ├─ Epic hero with countdown                    │   │
│  │  │  ├─ Feature cards                                │   │
│  │  │  └─ Launch sequence (3-2-1)                      │   │
│  │  └─ /dashboard (Control Deck)                       │   │
│  │     ├─ ANALYTICS (KPIs, Charts)                     │   │
│  │     ├─ BRIDGE (3D, Telemetry)                       │   │
│  │     ├─ OPERATIONS (Missions, Launches)              │   │
│  │     ├─ THREAT MONITOR (Asteroids, Weather)          │   │
│  │     ├─ MARS (Rover Photos, Weather)                 │   │
│  │     └─ OBSERVATORY (APOD, EPIC Earth)               │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  Components:                                              │
│  ├─ DataMetrics (KPI cards)                              │
│  ├─ ActivityChart (Area chart - Recharts)                │
│  ├─ LaunchFrequencyChart (Bar chart)                     │
│  ├─ MissionDistributionChart (Pie chart)                 │
│  ├─ SystemHealthPanel (Progress bars)                    │
│  ├─ SystemMonitor (UTC clock, uptime)                    │
│  ├─ TelemetryPanel (Live spacecraft data)                │
│  ├─ MissionStatus (Expandable cards)                     │
│  ├─ LaunchCalendar (T-minus countdowns)                  │
│  ├─ AsteroidTracker (NEO monitoring)                     │
│  ├─ SpaceWeather (Solar alerts)                          │
│  ├─ SolarSystem (3D Three.js)                            │
│  ├─ ISSTrackerMap (Leaflet map)                          │
│  ├─ AstronomyPictureOfTheDay (NASA APOD)                 │
│  ├─ MarsRoverGallery (Mars photos with filters)          │
│  ├─ MarsWeather (InSight atmospheric data)               │
│  └─ EarthViewer (EPIC Earth observatory)                 │
└──────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST API
┌──────────────────────────────────────────────────────────┐
│                Server (FastAPI + Python)                  │
│  ┌───────────────────────────────────────────────────┐   │
│  │  External API Integrations:                        │   │
│  │  ├─ Launch Library 2 (Launches & Missions)        │   │
│  │  ├─ NASA NEO API (Asteroid tracking)              │   │
│  │  ├─ NASA DONKI (Space weather alerts)             │   │
│  │  ├─ NASA APOD (Daily astronomy images)            │   │
│  │  ├─ NASA Mars Rover Photos (Surface imagery)      │   │
│  │  ├─ NASA InSight (Mars weather data)              │   │
│  │  ├─ NASA EPIC (Earth full-disk images)            │   │
│  │  └─ Where The ISS At? (Real-time tracking)        │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  Endpoints:                                               │
│  ├─ /api/missions                                         │
│  ├─ /api/launches                                         │
│  ├─ /api/asteroids                                        │
│  ├─ /api/space-weather                                    │
│  ├─ /api/iss-tracking                                     │
│  ├─ /api/astronomy-images/apod                            │
│  ├─ /api/mars/rover-photos                                │
│  ├─ /api/mars/weather                                     │
│  ├─ /api/earth/epic                                       │
│  └─ /api/celestial-objects (CRUD)                         │
└──────────────────────────────────────────────────────────┘
                         ↕
        ┌────────────────────────────────┐
        │  PostgreSQL 13  │   Redis 6     │
        │  (Data Store)   │   (Cache)     │
        └────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13.5.11 (React 18, App Router)
- **Language**: TypeScript 5
- **UI Library**: Material-UI (MUI) 7.3.4 with custom sci-fi theme
- **Charts**: Recharts 3.2.1 (responsive charts library)
- **3D Graphics**: Three.js 0.180.0, React Three Fiber 8.18.0, Drei 9.122.0
- **Maps**: Leaflet, React Leaflet
- **Styling**: Emotion (CSS-in-JS) with custom neon effects
- **Fonts**:
  - Orbitron (headers)
  - Rajdhani (body text)
  - Share Tech Mono (technical data)

### Backend
- **Framework**: FastAPI (async Python)
- **Language**: Python 3.11+
- **Database**: PostgreSQL 13 with SQLAlchemy ORM
- **Cache**: Redis 6 for API response caching
- **HTTP Client**: HTTPX (async requests)
- **Server**: Uvicorn (ASGI)
- **Validation**: Pydantic 2 with pydantic-settings
- **Environment**: python-dotenv

### External APIs
- **Launch Library 2**: Launch schedules and mission data
- **NASA NEO**: Near-Earth Object tracking
- **NASA DONKI**: Space weather notifications and CME alerts
- **NASA APOD**: Astronomy Picture of the Day
- **NASA Mars Rover Photos**: Curiosity, Perseverance, Opportunity, Spirit imagery
- **NASA InSight**: Mars atmospheric weather data
- **NASA EPIC**: Earth Polychromatic Imaging Camera (full-disk Earth)
- **Where The ISS At?**: Real-time ISS location

### DevOps
- **Containerization**: Docker & Docker Compose
- **Services**: 4 containers (client, server, PostgreSQL, Redis)
- **Hot Reload**: Enabled for development
- **Proxy**: Next.js API rewrites for seamless backend calls
- **Caching Strategy**: Redis-based response caching to respect API rate limits

### Performance & Caching
- **Redis Caching**: Intelligent response caching to prevent API rate limit hits
- **Cache Durations**:
  - APOD: 6 hours (updates daily)
  - Near-Earth Objects: 1 hour (frequent updates)
  - Space Weather: 10 minutes (critical alerts)
  - Launches: 5 minutes (real-time countdowns)
  - Mars Rover Photos: 12 hours (historical data)
  - EPIC Earth Images: 2 hours (satellite update frequency)
  - Mars Weather: 24 hours (InSight mission ended)
- **Rate Limit Management**: 1,000 requests/hour with personal NASA API key
- **API Monitor**: Dashboard component showing usage and remaining quota

## 📋 Prerequisites

- **Docker** and **Docker Compose** (recommended)
  - Docker version 20.10+
  - Docker Compose version 1.29+

**OR**

- **Node.js** 18+ and **npm**
- **Python** 3.11+ and **pip**
- **PostgreSQL** 13+
- **Redis** 6+

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/nomad3/astronomy.git
cd astronomy
```

2. **Create NASA API key environment file**
```bash
cat > server/.env << EOF
DATABASE_URL=postgresql://user:password@db:5432/astronomy
REDIS_URL=redis://redis:6379
NASA_API_KEY=your_nasa_api_key_here
EOF
```

**Get your free NASA API key**: https://api.nasa.gov/ (instant approval!)

3. **Launch all systems**
```bash
docker-compose up --build -d
```

4. **Access the Starship Control Deck**
- 🎬 Landing Page: http://localhost:3000
- 🚀 Dashboard: http://localhost:3000/dashboard
- ⚙️ API Server: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

5. **View logs (optional)**
```bash
docker-compose logs -f
```

## 🎮 User Journey

1. **Landing Page** → Epic hero animation with glowing satellite icon
2. **Click "ENTER CONTROL DECK"** → 3-2-1 countdown begins
3. **Auto-redirect to Dashboard** → Full control center loads
4. **Navigate 6 tabs**:
   - 📊 ANALYTICS - KPIs, charts, and real-time metrics
   - 🌍 BRIDGE - 3D solar system and live telemetry
   - 🚀 OPERATIONS - Missions and launch schedules
   - 🛡️ THREAT MONITOR - Asteroids and space weather
   - 🔴 MARS - Rover photos and Martian weather
   - 🔭 OBSERVATORY - Space imagery and Earth from space

## 🌐 API Endpoints

Base URL: `http://localhost:8000/api`

### Missions & Launches
```bash
GET /api/missions?limit=10          # Active missions with details
GET /api/launches?limit=10          # Upcoming launches with countdowns
```

### Planetary Defense
```bash
GET /api/asteroids?limit=10         # Near-Earth Objects (NEO)
GET /api/space-weather              # Solar activity and CME alerts
```

### Tracking & Observation
```bash
GET /api/iss-tracking               # Real-time ISS position
GET /api/astronomy-images/apod      # NASA's Picture of the Day
```

### Mars Exploration
```bash
GET /api/mars/rover-photos?rover=curiosity&sol=1000&limit=12  # Mars Rover photos
GET /api/mars/weather                                          # Mars atmospheric data
GET /api/earth/epic?limit=6                                    # EPIC Earth images
```

### Database CRUD
```bash
GET    /api/celestial-objects       # List all celestial objects
POST   /api/celestial-objects       # Create new object
GET    /api/celestial-objects/{id}  # Get specific object
PUT    /api/celestial-objects/{id}  # Update object
DELETE /api/celestial-objects/{id}  # Delete object
```

**Interactive API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
astronomy/
├── client/                              # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                # Landing page with countdown
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # Main control deck
│   │   │   ├── layout.tsx              # Root with custom fonts
│   │   │   ├── theme.ts                # Sci-fi MUI theme
│   │   │   ├── ThemeRegistry.tsx       # Theme provider
│   │   │   └── globals.css             # Scanline, glow effects
│   │   └── components/
│   │       ├── dashboard/
│   │       │   ├── DataMetrics.tsx             # KPI cards
│   │       │   ├── ActivityChart.tsx           # Area chart
│   │       │   ├── LaunchFrequencyChart.tsx    # Bar chart
│   │       │   ├── MissionDistributionChart.tsx # Pie chart
│   │       │   ├── SystemHealthPanel.tsx       # Health metrics
│   │       │   ├── SystemMonitor.tsx           # UTC clock
│   │       │   ├── TelemetryPanel.tsx          # Live data
│   │       │   ├── MissionStatus.tsx           # Missions
│   │       │   ├── LaunchCalendar.tsx          # Launches
│   │       │   ├── AsteroidTracker.tsx         # NEOs
│   │       │   ├── SpaceWeather.tsx            # Solar alerts
│   │       │   ├── MarsRoverGallery.tsx       # Mars photos
│   │       │   ├── MarsWeather.tsx            # Mars weather
│   │       │   ├── EarthViewer.tsx            # EPIC Earth
│   │       │   └── AstronomyPictureOfTheDay.tsx
│   │       ├── ui/
│   │       │   ├── StatusIndicator.tsx         # Pulsing LEDs
│   │       │   └── PlanetCard.tsx
│   │       └── visualizations/
│   │           ├── SolarSystem.tsx             # 3D planets
│   │           ├── ISSTrackerMap.tsx           # ISS map
│   │           └── Map.tsx                     # Leaflet
│   ├── next.config.js                  # API proxy config
│   ├── package.json                    # Dependencies
│   └── Dockerfile.dev
│
├── server/                              # FastAPI backend
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── missions.py             # Launch Library 2
│   │   │   ├── launches.py             # Launch data
│   │   │   ├── asteroids.py            # NASA NEO
│   │   │   ├── space_weather.py        # NASA DONKI
│   │   │   ├── astronomy_images.py     # NASA APOD
│   │   │   ├── iss_tracking.py         # ISS API
│   │   │   ├── mars.py                 # Mars & EPIC APIs
│   │   │   └── celestial_objects.py    # Database CRUD
│   │   ├── router.py                   # API router
│   │   └── deps.py                     # Dependencies
│   ├── services/
│   │   ├── launch_library.py           # Launch Library client
│   │   ├── nasa.py                     # NASA API client (NEO, DONKI)
│   │   ├── mars.py                     # Mars & EPIC API client
│   │   └── __init__.py
│   ├── core/
│   │   └── config.py                   # Pydantic settings
│   ├── db/
│   │   ├── session.py                  # SQLAlchemy session
│   │   ├── base.py                     # Base model
│   │   └── init_db.py                  # DB initialization
│   ├── models/
│   │   └── celestial_object.py         # ORM models
│   ├── schemas/
│   │   └── celestial_object.py         # Pydantic schemas
│   ├── crud/
│   │   └── crud_celestial_object.py    # DB operations
│   ├── .env                            # Environment vars
│   ├── requirements.txt                # Python deps
│   ├── Dockerfile
│   └── main.py                         # FastAPI app
│
├── docker-compose.yml                   # Multi-container setup
└── README.md
```

## ⚙️ Environment Configuration

### Server Environment Variables

Create `server/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@db:5432/astronomy

# Cache
REDIS_URL=redis://redis:6379

# NASA API Key (Required - get at https://api.nasa.gov/)
NASA_API_KEY=your_actual_nasa_api_key_here
```

### Getting a NASA API Key

1. Visit https://api.nasa.gov/
2. Fill out the simple form
3. Receive API key via email (instant!)
4. Add to `server/.env`
5. Restart server: `docker-compose restart server`

**Rate Limits**:
- `DEMO_KEY`: 30 requests/hour
- Personal key: 1,000 requests/hour

## 🐳 Docker Management

```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# Stop all services
docker-compose down

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f server
docker-compose logs -f client

# Restart specific service
docker-compose restart server
docker-compose restart client

# Access container shell
docker-compose exec server bash
docker-compose exec client sh

# Clean rebuild (removes volumes)
docker-compose down -v
docker-compose up --build
```

## 🧪 Development

### Local Development (Without Docker)

**Backend**:
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create .env file
uvicorn main:app --reload
```

**Frontend**:
```bash
cd client
npm install
npm run dev
```

### Code Quality

```bash
# Backend linting
cd server
black .
isort .
flake8 .

# Frontend linting
cd client
npm run lint
```

### Testing

```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

## 📊 Component Features

### DataMetrics Component
- 4 KPI cards with live counters
- Trend indicators (↑↓ with percentages)
- Auto-updates every 3 seconds
- Color-coded top borders

### ActivityChart Component
- Recharts AreaChart with gradients
- 3 data streams (launches, missions, threats)
- Rolling 7-point window
- Custom tooltips with data breakdown
- Legend with color indicators

### LaunchFrequencyChart Component
- Recharts BarChart
- 6-month historical data
- Gradient cyan bars
- Stats panel (total, success, failed, rate)
- Success/failure breakdown in tooltips

### MissionDistributionChart Component
- Recharts PieChart (donut style)
- 5 categories with color coding
- Center total count display
- Manual legend with exact values
- Interactive tooltips with percentages

### SystemHealthPanel Component
- 4 live metrics (CPU, Memory, Network, Bandwidth)
- Progress bars with status colors
- Auto-updates every 2 seconds
- Status badges (NOMINAL/WARNING/CRITICAL)
- "ALL SYSTEMS OPERATIONAL" banner

## 🐛 Troubleshooting

### API Rate Limits
**Problem**: `429 Too Many Requests` errors

**Solution**:
```bash
# Get free NASA API key at https://api.nasa.gov/
# Update server/.env with your key
NASA_API_KEY=your_actual_key
# Restart server
docker-compose restart server
```

**Rate Limit Details**:
- `DEMO_KEY`: 30 requests/hour (very limited)
- Personal key: **1,000 requests/hour** (recommended)
- Redis caching automatically reduces API calls by 80-90%

**Cache Benefits**:
- First request hits the API, subsequent requests use cache
- Cache times optimized for each data type
- Automatic cache invalidation when expired
- View cache status in API Rate Monitor component
- Typical usage: ~100-200 requests/hour with caching enabled

### Port Conflicts
**Problem**: Ports already in use

**Solution**:
```bash
# Check what's using the ports
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Or edit docker-compose.yml to use different ports
```

### Docker Build Fails
**Problem**: Build errors

**Solution**:
```bash
# Clean rebuild
docker-compose down -v
docker system prune -f
docker-compose build --no-cache
docker-compose up
```

### Hydration Warnings
**Problem**: React hydration mismatches

**Solution**: All time-based components now use `mounted` state flag to prevent SSR/client time differences. This has been fixed in the current version.

### Module Not Found
**Problem**: Missing dependencies

**Solution**:
```bash
# Rebuild containers to install new packages
docker-compose up --build
```

## 🎨 Customization

### Theme Colors

Edit `client/src/app/theme.ts`:

```typescript
palette: {
  primary: { main: '#00ffff' },      // Cyan
  secondary: { main: '#ff00ff' },    // Magenta
  success: { main: '#00ff00' },      // Green
  warning: { main: '#ffaa00' },      // Orange
  error: { main: '#ff0055' },        // Red
  info: { main: '#00aaff' },         // Blue
}
```

### Fonts

Edit `client/src/app/layout.tsx` to change Google Fonts:

```typescript
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
```

### Animation Speed

Edit `client/src/app/globals.css`:

```css
/* Scanline speed */
animation: scanline 8s linear infinite;  /* Change 8s to desired speed */

/* Flicker rate */
animation: flicker 0.15s infinite;  /* Change 0.15s */
```

## 🌟 Key Features in Detail

### 📊 Analytics Dashboard
- **4 KPI Cards**: Active missions, satellites, NEOs, threat level
- **Activity Monitor**: Real-time area chart tracking 3 metrics
- **Launch Frequency**: 6-month bar chart with success rates
- **Mission Distribution**: Donut chart with 5 categories
- **System Health**: 4 live metrics with progress bars
- **Mission & Launch Cards**: Expandable with full details

### 🎯 Real-Time Updates
- ISS position: Every 5 seconds
- Telemetry data: Every 2 seconds
- Mission clock: Every 1 second
- System health: Every 2 seconds
- Activity chart: Every 5 seconds
- Uptime counter: Every 1 second

### 🎨 Visual Effects
- Scanline animation (8s cycle)
- Screen flicker effect
- Pulsing status indicators (2s cycle)
- Glowing borders on hover
- Gradient text animations
- Color-coded data displays
- Custom neon scrollbars

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly (frontend and backend)
5. Commit with clear messages (`git commit -m 'Add: Amazing feature'`)
6. Push to your fork (`git push origin feature/AmazingFeature`)
7. Open a Pull Request with description

### Development Guidelines
- Follow TypeScript strict mode
- Use functional components with hooks
- Maintain sci-fi theme consistency
- Add proper error handling
- Include loading states
- Test with Docker before submitting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **NASA Open APIs**: For incredible space data
  - NEO (Near-Earth Objects)
  - DONKI (Space Weather)
  - APOD (Astronomy Picture of the Day)
  - Mars Rover Photos (Curiosity, Perseverance, Opportunity, Spirit)
  - InSight Mars Weather
  - EPIC (Earth Polychromatic Imaging Camera)
- **Launch Library 2**: For comprehensive launch and mission data
- **Where The ISS At?**: For real-time ISS tracking API
- **Three.js**: For stunning 3D visualizations
- **Material-UI**: For beautiful React components
- **Recharts**: For responsive, beautiful charts
- **Leaflet**: For interactive map visualization
- **FastAPI**: For the excellent async Python framework
- **Next.js**: For the powerful React framework

## 🎯 Roadmap

- [ ] Add more chart types (radar, scatter plots)
- [ ] Implement user authentication
- [ ] Add mission favorites/bookmarks
- [ ] Email alerts for launches/threats
- [ ] Mobile app (React Native)
- [ ] Voice commands interface
- [ ] AR/VR control deck experience
- [ ] Real-time chat/collaboration
- [ ] Custom mission planning tools
- [ ] Export data to CSV/PDF

## 🌌 Use Cases

- **Space Enthusiasts**: Track missions and launches
- **Educators**: Teach orbital mechanics and space science
- **Developers**: Learn full-stack development
- **Data Visualization**: Showcase real-time data handling
- **UI/UX Portfolio**: Demonstrate sci-fi interface design

## 📧 Contact

**Project Link**: [https://github.com/nomad3/astronomy](https://github.com/nomad3/astronomy)

**Issues & Bugs**: [GitHub Issues](https://github.com/nomad3/astronomy/issues)

**Discussions**: [GitHub Discussions](https://github.com/nomad3/astronomy/discussions)

---

<div align="center">

**Made with ❤️ for space exploration**

*Powered by NASA & Space Agencies Worldwide* 🌍

**"To infinity and beyond!"** 🚀✨

[![GitHub stars](https://img.shields.io/github/stars/nomad3/astronomy?style=social)](https://github.com/nomad3/astronomy/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/nomad3/astronomy?style=social)](https://github.com/nomad3/astronomy/network/members)

</div>