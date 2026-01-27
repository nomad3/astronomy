"""Utilities for interacting with the Launch Library 2 API."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import httpx

from core.cache import get_cached, set_cache

LAUNCH_LIBRARY_BASE_URL = "https://ll.thespacedevs.com/2.2.0"


async def fetch_launch_by_id(launch_id: str) -> Optional[Dict[str, Any]]:
    """Fetch a single launch by ID with full details (cached for 5 minutes)."""

    cache_key = f"launch:detail:{launch_id}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    endpoint = f"{LAUNCH_LIBRARY_BASE_URL}/launch/{launch_id}/"

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(endpoint)
        if response.status_code == 404:
            return None
        response.raise_for_status()

    launch = response.json()
    result = _parse_launch_detail(launch)

    # Cache for 5 minutes
    await set_cache(cache_key, result, expire=300)
    return result


async def fetch_launch_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    """Fetch a launch by its slug by resolving slug to ID first."""

    # Get all upcoming launches and find the one with matching slug
    try:
        launches = await fetch_upcoming_launches(limit=50)

        # Find the launch with matching slug
        launch_id = None
        for launch in launches:
            if launch and isinstance(launch, dict) and launch.get("slug") == slug:
                launch_id = launch.get("id")
                break

        if not launch_id:
            return None

        # Fetch full details by ID
        return await fetch_launch_by_id(launch_id)
    except Exception:
        return None


def _parse_launch_detail(launch: Dict[str, Any]) -> Dict[str, Any]:
    """Parse launch detail from API response."""
    # Extract rocket details
    rocket = launch.get("rocket", {})
    rocket_config = rocket.get("configuration", {})

    # Extract pad details
    pad = launch.get("pad", {})
    pad_location = pad.get("location", {})

    # Extract mission details
    mission = launch.get("mission", {}) or {}
    orbit = mission.get("orbit", {}) or {}

    # Extract launch service provider
    provider = launch.get("launch_service_provider", {}) or {}

    # Extract program info
    programs = launch.get("program", []) or []

    return {
        "id": launch.get("id"),
        "name": launch.get("name"),
        "slug": launch.get("slug"),
        "status": {
            "id": launch.get("status", {}).get("id"),
            "name": launch.get("status", {}).get("name"),
            "abbrev": launch.get("status", {}).get("abbrev"),
            "description": launch.get("status", {}).get("description"),
        },
        "window_start": launch.get("window_start"),
        "window_end": launch.get("window_end"),
        "net": launch.get("net"),
        "probability": launch.get("probability"),
        "hold_reason": launch.get("holdreason"),
        "fail_reason": launch.get("failreason"),
        "hashtag": launch.get("hashtag"),
        "image": launch.get("image"),
        "infographic": launch.get("infographic"),
        "webcast_live": launch.get("webcast_live"),

        # URLs
        "info_urls": launch.get("infoURLs", []),
        "vid_urls": launch.get("vidURLs", []),

        # Rocket details
        "rocket": {
            "id": rocket_config.get("id"),
            "name": rocket_config.get("name"),
            "full_name": rocket_config.get("full_name"),
            "variant": rocket_config.get("variant"),
            "family": rocket_config.get("family"),
            "description": rocket_config.get("description"),
            "image_url": rocket_config.get("image_url"),
            "length": rocket_config.get("length"),
            "diameter": rocket_config.get("diameter"),
            "leo_capacity": rocket_config.get("leo_capacity"),
            "gto_capacity": rocket_config.get("gto_capacity"),
            "launch_mass": rocket_config.get("launch_mass"),
            "to_thrust": rocket_config.get("to_thrust"),
            "maiden_flight": rocket_config.get("maiden_flight"),
            "successful_launches": rocket_config.get("successful_launches"),
            "failed_launches": rocket_config.get("failed_launches"),
            "pending_launches": rocket_config.get("pending_launches"),
            "wiki_url": rocket_config.get("wiki_url"),
        },

        # Launch provider
        "provider": {
            "id": provider.get("id"),
            "name": provider.get("name"),
            "abbrev": provider.get("abbrev"),
            "type": provider.get("type"),
            "country_code": provider.get("country_code"),
            "description": provider.get("description"),
            "founding_year": provider.get("founding_year"),
            "logo_url": provider.get("logo_url"),
            "image_url": provider.get("image_url"),
            "wiki_url": provider.get("wiki_url"),
            "successful_launches": provider.get("successful_launches"),
            "failed_launches": provider.get("failed_launches"),
            "pending_launches": provider.get("pending_launches"),
        },

        # Mission details
        "mission": {
            "id": mission.get("id"),
            "name": mission.get("name"),
            "type": mission.get("type"),
            "description": mission.get("description"),
            "orbit": {
                "id": orbit.get("id"),
                "name": orbit.get("name"),
                "abbrev": orbit.get("abbrev"),
            } if orbit else None,
        },

        # Pad details
        "pad": {
            "id": pad.get("id"),
            "name": pad.get("name"),
            "wiki_url": pad.get("wiki_url"),
            "map_url": pad.get("map_url"),
            "latitude": pad.get("latitude"),
            "longitude": pad.get("longitude"),
            "total_launch_count": pad.get("total_launch_count"),
            "orbital_launch_attempt_count": pad.get("orbital_launch_attempt_count"),
            "location": {
                "id": pad_location.get("id"),
                "name": pad_location.get("name"),
                "country_code": pad_location.get("country_code"),
                "map_image": pad_location.get("map_image"),
                "total_launch_count": pad_location.get("total_launch_count"),
            } if pad_location else None,
        },

        # Program info
        "programs": [
            {
                "id": prog.get("id"),
                "name": prog.get("name"),
                "description": prog.get("description"),
                "image_url": prog.get("image_url"),
                "wiki_url": prog.get("wiki_url"),
            }
            for prog in programs
        ],

        # Updates
        "updates": [
            {
                "id": update.get("id"),
                "created_on": update.get("created_on"),
                "comment": update.get("comment"),
                "info_url": update.get("info_url"),
            }
            for update in (launch.get("updates") or [])
        ],

        # Last updated
        "last_updated": launch.get("last_updated"),
    }


async def fetch_upcoming_launches(limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch upcoming launches from Launch Library 2 API (cached for 5 minutes)."""

    cache_key = f"launches:upcoming:{limit}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    endpoint = f"{LAUNCH_LIBRARY_BASE_URL}/launch/upcoming/"
    params = {
        "mode": "detailed",
        "limit": limit,
        "ordering": "net",
    }

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(endpoint, params=params)
        response.raise_for_status()

    data = response.json()
    launches = data.get("results", [])
    result = [
        {
            "id": launch.get("id"),
            "slug": launch.get("slug"),
            "name": launch.get("name"),
            "status": (launch.get("status") or {}).get("name"),
            "window_start": launch.get("window_start"),
            "window_end": launch.get("window_end"),
            "mission": (launch.get("mission") or {}).get("name"),
            "mission_description": (launch.get("mission") or {}).get("description"),
            "orbit": ((launch.get("mission") or {}).get("orbit") or {}).get("name"),
            "provider": (launch.get("launch_service_provider") or {}).get("name"),
            "pad": (launch.get("pad") or {}).get("name"),
            "location": ((launch.get("pad") or {}).get("location") or {}).get("name"),
            "image": launch.get("image"),
            "infographic": launch.get("infographic"),
            "webcast": launch.get("webcast_live"),
            "info_url": launch.get("info_url"),
            "vid_url": launch.get("vid_url"),
        }
        for launch in launches
    ]

    # Cache for 5 minutes (launch data updates frequently)
    await set_cache(cache_key, result, expire=300)
    return result


async def fetch_missions(limit: int = 10) -> List[Dict[str, Any]]:
    """Derive mission summaries from upcoming launches."""

    launches = await fetch_upcoming_launches(limit=limit)
    missions: List[Dict[str, Any]] = []

    for launch in launches:
        missions.append(
            {
                "id": launch.get("id"),
                "name": launch.get("mission") or launch.get("name"),
                "status": launch.get("status"),
                "launch_vehicle": launch.get("name"),
                "launch_provider": launch.get("provider"),
                "window_start": launch.get("window_start"),
                "mission_description": launch.get("mission_description"),
                "orbit": launch.get("orbit"),
                "pad": launch.get("pad"),
                "location": launch.get("location"),
            }
        )

    return missions
