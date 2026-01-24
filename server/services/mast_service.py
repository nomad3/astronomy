"""Service for interacting with MAST (Mikulski Archive for Space Telescopes) API."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import httpx

from core.cache import get_cached, set_cache

MAST_API_URL = "https://mast.stsci.edu/api/v0.1"
WEBB_TRACKER_URL = "https://api.jwst-hub.com"
STSCI_NEWS_RSS = "https://webbtelescope.org/news/news-releases?RSS"


# Observation category mapping based on target classification
CATEGORY_KEYWORDS = {
    "exoplanets": ["exoplanet", "transit", "atmosphere", "habitable", "biosignature", "hot jupiter", "super-earth"],
    "galaxies": ["galaxy", "galaxies", "merger", "agn", "quasar", "redshift", "cosmic"],
    "nebulae": ["nebula", "nebulae", "planetary nebula", "star-forming", "hii region", "protoplanetary"],
    "stars": ["star", "stellar", "supernova", "binary", "white dwarf", "neutron", "pulsar", "variable"],
    "solar_system": ["asteroid", "comet", "mars", "jupiter", "saturn", "titan", "europa", "kuiper"],
}


def categorize_observation(target_name: str, description: str = "") -> str:
    """Categorize an observation based on target name and description."""
    text = f"{target_name} {description}".lower()

    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return category

    return "other"


async def fetch_jwst_status() -> Dict[str, Any]:
    """Fetch live JWST position and status from Webb Tracker API."""
    cache_key = "jwst:status"

    cached = await get_cached(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{WEBB_TRACKER_URL}/track")
            response.raise_for_status()
            data = response.json()

        result = {
            "telescope": "jwst",
            "position": {
                "ra": data.get("rightAscension"),
                "dec": data.get("declination"),
                "distance_km": data.get("distanceFromEarthKm"),
                "velocity_kms": data.get("speedKmS"),
            },
            "current_target": data.get("currentTarget"),
            "instrument": data.get("currentInstrument"),
            "last_updated": datetime.utcnow().isoformat(),
        }

        # Cache for 30 seconds
        await set_cache(cache_key, result, expire=30)
        return result

    except Exception as e:
        # Return a fallback status if API is unavailable
        return {
            "telescope": "jwst",
            "position": None,
            "current_target": None,
            "instrument": None,
            "last_updated": datetime.utcnow().isoformat(),
            "error": str(e),
        }


async def fetch_mast_observations(
    telescope: str = "jwst",
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
) -> List[Dict[str, Any]]:
    """Fetch recent observations from MAST archive."""
    cache_key = f"mast:observations:{telescope}:{category}:{limit}:{offset}"

    cached = await get_cached(cache_key)
    if cached:
        return cached

    # MAST uses different collection names
    collection = "JWST" if telescope == "jwst" else "HST"

    # Build MAST query
    query_params = {
        "obs_collection": collection,
        "dataproduct_type": "image",
        "intentType": "science",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Use MAST's filtered observations endpoint
            response = await client.get(
                f"{MAST_API_URL}/invoke",
                params={
                    "request": "doQuery",
                    "params": str({
                        "service": "Mast.Caom.Filtered",
                        "format": "json",
                        "params": query_params,
                    }),
                },
            )

            # Fallback: Use simpler cone search or recent observations
            if response.status_code != 200:
                # Try alternative endpoint for recent observations
                response = await client.post(
                    "https://mast.stsci.edu/api/v0/invoke",
                    json={
                        "service": "Mast.Caom.Cone",
                        "params": {
                            "ra": 0,
                            "dec": 0,
                            "radius": 180,
                        },
                        "format": "json",
                        "pagesize": limit,
                        "page": offset // limit + 1,
                        "removenullcolumns": True,
                        "filters": [
                            {"paramName": "obs_collection", "values": [collection]},
                            {"paramName": "dataproduct_type", "values": ["image"]},
                        ],
                    },
                )

            if response.status_code == 200:
                data = response.json()
                observations = data.get("data", [])[:limit]
            else:
                observations = []

    except Exception:
        observations = []

    # Transform to our format
    result = []
    for obs in observations:
        obs_data = {
            "obs_id": obs.get("obsid") or obs.get("obs_id"),
            "telescope": telescope,
            "target_name": obs.get("target_name", "Unknown Target"),
            "instrument": obs.get("instrument_name", ""),
            "filters": [obs.get("filters", "")] if obs.get("filters") else [],
            "date_observed": obs.get("t_min") or obs.get("obs_date", ""),
            "category": categorize_observation(
                obs.get("target_name", ""),
                obs.get("obs_title", "")
            ),
            "thumbnail_url": None,  # MAST doesn't always provide thumbnails
            "description": obs.get("obs_title", ""),
            "program_id": obs.get("proposal_id"),
            "pi_name": obs.get("s_ra"),  # Will be fixed with proper field
            "ra": obs.get("s_ra"),
            "dec": obs.get("s_dec"),
            "exposure_time": obs.get("t_exptime"),
        }

        # Filter by category if specified
        if category and obs_data["category"] != category:
            continue

        result.append(obs_data)

    # Cache for 1 hour
    await set_cache(cache_key, result, expire=3600)
    return result


async def fetch_recent_observations_simple(
    telescope: str = "jwst",
    limit: int = 20,
) -> List[Dict[str, Any]]:
    """Fetch recent observations using a simpler approach with NASA Image Library + MAST metadata."""
    cache_key = f"telescope:recent:{telescope}:{limit}"

    cached = await get_cached(cache_key)
    if cached:
        return cached

    # For now, use the NASA Image Library as primary source
    # and enhance with MAST metadata where available
    NASA_IMAGE_LIBRARY_URL = "https://images-api.nasa.gov/search"

    query = "james webb space telescope" if telescope == "jwst" else "hubble space telescope"
    year_start = "2022" if telescope == "jwst" else "2020"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                NASA_IMAGE_LIBRARY_URL,
                params={
                    "q": query,
                    "media_type": "image",
                    "year_start": year_start,
                },
            )
            response.raise_for_status()
            data = response.json()

        items = data.get("collection", {}).get("items", [])[:limit]

        result = []
        for item in items:
            item_data = item.get("data", [{}])[0]
            links = item.get("links", [{}])

            # Extract keywords for categorization
            keywords = item_data.get("keywords", [])
            description = item_data.get("description", "")
            title = item_data.get("title", "")

            obs = {
                "obs_id": item_data.get("nasa_id"),
                "telescope": telescope,
                "target_name": title,
                "instrument": _extract_instrument(keywords, telescope),
                "filters": [],
                "date_observed": item_data.get("date_created"),
                "category": categorize_observation(title, description),
                "thumbnail_url": links[0].get("href") if links else None,
                "description": description[:500] if description else "",
                "program_id": None,
                "pi_name": item_data.get("photographer") or item_data.get("center"),
            }
            result.append(obs)

        # Cache for 1 hour
        await set_cache(cache_key, result, expire=3600)
        return result

    except Exception:
        return []


def _extract_instrument(keywords: List[str], telescope: str) -> str:
    """Extract instrument name from keywords."""
    jwst_instruments = ["NIRCam", "NIRSpec", "MIRI", "FGS", "NIRISS"]
    hubble_instruments = ["ACS", "WFC3", "STIS", "COS", "WFPC2"]

    instruments = jwst_instruments if telescope == "jwst" else hubble_instruments

    for kw in keywords:
        for inst in instruments:
            if inst.lower() in kw.lower():
                return inst

    return "Unknown"


async def fetch_observation_detail(obs_id: str) -> Optional[Dict[str, Any]]:
    """Fetch detailed information about a specific observation."""
    cache_key = f"observation:detail:{obs_id}"

    cached = await get_cached(cache_key)
    if cached:
        return cached

    # First, try NASA Image Library for the image details
    NASA_IMAGE_LIBRARY_URL = "https://images-api.nasa.gov/search"

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                NASA_IMAGE_LIBRARY_URL,
                params={"nasa_id": obs_id},
            )
            response.raise_for_status()
            data = response.json()

        items = data.get("collection", {}).get("items", [])
        if not items:
            return None

        item = items[0]
        item_data = item.get("data", [{}])[0]
        links = item.get("links", [{}])

        # Determine telescope from keywords or title
        keywords = item_data.get("keywords", [])
        title = item_data.get("title", "").lower()
        telescope = "jwst" if "webb" in title or "jwst" in title else "hubble"

        result = {
            "obs_id": obs_id,
            "telescope": telescope,
            "target_name": item_data.get("title"),
            "instrument": _extract_instrument(keywords, telescope),
            "filters": [],
            "date_observed": item_data.get("date_created"),
            "category": categorize_observation(
                item_data.get("title", ""),
                item_data.get("description", "")
            ),
            "thumbnail_url": links[0].get("href") if links else None,
            "description": item_data.get("description", ""),
            "program_id": None,
            "pi_name": item_data.get("photographer") or item_data.get("center"),
            "ra": None,
            "dec": None,
            "exposure_time": None,
            "program_title": item_data.get("title"),
            "program_description": item_data.get("description"),
            "keywords": keywords,
            "data_products": [],
            "related_observations": [],
            "image_url": links[0].get("href") if links else None,
            "hd_url": None,  # Would need to fetch from asset manifest
        }

        # Try to get HD image URL
        try:
            asset_response = await client.get(
                f"https://images-api.nasa.gov/asset/{obs_id}"
            )
            if asset_response.status_code == 200:
                assets = asset_response.json().get("collection", {}).get("items", [])
                for asset in assets:
                    href = asset.get("href", "")
                    if "orig" in href or "large" in href:
                        result["hd_url"] = href
                        break
        except Exception:
            pass

        # Cache for 6 hours
        await set_cache(cache_key, result, expire=21600)
        return result

    except Exception:
        return None


async def fetch_discoveries(limit: int = 10) -> List[Dict[str, Any]]:
    """Fetch latest discoveries and news from STScI/NASA."""
    cache_key = f"telescope:discoveries:{limit}"

    cached = await get_cached(cache_key)
    if cached:
        return cached

    discoveries = []

    # Fetch from multiple NASA news sources
    news_sources = [
        {
            "url": "https://webbtelescope.org/api/v1/news_releases",
            "telescope": "jwst",
        },
        {
            "url": "https://hubblesite.org/api/v3/news_release",
            "telescope": "hubble",
        },
    ]

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Try Webb Telescope news API
            try:
                response = await client.get(
                    "https://webbtelescope.org/api/v1/news_releases",
                    params={"page": 1, "page_size": limit},
                )
                if response.status_code == 200:
                    data = response.json()
                    for item in data.get("results", [])[:limit // 2]:
                        discoveries.append({
                            "id": f"webb-{item.get('id')}",
                            "title": item.get("title", ""),
                            "summary": item.get("abstract", "")[:300],
                            "date": item.get("release_date", ""),
                            "url": f"https://webbtelescope.org{item.get('url', '')}",
                            "image_url": item.get("thumbnail", ""),
                            "telescope": "jwst",
                            "related_observations": [],
                        })
            except Exception:
                pass

            # Try Hubble news API
            try:
                response = await client.get(
                    "https://hubblesite.org/api/v3/news_release",
                    params={"page": 1, "limit": limit // 2},
                )
                if response.status_code == 200:
                    data = response.json()
                    for item in data[:limit // 2]:
                        discoveries.append({
                            "id": f"hubble-{item.get('id')}",
                            "title": item.get("name", ""),
                            "summary": item.get("abstract", "")[:300] if item.get("abstract") else "",
                            "date": item.get("news_release_date", ""),
                            "url": item.get("url", ""),
                            "image_url": item.get("thumbnail", ""),
                            "telescope": "hubble",
                            "related_observations": [],
                        })
            except Exception:
                pass

            # Fallback: Use NASA Image Library for recent notable images
            if not discoveries:
                for telescope in ["jwst", "hubble"]:
                    query = "james webb" if telescope == "jwst" else "hubble"
                    response = await client.get(
                        "https://images-api.nasa.gov/search",
                        params={
                            "q": query,
                            "media_type": "image",
                            "year_start": "2024",
                        },
                    )
                    if response.status_code == 200:
                        items = response.json().get("collection", {}).get("items", [])[:limit // 2]
                        for item in items:
                            item_data = item.get("data", [{}])[0]
                            links = item.get("links", [{}])
                            discoveries.append({
                                "id": item_data.get("nasa_id"),
                                "title": item_data.get("title", ""),
                                "summary": (item_data.get("description", "") or "")[:300],
                                "date": item_data.get("date_created", ""),
                                "url": f"https://images.nasa.gov/details/{item_data.get('nasa_id')}",
                                "image_url": links[0].get("href") if links else None,
                                "telescope": telescope,
                                "related_observations": [],
                            })
    except Exception:
        pass

    # Sort by date (newest first)
    discoveries.sort(key=lambda x: x.get("date", ""), reverse=True)

    # Cache for 1 hour
    await set_cache(cache_key, discoveries[:limit], expire=3600)
    return discoveries[:limit]
