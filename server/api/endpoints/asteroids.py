from fastapi import APIRouter, HTTPException

from services.nasa import fetch_near_earth_objects, fetch_asteroid_by_id

router = APIRouter()


@router.get("/asteroids")
async def get_asteroids(limit: int = 10):
    try:
        asteroids = await fetch_near_earth_objects(limit=limit)
        return {"asteroids": asteroids}
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/asteroids/{asteroid_id}")
async def get_asteroid(asteroid_id: str):
    try:
        asteroid = await fetch_asteroid_by_id(asteroid_id)
        if asteroid is None:
            raise HTTPException(status_code=404, detail="Asteroid not found")
        return asteroid
    except HTTPException:
        raise
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc
