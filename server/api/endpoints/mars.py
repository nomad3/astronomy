from fastapi import APIRouter, HTTPException

from services.mars import fetch_mars_rover_photos, fetch_mars_weather, fetch_epic_images

router = APIRouter()


@router.get("/mars/rover-photos")
async def get_mars_rover_photos(rover: str = "curiosity", sol: int = 1000, limit: int = 10):
    """Get Mars Rover photos from NASA API."""
    try:
        photos = await fetch_mars_rover_photos(rover=rover, sol=sol, limit=limit)
        return {"photos": photos, "rover": rover, "sol": sol}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/mars/weather")
async def get_mars_weather():
    """Get Mars weather data from InSight mission."""
    try:
        weather = await fetch_mars_weather()
        return weather
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/earth/epic")
async def get_epic_images(limit: int = 10):
    """Get EPIC Earth images from DSCOVR satellite."""
    try:
        images = await fetch_epic_images(limit=limit)
        return {"images": images}
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
