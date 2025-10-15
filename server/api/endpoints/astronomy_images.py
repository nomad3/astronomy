from fastapi import APIRouter, HTTPException
import httpx
from core.config import settings

router = APIRouter()

NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"

@router.get("/astronomy-images/apod")
async def get_astronomy_picture_of_the_day():
    """
    Fetches the Astronomy Picture of the Day from NASA's API.
    """
    params = {"api_key": settings.NASA_API_KEY}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(NASA_APOD_URL, params=params)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error response {exc.response.status_code} from NASA API.")
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"An error occurred while requesting {exc.request.url!r}.")
