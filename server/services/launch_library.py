"""Utilities for interacting with the Launch Library 2 API."""

from __future__ import annotations

from typing import Any, Dict, List

import httpx

LAUNCH_LIBRARY_BASE_URL = "https://ll.thespacedevs.com/2.2.0"


async def fetch_upcoming_launches(limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch upcoming launches from Launch Library 2 API."""

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
    return [
        {
            "id": launch.get("id"),
            "name": launch.get("name"),
            "status": launch.get("status", {}).get("name"),
            "window_start": launch.get("window_start"),
            "window_end": launch.get("window_end"),
            "mission": launch.get("mission", {}).get("name"),
            "mission_description": launch.get("mission", {}).get("description"),
            "orbit": launch.get("mission", {}).get("orbit", {}).get("name"),
            "provider": launch.get("launch_service_provider", {}).get("name"),
            "pad": launch.get("pad", {}).get("name"),
            "location": launch.get("pad", {}).get("location", {}).get("name"),
            "image": launch.get("image"),
            "infographic": launch.get("infographic"),
            "webcast": launch.get("webcast_live"),
            "info_url": launch.get("info_url"),
            "vid_url": launch.get("vid_url"),
        }
        for launch in launches
    ]


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

