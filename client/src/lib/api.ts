const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

// Types
export interface Launch {
  id: string;
  name: string;
  status: string;
  window_start: string;
  window_end: string;
  mission: string;
  mission_description: string;
  orbit: string;
  provider: string;
  pad: string;
  location: string;
  image: string | null;
  infographic: string | null;
  webcast: boolean;
  info_url: string | null;
  vid_url: string | null;
}

export interface Asteroid {
  id: string;
  name: string;
  is_potentially_hazardous: boolean;
  close_approach_date: string;
  estimated_diameter_km: number;
  relative_velocity_kms: string;
  miss_distance_km: string;
}

export interface SpaceWeatherAlert {
  messageType: string;
  messageID: string;
  messageURL: string;
  messageIssueTime: string;
  messageBody: string;
}

export interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

export interface APOD {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
  copyright?: string;
}

export interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera_name: string;
  camera: string;
  rover: string;
}

export interface MarsWeather {
  sol: string;
  temperature: { av: number; mn: number; mx: number };
  wind: { av: number; mn: number; mx: number };
  pressure: { av: number; mn: number; mx: number };
  season: string;
}

export interface EarthImage {
  identifier: string;
  caption: string;
  image_url: string;
  date: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
}

export interface TelescopeImage {
  nasa_id: string;
  title: string;
  description: string;
  image_url: string;
  date_created: string;
  keywords: string[];
}

export interface AnalyticsOverview {
  total_upcoming_launches: number;
  active_neos: number;
  space_weather_alerts: number;
  threat_level: string;
  missions_by_status: Record<string, number>;
}

// API Functions
export const api = {
  getLaunches: (limit = 10) =>
    fetcher<{ launches: Launch[] }>(`/launches?limit=${limit}`).then(r => r.launches),

  getAsteroids: (limit = 10) =>
    fetcher<{ asteroids: Asteroid[] }>(`/asteroids?limit=${limit}`).then(r => r.asteroids),

  getSpaceWeather: () =>
    fetcher<{ notifications: SpaceWeatherAlert[] }>(`/space-weather`).then(r => r.notifications),

  getISSPosition: () =>
    fetcher<ISSPosition>(`/iss-tracking`),

  getAPOD: () =>
    fetcher<APOD>(`/astronomy-images/apod`),

  getMarsPhotos: (rover = "curiosity", sol = 1000, limit = 12) =>
    fetcher<{ photos: MarsPhoto[] }>(`/mars/rover-photos?rover=${rover}&sol=${sol}&limit=${limit}`).then(r => r.photos),

  getMarsWeather: () =>
    fetcher<{ weather_data: MarsWeather[] }>(`/mars/weather`).then(r => r.weather_data || []),

  getEarthImages: (limit = 6) =>
    fetcher<{ images: EarthImage[] }>(`/earth/epic?limit=${limit}`).then(r => r.images),

  getJWSTImages: (limit = 12) =>
    fetcher<{ images: TelescopeImage[] }>(`/telescopes/jwst?limit=${limit}`).then(r => r.images),

  getHubbleImages: (limit = 12) =>
    fetcher<{ images: TelescopeImage[] }>(`/telescopes/hubble?limit=${limit}`).then(r => r.images),

  getAnalytics: () =>
    fetcher<AnalyticsOverview>(`/analytics/overview`),
};
