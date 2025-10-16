from fastapi import APIRouter, HTTPException

from services.launch_library import fetch_upcoming_launches

router = APIRouter()


@router.get("/launches")
async def get_launches(limit: int = 10):
    try:
        launches = await fetch_upcoming_launches(limit=limit)
        return {"launches": launches}
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc
