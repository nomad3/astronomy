from fastapi import APIRouter, HTTPException

from services.nasa import fetch_near_earth_objects

router = APIRouter()


@router.get("/asteroids")
async def get_asteroids(limit: int = 10):
    try:
        asteroids = await fetch_near_earth_objects(limit=limit)
        return {"asteroids": asteroids}
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc
