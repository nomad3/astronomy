from fastapi import APIRouter

router = APIRouter()

@router.get("/astronomy-images")
def get_astronomy_images():
    return {"message": "List of astronomy images"}
