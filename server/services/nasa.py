"""Utilities for interacting with NASA APIs."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List

import httpx

from core.config import settings

NASA_BASE_URL = "https://api.nasa.gov"


async def _request(endpoint: str, params: Dict[str, Any] | None = None) -> Dict[str, Any]:
    params = dict(params or {})
    params.setdefault("api_key", settings.NASA_API_KEY)

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(f"{NASA_BASE_URL}{endpoint}", params=params)
        response.raise_for_status()
        return response.json()


async def fetch_near_earth_objects(limit: int = 10) -> List[Dict[str, Any]]:
    today = datetime.utcnow().date()
    end_date = today + timedelta(days=3)

    data = await _request(
        "/neo/rest/v1/feed",
        params={
            "start_date": today.isoformat(),
            "end_date": end_date.isoformat(),
        },
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


async def fetch_space_weather_data() -> Dict[str, Any]:
    params = {
        "startDate": (datetime.utcnow() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "endDate": datetime.utcnow().strftime("%Y-%m-%d"),
    }

    data = await _request("/DONKI/notifications", params=params)
    return {"notifications": data}

