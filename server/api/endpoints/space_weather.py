from fastapi import APIRouter, HTTPException

from services.nasa import fetch_space_weather_data

router = APIRouter()


@router.get("/space-weather")
async def get_space_weather():
    try:
        data = await fetch_space_weather_data()
        return data
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc
