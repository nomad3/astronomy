# 🚀 Space Exploration Data Dashboard

A comprehensive full-stack space exploration data application that aggregates and visualizes real-time space-related data from various APIs. Built with FastAPI, Next.js, and Three.js, this application provides an interactive dashboard for tracking space missions, celestial objects, ISS location, and more.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=flat&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-enabled-2496ED?style=flat&logo=docker)

## ✨ Features

### 🌟 Visualizations
- **3D Solar System**: Interactive 3D visualization of our solar system using Three.js
- **ISS Live Tracker**: Real-time International Space Station location tracking with interactive map
- **Celestial Objects Explorer**: Browse and explore various celestial objects in our universe

### 📊 Dashboard Components
- **Mission Status**: Track active space missions and their current status
- **Launch Calendar**: View upcoming rocket launches and space missions
- **Astronomy Picture of the Day**: Daily stunning space imagery from NASA
- **Space Weather**: Current space weather conditions and solar activity
- **Asteroid Tracking**: Near-Earth asteroid monitoring and data

### 🔧 Technical Features
- Real-time data updates
- RESTful API with comprehensive endpoints
- PostgreSQL database for data persistence
- Redis caching for improved performance
- Responsive Material-UI design
- Docker containerization for easy deployment
- TypeScript for type safety
- FastAPI automatic API documentation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Next.js)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Components: Dashboard, Visualizations, UI        │   │
│  │  - Solar System (Three.js)                        │   │
│  │  - ISS Tracker (Leaflet)                          │   │
│  │  - Mission Status, Launch Calendar, APOD          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                   Server (FastAPI)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Endpoints:                                   │   │
│  │  - Celestial Objects  - Missions                  │   │
│  │  - ISS Tracking       - Asteroids                 │   │
│  │  - Astronomy Images   - Space Weather             │   │
│  │  - Launches                                        │   │
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
- **Framework**: Next.js 13.5 (React 18)
- **Language**: TypeScript 5
- **UI Library**: Material-UI (MUI) 7.3
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Maps**: Leaflet, React Leaflet
- **Styling**: Emotion (CSS-in-JS)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: PostgreSQL 13
- **Cache**: Redis 6
- **ORM**: SQLAlchemy
- **Server**: Uvicorn (ASGI)
- **HTTP Client**: HTTPX

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL with persistent volumes
- **Caching**: Redis
- **Hot Reload**: Enabled for both frontend and backend

## 📋 Prerequisites

- **Docker** and **Docker Compose** (recommended)
  - Docker version 20.10+
  - Docker Compose version 1.29+

**OR**

- **Node.js** 18+ and **npm** (for client)
- **Python** 3.9+ and **pip** (for server)
- **PostgreSQL** 13+
- **Redis** 6+

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/astronomy.git
cd astronomy
```

2. **Create environment file**
```bash
# Create .env file in the server directory
cat > server/.env << EOF
DATABASE_URL=postgresql://user:password@db:5432/astronomy
REDIS_URL=redis://redis:6379
NASA_API_KEY=your_nasa_api_key_here
EOF
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

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

4. **Set up environment variables**
```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/astronomy
export REDIS_URL=redis://localhost:6379
export NASA_API_KEY=your_nasa_api_key_here
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

The API is available at `http://localhost:8000/api` and includes the following endpoints:

### Celestial Objects
- `GET /api/celestial-objects` - List all celestial objects
- `GET /api/celestial-objects/{id}` - Get specific celestial object
- `POST /api/celestial-objects` - Create new celestial object
- `PUT /api/celestial-objects/{id}` - Update celestial object
- `DELETE /api/celestial-objects/{id}` - Delete celestial object

### Missions
- `GET /api/missions` - Get all space missions
- `GET /api/missions/{id}` - Get specific mission details

### ISS Tracking
- `GET /api/iss/current-location` - Get current ISS location
- `GET /api/iss/trajectory` - Get ISS trajectory data

### Asteroids
- `GET /api/asteroids/near-earth` - Get near-Earth asteroids
- `GET /api/asteroids/{id}` - Get specific asteroid data

### Astronomy Images
- `GET /api/astronomy-images/apod` - Get Astronomy Picture of the Day
- `GET /api/astronomy-images/archive` - Browse image archive

### Space Weather
- `GET /api/space-weather/current` - Get current space weather data
- `GET /api/space-weather/solar-flares` - Get solar flare data

### Launches
- `GET /api/launches/upcoming` - Get upcoming launches
- `GET /api/launches/{id}` - Get specific launch details

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## 📁 Project Structure

```
astronomy/
├── client/                      # Next.js frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── app/                 # Next.js 13 app directory
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── globals.css      # Global styles
│   │   │   ├── theme.ts         # MUI theme configuration
│   │   │   └── ThemeRegistry.tsx
│   │   └── components/
│   │       ├── dashboard/       # Dashboard components
│   │       │   ├── AstronomyPictureOfTheDay.tsx
│   │       │   ├── LaunchCalendar.tsx
│   │       │   └── MissionStatus.tsx
│   │       ├── ui/              # Reusable UI components
│   │       │   └── PlanetCard.tsx
│   │       └── visualizations/  # 3D and map visualizations
│   │           ├── SolarSystem.tsx
│   │           ├── ISSTrackerMap.tsx
│   │           └── Map.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile.dev
│
├── server/                      # FastAPI backend application
│   ├── api/
│   │   ├── endpoints/          # API endpoint modules
│   │   │   ├── asteroids.py
│   │   │   ├── astronomy_images.py
│   │   │   ├── celestial_objects.py
│   │   │   ├── iss_tracking.py
│   │   │   ├── launches.py
│   │   │   ├── missions.py
│   │   │   └── space_weather.py
│   │   ├── deps.py             # Dependencies
│   │   └── router.py           # API router
│   ├── core/
│   │   └── config.py           # Configuration settings
│   ├── crud/                   # Database operations
│   │   └── crud_celestial_object.py
│   ├── db/                     # Database setup
│   │   ├── base.py
│   │   ├── init_db.py
│   │   └── session.py
│   ├── models/                 # SQLAlchemy models
│   │   └── celestial_object.py
│   ├── schemas/                # Pydantic schemas
│   │   └── celestial_object.py
│   ├── services/               # Business logic
│   ├── main.py                 # Application entry point
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml          # Docker Compose configuration
└── README.md
```

## ⚙️ Environment Variables

### Server (.env)

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@db:5432/astronomy

# Redis Configuration
REDIS_URL=redis://redis:6379

# NASA API Key (Get your free key at https://api.nasa.gov/)
NASA_API_KEY=your_nasa_api_key_here
```

### Getting a NASA API Key

1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Fill out the API Key request form
3. You'll receive your API key via email instantly
4. Add the key to your `.env` file

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
```

### Database Migrations

The database is automatically initialized on server startup. To manually initialize:

```bash
cd server
python -c "from db.init_db import init_db; init_db()"
```

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **celestial_objects**: Stores information about celestial bodies
- **missions**: Space mission data and status
- **launches**: Rocket launch information
- **cached_data**: Redis cache for API responses

## 🔍 API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐳 Docker Services

The `docker-compose.yml` defines four services:

1. **server**: FastAPI backend (port 8000)
2. **client**: Next.js frontend (port 3000)
3. **db**: PostgreSQL database (port 5432)
4. **redis**: Redis cache (port 6379)

### Useful Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Access service shell
docker-compose exec server bash
docker-compose exec client sh
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA API**: For providing amazing space data and imagery
- **ISS Location API**: For real-time ISS tracking data
- **Three.js**: For 3D visualization capabilities
- **Material-UI**: For beautiful React components
- **FastAPI**: For the excellent Python web framework

## 📧 Contact

Project Link: [https://github.com/yourusername/astronomy](https://github.com/yourusername/astronomy)

---

**Made with ❤️ for space enthusiasts**
