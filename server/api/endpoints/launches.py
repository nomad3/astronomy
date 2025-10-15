from fastapi import APIRouter

router = APIRouter()

@router.get("/launches")
def get_launches():
    return {"message": "List of launches"}
