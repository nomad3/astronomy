from fastapi import APIRouter

router = APIRouter()

@router.get("/iss-tracking")
def get_iss_tracking():
    return {"message": "ISS tracking data"}
