from fastapi import APIRouter, HTTPException

from services.launch_library import fetch_missions

router = APIRouter()


@router.get("/missions")
async def get_missions(limit: int = 10):
    try:
        missions = await fetch_missions(limit=limit)
        return {"missions": missions}
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc
