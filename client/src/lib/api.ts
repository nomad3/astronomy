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

export interface LaunchStatus {
  id: number;
  name: string;
  abbrev: string;
  description: string;
}

export interface RocketDetails {
  id: number;
  name: string;
  full_name: string;
  variant: string;
  family: string | null;
  description: string;
  image_url: string | null;
  length: number | null;
  diameter: number | null;
  leo_capacity: number | null;
  gto_capacity: number | null;
  launch_mass: number | null;
  to_thrust: number | null;
  maiden_flight: string | null;
  successful_launches: number;
  failed_launches: number;
  pending_launches: number;
  wiki_url: string | null;
}

export interface ProviderDetails {
  id: number;
  name: string;
  abbrev: string;
  type: string;
  country_code: string;
  description: string;
  founding_year: string | null;
  logo_url: string | null;
  image_url: string | null;
  wiki_url: string | null;
  successful_launches: number;
  failed_launches: number;
  pending_launches: number;
}

export interface MissionDetails {
  id: number;
  name: string;
  type: string;
  description: string;
  orbit: {
    id: number;
    name: string;
    abbrev: string;
  } | null;
}

export interface PadDetails {
  id: number;
  name: string;
  wiki_url: string | null;
  map_url: string | null;
  latitude: string;
  longitude: string;
  total_launch_count: number;
  orbital_launch_attempt_count: number;
  location: {
    id: number;
    name: string;
    country_code: string;
    map_image: string | null;
    total_launch_count: number;
  } | null;
}

export interface ProgramDetails {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  wiki_url: string | null;
}

export interface LaunchUpdate {
  id: number;
  created_on: string;
  comment: string;
  info_url: string | null;
}

export interface LaunchDetail {
  id: string;
  name: string;
  slug: string;
  status: LaunchStatus;
  window_start: string;
  window_end: string;
  net: string;
  probability: number | null;
  hold_reason: string | null;
  fail_reason: string | null;
  hashtag: string | null;
  image: string | null;
  infographic: string | null;
  webcast_live: boolean;
  info_urls: Array<{ priority: number; title: string; description: string; feature_image: string | null; url: string }>;
  vid_urls: Array<{ priority: number; title: string; description: string; feature_image: string | null; url: string }>;
  rocket: RocketDetails;
  provider: ProviderDetails;
  mission: MissionDetails;
  pad: PadDetails;
  programs: ProgramDetails[];
  updates: LaunchUpdate[];
  last_updated: string;
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

export interface AsteroidCloseApproach {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
    miles_per_hour: string;
  };
  miss_distance: {
    astronomical: string;
    lunar: string;
    kilometers: string;
    miles: string;
  };
  orbiting_body: string;
}

export interface AsteroidOrbitalData {
  orbit_id: string;
  orbit_determination_date: string;
  first_observation_date: string;
  last_observation_date: string;
  data_arc_in_days: number;
  observations_used: number;
  orbit_uncertainty: string;
  minimum_orbit_intersection: string;
  jupiter_tisserand_invariant: string;
  epoch_osculation: string;
  eccentricity: string;
  semi_major_axis: string;
  inclination: string;
  ascending_node_longitude: string;
  orbital_period: string;
  perihelion_distance: string;
  perihelion_argument: string;
  aphelion_distance: string;
  perihelion_time: string;
  mean_anomaly: string;
  mean_motion: string;
  equinox: string;
  orbit_class: {
    type: string;
    description: string;
    range: string;
  } | null;
}

export interface AsteroidDetail {
  id: string;
  neo_reference_id: string;
  name: string;
  designation: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  estimated_diameter: {
    kilometers: { min: number; max: number };
    meters: { min: number; max: number };
    feet: { min: number; max: number };
  };
  orbital_data: AsteroidOrbitalData;
  close_approach_data: AsteroidCloseApproach[];
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

export interface TelescopeStatus {
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
  error?: string;
}

export interface Observation {
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

export interface ObservationDetail extends Observation {
  ra?: number;
  dec?: number;
  exposure_time?: number;
  program_title?: string;
  program_description?: string;
  keywords?: string[];
  data_products?: DataProduct[];
  related_observations?: Observation[];
  image_url?: string;
  hd_url?: string;
}

export interface DataProduct {
  product_id: string;
  type: string;
  size: string;
  url: string;
}

export interface Discovery {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  image_url?: string;
  telescope?: "jwst" | "hubble";
  related_observations?: string[];
}

export interface AnalyticsOverview {
  total_upcoming_launches: number;
  active_neos: number;
  space_weather_alerts: number;
  threat_level: string;
  missions_by_status: Record<string, number>;
}

// Intelligence System Types
export interface SpaceNews {
  id: string;
  source: string;
  external_id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  image_url: string | null;
  category: string;
  published_at: string;
  created_at: string;
}

export interface Insight {
  id: string;
  type: "connection" | "trend" | "gap" | "anomaly";
  title: string;
  description: string;
  confidence_score: number;
  related_news_ids: string[];
  category: string;
  evidence: string;
  generated_at: string;
  related_news?: SpaceNews[];
}

export interface Alert {
  id: string;
  insight_id: string;
  priority: "low" | "medium" | "high";
  seen: boolean;
  created_at: string;
  insight?: Insight;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  response: string;
  sources: Array<{
    id: string;
    title: string;
    source: string;
    url: string;
  }>;
  conversation_id: string | null;
}

export interface IntelligenceStats {
  total_news: number;
  total_insights: number;
  unread_alerts: number;
  insight_types: Record<string, number>;
  categories: Record<string, number>;
  recent_high_confidence: Insight[];
}

// API Functions
export const api = {
  getLaunches: (limit = 10) =>
    fetcher<{ launches: Launch[] }>(`/launches?limit=${limit}`).then(r => r.launches),

  getLaunch: (id: string) =>
    fetcher<LaunchDetail>(`/launches/${id}`),

  getAsteroids: (limit = 10) =>
    fetcher<{ asteroids: Asteroid[] }>(`/asteroids?limit=${limit}`).then(r => r.asteroids),

  getAsteroid: (id: string) =>
    fetcher<AsteroidDetail>(`/asteroids/${id}`),

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

  // Telescope Observatory Hub
  getJWSTStatus: () =>
    fetcher<TelescopeStatus>(`/telescopes/jwst/status`),

  getObservations: (telescope: "jwst" | "hubble", params?: { category?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.offset) searchParams.set("offset", String(params.offset));
    const query = searchParams.toString();
    return fetcher<{ observations: Observation[]; total: number }>(
      `/telescopes/${telescope}/observations${query ? `?${query}` : ""}`
    );
  },

  getObservationDetail: (obsId: string) =>
    fetcher<ObservationDetail>(`/telescopes/observations/${obsId}`),

  getDiscoveries: (limit = 10) =>
    fetcher<{ discoveries: Discovery[] }>(`/telescopes/discoveries?limit=${limit}`).then(r => r.discoveries),

  // Intelligence System
  getIntelligenceStats: () =>
    fetcher<IntelligenceStats>(`/intelligence/stats`),

  getCollectedNews: (limit = 50) =>
    fetcher<{ news: SpaceNews[]; count: number }>(`/intelligence/news?limit=${limit}`),

  triggerNewsCollection: () =>
    fetch(`${API_BASE}/intelligence/collect`, { method: "POST" }).then(r => r.json()),

  getInsights: (params?: { type?: string; category?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.category) searchParams.set("category", params.category);
    if (params?.limit) searchParams.set("limit", String(params.limit));
    const query = searchParams.toString();
    return fetcher<{ insights: Insight[]; count: number }>(
      `/intelligence/insights${query ? `?${query}` : ""}`
    );
  },

  getInsightDetail: (id: string) =>
    fetcher<Insight>(`/intelligence/insights/${id}`),

  triggerPatternAnalysis: (days = 7) =>
    fetch(`${API_BASE}/intelligence/analyze?days=${days}`, { method: "POST" }).then(r => r.json()),

  getAlerts: (unreadOnly = true, limit = 20) =>
    fetcher<{ alerts: Alert[]; count: number }>(
      `/intelligence/alerts?unread_only=${unreadOnly}&limit=${limit}`
    ),

  markAlertSeen: (alertId: string) =>
    fetch(`${API_BASE}/intelligence/alerts/${alertId}/seen`, { method: "PUT" }).then(r => r.json()),

  sendChatMessage: async (query: string, conversationHistory?: ChatMessage[]) => {
    const res = await fetch(`${API_BASE}/intelligence/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        conversation_history: conversationHistory,
      }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json() as Promise<ChatResponse>;
  },

  getChatHistory: (limit = 20) =>
    fetcher<{ conversations: Array<{ id: string; user_query: string; assistant_response: string; created_at: string }>; count: number }>(
      `/intelligence/chat/history?limit=${limit}`
    ),

  getChatSuggestions: () =>
    fetcher<{ suggestions: string[] }>(`/intelligence/chat/suggestions`).then(r => r.suggestions),
};
