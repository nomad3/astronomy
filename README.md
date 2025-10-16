# 🚀 STARSHIP CONTROL DECK

A futuristic space exploration command center built with FastAPI, Next.js, and Three.js. This full-stack application features a cutting-edge spaceship control board interface that aggregates and visualizes real-time space data from NASA and other space agencies.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-enabled-2496ED?style=flat&logo=docker)

## 🎯 Mission Overview

Transform your browser into a **starship control deck** with real-time monitoring of:
- 🌍 Earth orbit operations and ISS tracking
- 🚀 Launch schedules with T-minus countdowns
- 🛡️ Near-Earth asteroid threats
- ☀️ Solar weather alerts and CME tracking
- 🌌 Deep space observations and celestial mechanics
- 📡 Live telemetry and system diagnostics

## ✨ Control Deck Features

### 🎨 Sci-Fi Interface Design
- **Futuristic Theme**: Cyan/Magenta neon glow with holographic effects
- **Custom Fonts**: Orbitron, Rajdhani, and Share Tech Mono for technical displays
- **Screen Effects**: Animated scanline overlay, CRT flicker, and pulsing indicators
- **Glowing UI Elements**: Color-coded status indicators with dynamic shadows
- **Expandable Data Cards**: Click to reveal detailed mission/launch information
- **Real-time Countdowns**: T-minus timers for upcoming launches

### 🛰️ BRIDGE - Main Command Center
The primary control interface featuring:
- **3D Solar System**: Interactive planetary visualization with orbital mechanics
- **Telemetry Panel**: Live-updating spacecraft data
  - Altitude tracking (km)
  - Relative velocity (km/h)
  - Orbital period (min)
  - Inclination angle (degrees)
- **ISS Live Tracker**: Real-time International Space Station location with interactive Leaflet map
- **System Monitor**:
  - Mission clock (UTC)
  - System uptime counter
  - Core systems status (Navigation, Sensors, Communications)
  - Pulsing status indicators
- **Astronomy Picture of the Day**: NASA's daily space imagery with descriptions

### 🚀 OPERATIONS - Mission Control
Comprehensive mission and launch management:
- **Mission Status Board**: Expandable mission cards showing:
  - Mission name and status (Success/Go/Hold/Failed)
  - Launch vehicle specifications
  - Launch provider information
  - Launch window timestamps
  - Mission objectives and descriptions
  - Target orbit details
  - Launch site locations
- **Launch Calendar**: Advanced countdown system with:
  - T-minus countdowns (Days, Hours, Minutes)
  - Animated progress bars for active launches
  - Launch window information
  - High-resolution mission images
  - Webcast availability indicators
  - Mission briefs with full descriptions
  - Launch site and pad information

### 🛡️ THREAT MONITOR - Planetary Defense
Real-time near-Earth object monitoring:
- **Asteroid Tracker**:
  - Near-Earth Objects (NEO) from NASA's database
  - Hazard classification with warning indicators
  - Close approach dates and times
  - Estimated diameter (km)
  - Relative velocity (km/s)
  - Miss distance (km and lunar distances)
  - Pulsing red alerts for potentially hazardous asteroids
- **Space Weather Alerts**:
  - NASA DONKI real-time notifications
  - Solar flare classifications (C, M, X-class)
  - Coronal Mass Ejection (CME) tracking
  - CME impact predictions for spacecraft
  - Geomagnetic storm warnings
  - Event issue timestamps and detailed descriptions
  - "ALL CLEAR" status when conditions are nominal

### 🔭 OBSERVATORY - Science Station
Deep space observation center:
- **Astronomy Picture of the Day**: High-resolution space imagery with scientific descriptions
- **System Diagnostics**: Real-time performance monitoring
- **Telemetry Readouts**: Live spacecraft data feeds

### 📊 Status Indicators
- **Top Command Bar**: Power, Sat-Link, Comms, Security level readouts
- **Bottom Status Bar**: System version, encrypted channel info, operational status
- **Color-coded Chips**:
  - 🟢 Green = Success/Online/Nominal
  - 🟡 Orange = Warning/Hold/Standby
  - 🔴 Red = Critical/Failed/Hazard
  - 🔵 Blue = Info/Active/Go

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Client (Next.js 13 + TypeScript)            │
│  ┌──────────────────────────────────────────────────┐   │
│  │  🎨 Spaceship Control Board Components           │   │
│  │  ├─ SystemMonitor (Real-time status)             │   │
│  │  ├─ TelemetryPanel (Live spacecraft data)        │   │
│  │  ├─ MissionStatus (Expandable cards)             │   │
│  │  ├─ LaunchCalendar (T-minus countdowns)          │   │
│  │  ├─ AsteroidTracker (NEO monitoring)             │   │
│  │  ├─ SpaceWeather (Solar alerts)                  │   │
│  │  └─ Visualizations (3D Solar System, ISS Map)    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                Server (FastAPI + Python)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Integration Services:                        │   │
│  │  ├─ Launch Library 2 API (Launches & Missions)   │   │
│  │  ├─ NASA NEO API (Asteroid tracking)             │   │
│  │  ├─ NASA DONKI API (Space weather)               │   │
│  │  ├─ NASA APOD API (Astronomy images)             │   │
│  │  └─ ISS Location API (Real-time tracking)        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕
        ┌────────────────────────────────┐
        │  PostgreSQL    │    Redis       │
        │  (Data Store)  │   (Cache)      │
        └────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 13.5 (React 18, App Router)
- **Language**: TypeScript 5
- **UI Library**: Material-UI (MUI) 7.3 with custom sci-fi theme
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Maps**: Leaflet, React Leaflet for ISS tracking
- **Styling**: Custom CSS with Emotion, neon glow effects
- **Fonts**: Orbitron (headers), Rajdhani (body), Share Tech Mono (data)

### Backend
- **Framework**: FastAPI (async Python web framework)
- **Language**: Python 3.11+
- **Database**: PostgreSQL 13 with SQLAlchemy ORM
- **Cache**: Redis 6 for API response caching
- **HTTP Client**: HTTPX (async HTTP requests)
- **Server**: Uvicorn (ASGI server)
- **Validation**: Pydantic 2 with pydantic-settings

### External APIs
- **Launch Library 2**: Real-time launch and mission data
- **NASA NEO (Near-Earth Object)**: Asteroid tracking
- **NASA DONKI**: Space weather notifications
- **NASA APOD**: Astronomy Picture of the Day
- **Where The ISS At?**: Real-time ISS location tracking

### DevOps
- **Containerization**: Docker & Docker Compose
- **Services**: 4 containers (client, server, PostgreSQL, Redis)
- **Hot Reload**: Enabled for both frontend and backend development

## 📋 Prerequisites

- **Docker** and **Docker Compose** (recommended)
  - Docker version 20.10+
  - Docker Compose version 1.29+

**OR**

- **Node.js** 18+ and **npm** (for client)
- **Python** 3.11+ and **pip** (for server)
- **PostgreSQL** 13+
- **Redis** 6+

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/nomad3/astronomy.git
cd astronomy
```

2. **Create environment file with your NASA API key**
```bash
cat > server/.env << EOF
DATABASE_URL=postgresql://user:password@db:5432/astronomy
REDIS_URL=redis://redis:6379
NASA_API_KEY=your_nasa_api_key_here
EOF
```

Get your free NASA API key at: https://api.nasa.gov/ (instant approval!)

3. **Launch all systems**
```bash
docker-compose up --build
```

4. **Access the Starship Control Deck**
- 🚀 Frontend: http://localhost:3000
- ⚙️ Backend API: http://localhost:8000
- 📚 API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to server directory**
```bash
cd server
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create .env file**
```bash
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/astronomy
REDIS_URL=redis://localhost:6379
NASA_API_KEY=your_nasa_api_key_here
EOF
```

5. **Start the server**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000

## 🌐 API Endpoints

The API is available at `http://localhost:8000/api`:

### Missions & Launches
- `GET /api/missions?limit=10` - Fetch active space missions with details
- `GET /api/launches?limit=10` - Get upcoming launches with countdown data

### Planetary Defense
- `GET /api/asteroids?limit=10` - Near-Earth Objects (NEO) tracking
- `GET /api/space-weather` - Solar activity and CME alerts

### Tracking & Observation
- `GET /api/iss-tracking` - Real-time ISS position (lat/lon/alt/velocity)
- `GET /api/astronomy-images/apod` - NASA's Astronomy Picture of the Day

### Database Operations
- `GET /api/celestial-objects` - List celestial objects from database
- `POST /api/celestial-objects` - Add new celestial object
- `GET /api/celestial-objects/{id}` - Get specific celestial object

**Interactive API Documentation**: http://localhost:8000/docs (Swagger UI)

## 📁 Project Structure

```
astronomy/
├── client/                          # Next.js frontend (Starship UI)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Main control deck with 4 tabs
│   │   │   ├── layout.tsx          # Root layout with custom fonts
│   │   │   ├── theme.ts            # Sci-fi MUI theme (cyan/magenta)
│   │   │   └── globals.css         # Scanline effects, glows, scrollbars
│   │   └── components/
│   │       ├── dashboard/
│   │       │   ├── SystemMonitor.tsx        # Real-time system status
│   │       │   ├── TelemetryPanel.tsx       # Live spacecraft telemetry
│   │       │   ├── MissionStatus.tsx        # Expandable mission cards
│   │       │   ├── LaunchCalendar.tsx       # T-minus countdowns
│   │       │   ├── AsteroidTracker.tsx      # NEO monitoring
│   │       │   ├── SpaceWeather.tsx         # Solar alerts
│   │       │   └── AstronomyPictureOfTheDay.tsx
│   │       ├── ui/
│   │       │   ├── StatusIndicator.tsx      # Pulsing status lights
│   │       │   └── PlanetCard.tsx
│   │       └── visualizations/
│   │           ├── SolarSystem.tsx          # 3D solar system (9 planets)
│   │           ├── ISSTrackerMap.tsx        # Real-time ISS map
│   │           └── Map.tsx                  # Leaflet map component
│   ├── next.config.js              # API proxy configuration
│   └── package.json
│
├── server/                          # FastAPI backend
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── missions.py         # Launch Library 2 integration
│   │   │   ├── launches.py         # Launch data with countdowns
│   │   │   ├── asteroids.py        # NASA NEO API integration
│   │   │   ├── space_weather.py    # NASA DONKI integration
│   │   │   ├── astronomy_images.py # NASA APOD integration
│   │   │   ├── iss_tracking.py     # ISS location API
│   │   │   └── celestial_objects.py
│   │   └── router.py
│   ├── services/
│   │   ├── launch_library.py       # Launch Library 2 API client
│   │   └── nasa.py                 # NASA APIs client (NEO, DONKI)
│   ├── core/
│   │   └── config.py               # Pydantic settings
│   ├── db/                         # PostgreSQL setup
│   ├── models/                     # SQLAlchemy models
│   ├── schemas/                    # Pydantic schemas
│   ├── .env                        # Environment variables (create this!)
│   ├── requirements.txt
│   └── main.py
│
└── docker-compose.yml              # 4 services: client, server, db, redis
```

## ⚙️ Environment Variables

Create `server/.env` with your NASA API key:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@db:5432/astronomy

# Redis Cache
REDIS_URL=redis://redis:6379

# NASA API Key (Get yours at https://api.nasa.gov/)
NASA_API_KEY=your_actual_nasa_api_key_here
```

### Getting a NASA API Key

1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Fill out the form (instant approval!)
3. Receive your API key via email immediately
4. Add it to your `.env` file
5. Restart the server: `docker-compose restart server`

## 🎨 UI Theme Customization

The sci-fi theme is fully customizable in `client/src/app/theme.ts`:

```typescript
primary: '#00ffff',      // Cyan glow
secondary: '#ff00ff',    // Magenta glow
success: '#00ff00',      // Green (operational)
warning: '#ffaa00',      // Orange (caution)
error: '#ff0055',        // Red (critical)
```

Fonts:
- **Orbitron**: Headers and titles
- **Rajdhani**: Body text
- **Share Tech Mono**: Telemetry data and codes

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
docker-compose logs server
docker-compose logs client

# Rebuild after changes
docker-compose up --build

# Restart specific service
docker-compose restart server
docker-compose restart client

# Access service shell
docker-compose exec server bash
docker-compose exec client sh
```

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd server
pytest

# Frontend tests
cd client
npm test
```

### Code Formatting

```bash
# Backend
cd server
black .
isort .

# Frontend
cd client
npm run lint
npm run format
```

## 📊 Features Showcase

### Real-Time Data Feeds
- ✅ ISS position updates every 5 seconds
- ✅ Launch countdowns with millisecond precision
- ✅ Live telemetry simulation
- ✅ Mission clock in UTC
- ✅ System uptime tracking

### Interactive Elements
- ✅ Click mission/launch cards to expand details
- ✅ Hover effects with glowing borders
- ✅ 3D solar system with orbit controls
- ✅ Interactive ISS tracking map
- ✅ Tab-based navigation (4 sections)

### Data Visualization
- ✅ Color-coded status indicators
- ✅ Animated progress bars
- ✅ Pulsing hazard warnings
- ✅ T-minus countdown displays
- ✅ Telemetry gauges

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### API Rate Limits
If you see `429 Too Many Requests`:
- Replace `DEMO_KEY` with your personal NASA API key
- NASA DEMO_KEY has 30 requests/hour limit
- Personal keys have 1,000 requests/hour

### Docker Issues
```bash
# Clean rebuild
docker-compose down -v
docker-compose up --build

# Check service logs
docker-compose logs server
docker-compose logs client
```

### Port Conflicts
If ports 3000, 8000, 5432, or 6379 are in use:
- Edit `docker-compose.yml` to change port mappings
- Or stop conflicting services

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA APIs**: For providing incredible space data (NEO, DONKI, APOD)
- **Launch Library 2**: For comprehensive launch and mission data
- **Where The ISS At?**: For real-time ISS tracking
- **Three.js**: For 3D visualization capabilities
- **Material-UI**: For React components
- **FastAPI**: For the excellent Python web framework

## 🌌 Screenshots

**BRIDGE - Main Command Center**
- 3D Solar System with all 9 planets
- Live ISS tracking with map
- Real-time telemetry panel
- System monitor with UTC clock

**OPERATIONS - Mission Control**
- Expandable mission cards with full details
- Launch calendar with T-minus countdowns
- Status indicators with color coding

**THREAT MONITOR - Planetary Defense**
- Near-Earth asteroid tracker with hazard alerts
- Space weather notifications (CMEs, solar flares)
- Real-time threat assessment

**OBSERVATORY - Science Station**
- NASA's Astronomy Picture of the Day
- High-resolution space imagery

## 📧 Contact

Project Link: [https://github.com/nomad3/astronomy](https://github.com/nomad3/astronomy)

---

**Made with ❤️ for space exploration • Powered by NASA & Space Agencies Worldwide**

*"To infinity and beyond!" 🚀✨*
