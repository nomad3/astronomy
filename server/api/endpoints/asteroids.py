from fastapi import APIRouter

router = APIRouter()

@router.get("/asteroids")
def get_asteroids():
    return {"message": "List of asteroids"}

@router.post("/asteroids")
def create_asteroid():
    return {"message": "Asteroid created"}
