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
  net: string;
  window_start: string;
  window_end: string;
  provider: string;
  vehicle: string;
  pad: string;
  location: string;
  mission_description: string;
  image_url: string;
}

export interface Asteroid {
  id: string;
  name: string;
  is_potentially_hazardous: boolean;
  close_approach_date: string;
  estimated_diameter_min: number;
  estimated_diameter_max: number;
  relative_velocity: number;
  miss_distance: number;
}

export interface SpaceWeatherAlert {
  id: string;
  type: string;
  message: string;
  issue_time: string;
  link?: string;
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
  camera_full_name: string;
  rover_name: string;
}

export interface MarsWeather {
  sol: number;
  earth_date: string;
  min_temp: number;
  max_temp: number;
  pressure: number;
  wind_speed: number | null;
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
    fetcher<Launch[]>(`/launches?limit=${limit}`),

  getAsteroids: (limit = 10) =>
    fetcher<Asteroid[]>(`/asteroids?limit=${limit}`),

  getSpaceWeather: () =>
    fetcher<SpaceWeatherAlert[]>(`/space-weather`),

  getISSPosition: () =>
    fetcher<ISSPosition>(`/iss-tracking`),

  getAPOD: () =>
    fetcher<APOD>(`/astronomy-images/apod`),

  getMarsPhotos: (rover = "curiosity", sol = 1000, limit = 12) =>
    fetcher<MarsPhoto[]>(`/mars/rover-photos?rover=${rover}&sol=${sol}&limit=${limit}`),

  getMarsWeather: () =>
    fetcher<MarsWeather[]>(`/mars/weather`),

  getEarthImages: (limit = 6) =>
    fetcher<EarthImage[]>(`/earth/epic?limit=${limit}`),

  getJWSTImages: (limit = 12) =>
    fetcher<TelescopeImage[]>(`/telescopes/jwst?limit=${limit}`),

  getHubbleImages: (limit = 12) =>
    fetcher<TelescopeImage[]>(`/telescopes/hubble?limit=${limit}`),

  getAnalytics: () =>
    fetcher<AnalyticsOverview>(`/analytics/overview`),
};
