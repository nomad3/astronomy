"""Endpoints for space telescope imagery and observatory data."""

from typing import Optional
from fastapi import APIRouter, HTTPException
import httpx
from core.cache import get_cached, set_cache
from services.mast_service import (
    fetch_jwst_status,
    fetch_recent_observations_simple,
    fetch_observation_detail,
    fetch_discoveries,
)

router = APIRouter()

NASA_IMAGE_LIBRARY_URL = "https://images-api.nasa.gov/search"


# =============================================================================
# JWST Live Status
# =============================================================================

@router.get("/telescopes/jwst/status")
async def get_jwst_status():
    """Get live JWST position, current target, and instrument status."""
    try:
        status = await fetch_jwst_status()
        return status
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


# =============================================================================
# Observations
# =============================================================================

@router.get("/telescopes/{telescope}/observations")
async def get_telescope_observations(
    telescope: str,
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
):
    """Get recent observations for JWST or Hubble."""
    if telescope not in ("jwst", "hubble"):
        raise HTTPException(status_code=400, detail="Telescope must be 'jwst' or 'hubble'")

    try:
        observations = await fetch_recent_observations_simple(telescope, limit)

        # Filter by category if specified
        if category:
            observations = [o for o in observations if o.get("category") == category]

        # Apply pagination
        paginated = observations[offset:offset + limit]

        return {
            "observations": paginated,
            "total": len(observations),
            "telescope": telescope,
            "category": category,
        }
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/telescopes/observations/{obs_id}")
async def get_observation_detail(obs_id: str):
    """Get detailed information about a specific observation."""
    try:
        detail = await fetch_observation_detail(obs_id)
        if not detail:
            raise HTTPException(status_code=404, detail="Observation not found")
        return detail
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


# =============================================================================
# Discoveries / News
# =============================================================================

@router.get("/telescopes/discoveries")
async def get_discoveries(limit: int = 10):
    """Get latest telescope discoveries and news from NASA/STScI."""
    try:
        discoveries = await fetch_discoveries(limit)
        return {"discoveries": discoveries}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


# =============================================================================
# Image Galleries (Enhanced existing endpoints)
# =============================================================================

@router.get("/telescopes/jwst")
async def get_jwst_images(limit: int = 12):
    """Get James Webb Space Telescope images from NASA Image Library."""
    cache_key = f"jwst:images:{limit}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    try:
        params = {
            "q": "james webb space telescope",
            "media_type": "image",
            "year_start": "2022",
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(NASA_IMAGE_LIBRARY_URL, params=params)
            response.raise_for_status()
            data = response.json()

        items = data.get("collection", {}).get("items", [])[:limit]

        result = {
            "images": [
                {
                    "nasa_id": item.get("data", [{}])[0].get("nasa_id"),
                    "title": item.get("data", [{}])[0].get("title"),
                    "description": item.get("data", [{}])[0].get("description", "")[:300],
                    "date_created": item.get("data", [{}])[0].get("date_created"),
                    "keywords": item.get("data", [{}])[0].get("keywords", []),
                    "image_url": item.get("links", [{}])[0].get("href") if item.get("links") else None,
                    "photographer": item.get("data", [{}])[0].get("photographer"),
                }
                for item in items
                if item.get("links")
            ]
        }

        # Cache for 12 hours
        await set_cache(cache_key, result, expire=43200)
        return result

    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/telescopes/hubble")
async def get_hubble_images(limit: int = 12):
    """Get Hubble Space Telescope images from NASA Image Library."""
    cache_key = f"hubble:images:{limit}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    try:
        params = {
            "q": "hubble space telescope",
            "media_type": "image",
            "year_start": "2020",
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(NASA_IMAGE_LIBRARY_URL, params=params)
            response.raise_for_status()
            data = response.json()

        items = data.get("collection", {}).get("items", [])[:limit]

        result = {
            "images": [
                {
                    "nasa_id": item.get("data", [{}])[0].get("nasa_id"),
                    "title": item.get("data", [{}])[0].get("title"),
                    "description": item.get("data", [{}])[0].get("description", "")[:300],
                    "date_created": item.get("data", [{}])[0].get("date_created"),
                    "keywords": item.get("data", [{}])[0].get("keywords", []),
                    "image_url": item.get("links", [{}])[0].get("href") if item.get("links") else None,
                    "center": item.get("data", [{}])[0].get("center"),
                }
                for item in items
                if item.get("links")
            ]
        }

        # Cache for 12 hours
        await set_cache(cache_key, result, expire=43200)
        return result

    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/telescopes/probes")
async def get_probe_images(probe: str = "voyager", limit: int = 12):
    """Get space probe images (Voyager, Cassini, New Horizons, etc.)."""
    cache_key = f"probes:{probe}:{limit}"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    try:
        params = {
            "q": probe,
            "media_type": "image",
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(NASA_IMAGE_LIBRARY_URL, params=params)
            response.raise_for_status()
            data = response.json()

        items = data.get("collection", {}).get("items", [])[:limit]

        result = {
            "images": [
                {
                    "nasa_id": item.get("data", [{}])[0].get("nasa_id"),
                    "title": item.get("data", [{}])[0].get("title"),
                    "description": item.get("data", [{}])[0].get("description", "")[:300],
                    "date_created": item.get("data", [{}])[0].get("date_created"),
                    "keywords": item.get("data", [{}])[0].get("keywords", []),
                    "image_url": item.get("links", [{}])[0].get("href") if item.get("links") else None,
                }
                for item in items
                if item.get("links")
            ],
            "probe": probe,
        }

        # Cache for 24 hours (historical data)
        await set_cache(cache_key, result, expire=86400)
        return result

    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
