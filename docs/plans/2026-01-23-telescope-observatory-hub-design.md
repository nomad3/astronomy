# Telescope Observatory Hub - Design Document

## Overview

Rework the telescope section into a comprehensive observatory discovery hub for JWST and Hubble, allowing users to follow scientific discoveries as they happen.

## Goals

- Live JWST tracking (position, current target, instrument)
- Browse recent observations from MAST archive
- Follow scientific discoveries linked to actual observation data
- Enhanced image galleries for both telescopes
- Observation detail pages with program/scientist info

## Data Sources

| Feature | Source | Auth Required |
|---------|--------|---------------|
| JWST Position | Webb Tracker API (`api.jwst-hub.com`) | No |
| Observations | MAST REST API (`mast.stsci.edu`) | No |
| Discoveries | STScI News RSS / NASA News API | No |
| Gallery Images | NASA Image Library (existing) | NASA_API_KEY |

## Backend API Design

### New Dependencies

```
astroquery>=0.4.6
astropy>=6.0
```

### New Endpoints

| Endpoint | Description | Cache |
|----------|-------------|-------|
| `GET /telescopes/jwst/status` | Live position & current observation | 30s |
| `GET /telescopes/{telescope}/observations` | Recent observations from archive | 1hr |
| `GET /telescopes/{telescope}/observations/{obs_id}` | Single observation detail | 6hr |
| `GET /telescopes/discoveries` | Latest NASA/STScI news | 1hr |

### Query Parameters for `/observations`

```
?category=exoplanets|galaxies|nebulae|stars|solar_system
?instrument=NIRCam|NIRSpec|MIRI|FGS (JWST)
?instrument=ACS|WFC3|STIS|COS (Hubble)
?limit=20
?offset=0
```

### New Service

`/server/services/mast_service.py` - Wraps MAST API calls with:
- Observation queries by telescope, date, category
- Single observation detail fetching
- Coordinate handling with astropy

## Frontend Architecture

### New Types (`/client/src/lib/api.ts`)

```typescript
interface TelescopeStatus {
  telescope: "jwst" | "hubble";
  position?: {
    ra: number;
    dec: number;
    distance_km: number;
    velocity_kms: number;
  };
  current_target?: string;
  instrument?: string;
  last_updated: string;
}

interface Observation {
  obs_id: string;
  telescope: "jwst" | "hubble";
  target_name: string;
  instrument: string;
  filters: string[];
  date_observed: string;
  category: string;
  thumbnail_url?: string;
  description?: string;
  program_id?: string;
  pi_name?: string;
}

interface ObservationDetail extends Observation {
  ra: number;
  dec: number;
  exposure_time: number;
  program_title: string;
  program_description: string;
  data_products: DataProduct[];
  related_observations: Observation[];
}

interface DataProduct {
  product_id: string;
  type: string;
  size: string;
  url: string;
}

interface Discovery {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  image_url?: string;
  telescope?: "jwst" | "hubble";
  related_observations?: string[];
}
```

### New Components (`/client/src/components/telescopes/`)

| Component | Description | Reused On |
|-----------|-------------|-----------|
| `telescope-status-card.tsx` | Live status widget | Overview, JWST, Hubble pages |
| `observation-card.tsx` | Single observation preview | Feeds, search, related |
| `observation-feed.tsx` | Scrollable observation list | Overview, telescope pages |
| `discovery-card.tsx` | News/discovery item | Overview page |
| `position-tracker.tsx` | JWST L2 orbit visualization | JWST page |
| `instrument-badge.tsx` | NIRCam, MIRI styled badges | Observation cards/details |
| `image-gallery.tsx` | Reusable gallery grid | Both telescope pages |
| `category-filter.tsx` | Filter tabs for categories | Observation feeds |

### Page Structure

```
app/telescopes/
├── page.tsx                     # Overview dashboard
├── jwst/
│   └── page.tsx                 # JWST dedicated page
├── hubble/
│   └── page.tsx                 # Hubble dedicated page
└── observations/
    └── [id]/
        └── page.tsx             # Observation detail page
```

### Page Layouts

#### Overview Dashboard (`/telescopes`)

- Header with title
- Two status cards side-by-side (JWST + Hubble)
- Latest discoveries feed (horizontal scroll)
- Recent observations feed (mixed, filterable)

#### JWST Page (`/telescopes/jwst`)

- Position tracker visualization
- Status card with live data (30s refresh)
- Category filter tabs
- Observations grid
- Image gallery section

#### Hubble Page (`/telescopes/hubble`)

- Status card
- Category filter tabs
- Observations grid
- Image gallery section

#### Observation Detail (`/telescopes/observations/[id]`)

- Full image/preview
- Metadata sidebar (target, instrument, filters, date, program)
- Program description
- Related observations
- Links to data products

## Data Flow

### Caching Strategy (Redis)

| Endpoint | TTL | Reason |
|----------|-----|--------|
| `/jwst/status` | 30s | Near real-time |
| `/discoveries` | 1hr | News updates infrequently |
| `/{telescope}/observations` | 1hr | Archive data, stable |
| `/{telescope}/observations/{id}` | 6hr | Rarely changes |
| Gallery endpoints | 12hr | Existing behavior |

### Frontend Auto-refresh

JWST status card refreshes every 30 seconds when visible:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    api.getJWSTStatus().then(setStatus);
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

## Error Handling

- Backend: HTTPException with 502 for upstream failures
- Frontend: Graceful degradation with "unavailable" states
- Images: Use SafeImage component with fallbacks
- Loading: Skeleton components for all sections

## Implementation Order

1. **Backend Services**
   - Create MAST service
   - Add new endpoints to telescopes.py
   - Add dependencies

2. **Frontend Types**
   - Add interfaces to api.ts
   - Add API functions

3. **Reusable Components**
   - Build component library in order of dependency
   - TelescopeStatusCard → ObservationCard → ObservationFeed

4. **Pages**
   - Overview page (uses all components)
   - JWST page
   - Hubble page
   - Observation detail page

5. **Integration**
   - Add telescope widget to main dashboard
   - Testing and polish

## Files to Create/Modify

### Server

- `server/services/mast_service.py` (new)
- `server/api/endpoints/telescopes.py` (extend)
- `server/requirements.txt` (add deps)

### Client

- `client/src/lib/api.ts` (extend)
- `client/src/components/telescopes/telescope-status-card.tsx` (new)
- `client/src/components/telescopes/observation-card.tsx` (new)
- `client/src/components/telescopes/observation-feed.tsx` (new)
- `client/src/components/telescopes/discovery-card.tsx` (new)
- `client/src/components/telescopes/position-tracker.tsx` (new)
- `client/src/components/telescopes/instrument-badge.tsx` (new)
- `client/src/components/telescopes/image-gallery.tsx` (new)
- `client/src/components/telescopes/category-filter.tsx` (new)
- `client/src/app/telescopes/page.tsx` (rewrite)
- `client/src/app/telescopes/jwst/page.tsx` (new)
- `client/src/app/telescopes/hubble/page.tsx` (new)
- `client/src/app/telescopes/observations/[id]/page.tsx` (new)
