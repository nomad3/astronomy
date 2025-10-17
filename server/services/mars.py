"""Utilities for Mars-related NASA APIs."""

from __future__ import annotations

from typing import Any, Dict, List

import httpx

from core.cache import get_cached, set_cache
from core.config import settings

NASA_BASE_URL = "https://api.nasa.gov"


async def fetch_mars_rover_photos(rover: str = "curiosity", sol: int = 1000, limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch Mars Rover photos from NASA API (cached for 12 hours)."""

    cache_key = f"mars:rover:{rover}:{sol}:{limit}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    # Correct endpoint based on NASA API documentation
    endpoint = f"https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/photos"
    params = {
        "sol": sol,
        "api_key": settings.NASA_API_KEY,
        "page": 1,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(endpoint, params=params)
        response.raise_for_status()
        data = response.json()

    photos = data.get("photos", [])[:limit]

    result = [
        {
            "id": photo.get("id"),
            "sol": photo.get("sol"),
            "camera": photo.get("camera", {}).get("full_name"),
            "camera_name": photo.get("camera", {}).get("name"),
            "img_src": photo.get("img_src"),
            "earth_date": photo.get("earth_date"),
            "rover": photo.get("rover", {}).get("name"),
            "rover_status": photo.get("rover", {}).get("status"),
            "landing_date": photo.get("rover", {}).get("landing_date"),
            "launch_date": photo.get("rover", {}).get("launch_date"),
        }
        for photo in photos
    ]

    # Cache for 12 hours (historical data doesn't change)
    await set_cache(cache_key, result, expire=43200)
    return result


async def fetch_mars_weather() -> Dict[str, Any]:
    """Fetch Mars weather data from InSight mission (cached for 24 hours)."""

    cache_key = "mars:weather:insight"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    endpoint = f"{NASA_BASE_URL}/insight_weather/"
    params = {
        "api_key": settings.NASA_API_KEY,
        "feedtype": "json",
        "ver": "1.0",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(endpoint, params=params)
        response.raise_for_status()
        data = response.json()

    # InSight mission ended, but we'll return the structure
    sol_keys = data.get("sol_keys", [])

    weather_data = []
    for sol in sol_keys[:7]:  # Last 7 sols
        sol_data = data.get(sol, {})
        if sol_data:
            weather_data.append({
                "sol": sol,
                "temperature": sol_data.get("AT", {}),
                "wind": sol_data.get("HWS", {}),
                "pressure": sol_data.get("PRE", {}),
                "season": sol_data.get("Season"),
            })

    result = {
        "sol_keys": sol_keys,
        "weather_data": weather_data,
        "validity_checks": data.get("validity_checks", {}),
    }

    # Cache for 24 hours (InSight mission ended, historical data)
    await set_cache(cache_key, result, expire=86400)
    return result


async def fetch_epic_images(limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch EPIC (Earth Polychromatic Imaging Camera) images (cached for 2 hours)."""

    cache_key = f"earth:epic:{limit}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    endpoint = f"{NASA_BASE_URL}/EPIC/api/natural/images"
    params = {
        "api_key": settings.NASA_API_KEY,
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(endpoint, params=params)
        response.raise_for_status()
        data = response.json()

    images = data[:limit] if isinstance(data, list) else []

    result = [
        {
            "identifier": img.get("identifier"),
            "caption": img.get("caption"),
            "image": img.get("image"),
            "version": img.get("version"),
            "date": img.get("date"),
            "centroid_coordinates": img.get("centroid_coordinates"),
            "dscovr_j2000_position": img.get("dscovr_j2000_position"),
            "lunar_j2000_position": img.get("lunar_j2000_position"),
            "sun_j2000_position": img.get("sun_j2000_position"),
            "attitude_quaternions": img.get("attitude_quaternions"),
            # Build the image URL
            "image_url": f"https://epic.gsfc.nasa.gov/archive/natural/{img.get('date', '').replace('-', '/')}/png/{img.get('image')}.png" if img.get('date') and img.get('image') else None,
        }
        for img in images
    ]

    # Cache for 2 hours (EPIC updates approximately every 2 hours)
    await set_cache(cache_key, result, expire=7200)
    return result
