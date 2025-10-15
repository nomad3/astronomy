from fastapi import APIRouter

router = APIRouter()

@router.get("/celestial-objects")
def get_celestial_objects():
    return {"message": "List of celestial objects"}

@router.post("/celestial-objects")
def create_celestial_object():
    return {"message": "Celestial object created"}
