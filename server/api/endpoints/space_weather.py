from fastapi import APIRouter

router = APIRouter()

@router.get("/space-weather")
def get_space_weather():
    return {"message": "Space weather data"}
