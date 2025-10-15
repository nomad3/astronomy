from fastapi import APIRouter

router = APIRouter()

@router.get("/missions")
def get_missions():
    return {"message": "List of missions"}

@router.post("/missions")
def create_mission():
    return {"message": "Mission created"}
