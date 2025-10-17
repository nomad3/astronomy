"""Endpoints for space telescope and probe imagery."""

from fastapi import APIRouter, HTTPException
import httpx
from core.cache import get_cached, set_cache
from core.config import settings

router = APIRouter()

NASA_IMAGE_LIBRARY_URL = "https://images-api.nasa.gov/search"


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

