from fastapi import APIRouter, HTTPException
import httpx
from core.cache import get_cached, set_cache
from core.config import settings

router = APIRouter()

NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"

@router.get("/astronomy-images/apod")
async def get_astronomy_picture_of_the_day():
    """
    Fetches the Astronomy Picture of the Day from NASA's API (cached for 6 hours).
    """
    cache_key = "nasa:apod:today"

    # Try cache first
    cached = await get_cached(cache_key)
    if cached:
        return cached

    params = {"api_key": settings.NASA_API_KEY}
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(NASA_APOD_URL, params=params)
            response.raise_for_status()
            data = response.json()

            # Cache for 6 hours (APOD changes daily)
            await set_cache(cache_key, data, expire=21600)
            return data
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error response {exc.response.status_code} from NASA API.")
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"An error occurred while requesting {exc.request.url!r}.")
