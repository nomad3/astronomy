"""Utilities for interacting with NASA APIs."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx

from core.cache import get_cached, set_cache
from core.config import settings

NASA_BASE_URL = "https://api.nasa.gov"


async def _request(endpoint: str, params: Dict[str, Any] | None = None, cache_seconds: int = 300) -> Dict[str, Any]:
    """Make cached request to NASA API."""
    params = dict(params or {})
    params.setdefault("api_key", settings.NASA_API_KEY)

    # Create cache key from endpoint and params
    cache_key = f"nasa:{endpoint}:{str(sorted(params.items()))}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    # Make API request
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{NASA_BASE_URL}{endpoint}", params=params)
        response.raise_for_status()
        data = response.json()

    # Cache the response
    await set_cache(cache_key, data, expire=cache_seconds)
    return data


async def fetch_near_earth_objects(limit: int = 10) -> List[Dict[str, Any]]:
    today = datetime.utcnow().date()
    end_date = today + timedelta(days=3)

    data = await _request(
        "/neo/rest/v1/feed",
        params={
            "start_date": today.isoformat(),
            "end_date": end_date.isoformat(),
        },
        cache_seconds=3600,  # Cache for 1 hour
    )

    near_earth_objects = data.get("near_earth_objects", {})
    flattened: List[Dict[str, Any]] = []

    for date in sorted(near_earth_objects.keys()):
        for asteroid in near_earth_objects[date]:
            flattened.append(
                {
                    "id": asteroid.get("id"),
                    "name": asteroid.get("name"),
                    "close_approach_date": date,
                    "is_potentially_hazardous": asteroid.get("is_potentially_hazardous_asteroid"),
                    "estimated_diameter_km": asteroid.get("estimated_diameter", {})
                    .get("kilometers", {})
                    .get("estimated_diameter_max"),
                    "relative_velocity_kms": asteroid.get("close_approach_data", [{}])[0]
                    .get("relative_velocity", {})
                    .get("kilometers_per_second"),
                    "miss_distance_km": asteroid.get("close_approach_data", [{}])[0]
                    .get("miss_distance", {})
                    .get("kilometers"),
                }
            )

    return flattened[:limit]


async def fetch_asteroid_by_id(asteroid_id: str) -> Optional[Dict[str, Any]]:
    """Fetch detailed asteroid data by ID from NASA NeoWs API."""
    cache_key = f"nasa:asteroid:{asteroid_id}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    params = {"api_key": settings.NASA_API_KEY}

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{NASA_BASE_URL}/neo/rest/v1/neo/{asteroid_id}",
            params=params
        )
        if response.status_code == 404:
            return None
        response.raise_for_status()

    asteroid = response.json()

    # Extract orbital data
    orbital = asteroid.get("orbital_data", {}) or {}

    # Get close approach data
    close_approaches = asteroid.get("close_approach_data", []) or []

    # Get estimated diameter
    diameter = asteroid.get("estimated_diameter", {}) or {}

    result = {
        "id": asteroid.get("id"),
        "neo_reference_id": asteroid.get("neo_reference_id"),
        "name": asteroid.get("name"),
        "designation": asteroid.get("designation"),
        "nasa_jpl_url": asteroid.get("nasa_jpl_url"),
        "absolute_magnitude_h": asteroid.get("absolute_magnitude_h"),
        "is_potentially_hazardous_asteroid": asteroid.get("is_potentially_hazardous_asteroid"),
        "is_sentry_object": asteroid.get("is_sentry_object"),

        # Estimated diameter in different units
        "estimated_diameter": {
            "kilometers": {
                "min": diameter.get("kilometers", {}).get("estimated_diameter_min"),
                "max": diameter.get("kilometers", {}).get("estimated_diameter_max"),
            },
            "meters": {
                "min": diameter.get("meters", {}).get("estimated_diameter_min"),
                "max": diameter.get("meters", {}).get("estimated_diameter_max"),
            },
            "feet": {
                "min": diameter.get("feet", {}).get("estimated_diameter_min"),
                "max": diameter.get("feet", {}).get("estimated_diameter_max"),
            },
        },

        # Orbital data
        "orbital_data": {
            "orbit_id": orbital.get("orbit_id"),
            "orbit_determination_date": orbital.get("orbit_determination_date"),
            "first_observation_date": orbital.get("first_observation_date"),
            "last_observation_date": orbital.get("last_observation_date"),
            "data_arc_in_days": orbital.get("data_arc_in_days"),
            "observations_used": orbital.get("observations_used"),
            "orbit_uncertainty": orbital.get("orbit_uncertainty"),
            "minimum_orbit_intersection": orbital.get("minimum_orbit_intersection"),
            "jupiter_tisserand_invariant": orbital.get("jupiter_tisserand_invariant"),
            "epoch_osculation": orbital.get("epoch_osculation"),
            "eccentricity": orbital.get("eccentricity"),
            "semi_major_axis": orbital.get("semi_major_axis"),
            "inclination": orbital.get("inclination"),
            "ascending_node_longitude": orbital.get("ascending_node_longitude"),
            "orbital_period": orbital.get("orbital_period"),
            "perihelion_distance": orbital.get("perihelion_distance"),
            "perihelion_argument": orbital.get("perihelion_argument"),
            "aphelion_distance": orbital.get("aphelion_distance"),
            "perihelion_time": orbital.get("perihelion_time"),
            "mean_anomaly": orbital.get("mean_anomaly"),
            "mean_motion": orbital.get("mean_motion"),
            "equinox": orbital.get("equinox"),
            "orbit_class": {
                "type": orbital.get("orbit_class", {}).get("orbit_class_type"),
                "description": orbital.get("orbit_class", {}).get("orbit_class_description"),
                "range": orbital.get("orbit_class", {}).get("orbit_class_range"),
            } if orbital.get("orbit_class") else None,
        },

        # Close approach data (recent and upcoming)
        "close_approach_data": [
            {
                "close_approach_date": ca.get("close_approach_date"),
                "close_approach_date_full": ca.get("close_approach_date_full"),
                "epoch_date_close_approach": ca.get("epoch_date_close_approach"),
                "relative_velocity": {
                    "kilometers_per_second": ca.get("relative_velocity", {}).get("kilometers_per_second"),
                    "kilometers_per_hour": ca.get("relative_velocity", {}).get("kilometers_per_hour"),
                    "miles_per_hour": ca.get("relative_velocity", {}).get("miles_per_hour"),
                },
                "miss_distance": {
                    "astronomical": ca.get("miss_distance", {}).get("astronomical"),
                    "lunar": ca.get("miss_distance", {}).get("lunar"),
                    "kilometers": ca.get("miss_distance", {}).get("kilometers"),
                    "miles": ca.get("miss_distance", {}).get("miles"),
                },
                "orbiting_body": ca.get("orbiting_body"),
            }
            for ca in close_approaches[-10:]  # Last 10 approaches
        ],
    }

    # Cache for 1 hour
    await set_cache(cache_key, result, expire=3600)
    return result


async def fetch_space_weather_data() -> Dict[str, Any]:
    params = {
        "startDate": (datetime.utcnow() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "endDate": datetime.utcnow().strftime("%Y-%m-%d"),
    }

    data = await _request("/DONKI/notifications", params=params, cache_seconds=600)  # Cache for 10 minutes
    return {"notifications": data}
