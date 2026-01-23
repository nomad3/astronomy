# Astronomy Dashboard - Changelog

## Version 2.0.0 (2026-01-23)

### Features

#### Launch Detail Pages
- Click any launch to view full mission details
- Displays rocket specifications, provider info, mission description
- Shows launch pad location and programs
- Links to external resources (video streams, NASA JPL)
- Status updates and timeline

#### Asteroid Detail Pages
- Click any asteroid to view comprehensive data
- Orbital characteristics (eccentricity, semi-major axis, inclination)
- Estimated diameter ranges (km and meters)
- Close approach history table with dates, distances, velocities
- Observation data (first/last observed, data arc)
- Links to NASA JPL for full data

#### Interactive Dashboard
- Upcoming launches widget now links to detail pages
- Near-Earth Objects widget links to asteroid details
- "View All" links to respective list pages

#### Real-time Statistics
- Stats cards fetch actual data from APIs
- Displays: total launches, active NEOs, weather alerts, threat level
- Mission distribution by orbit type

### Improvements

#### Weather Page Layout
- "About Space Weather" info section moved to top
- Better visual hierarchy for alert notifications

#### Dashboard Styling
- Fixed card alignment issues
- Cards now stretch to fill grid cells
- Improved responsive layout

### Bug Fixes

- Fixed frontend making requests to `localhost:8100` instead of `/api`
- Fixed 502 error on launch details (rocket.configuration.family type issue)
- Fixed stats cards showing 0 (API response structure mismatch)

### Technical Changes

#### Backend
- Added `GET /launches/{id}` endpoint
- Added `GET /asteroids/{id}` endpoint
- Added `fetch_launch_by_id()` service function
- Added `fetch_asteroid_by_id()` service function
- Fixed analytics response to include flat fields for stats cards

#### Frontend
- Added `LaunchDetail` and `AsteroidDetail` TypeScript types
- Added `getLaunch()` and `getAsteroid()` API functions
- Created `/launches/[id]/page.tsx` dynamic route
- Created `/asteroids/[id]/page.tsx` dynamic route
- Updated dashboard components with Link navigation

#### Docker
- Client Dockerfile now sets `NODE_ENV=production`
- Removes `.env.local` during build to ensure production config

### Deployment

Image tag: `20260123140000`
- `gcr.io/ai-agency-479516/astronomy-server:20260123140000`
- `gcr.io/ai-agency-479516/astronomy-client:20260123140000`
