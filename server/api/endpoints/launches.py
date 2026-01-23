from fastapi import APIRouter, HTTPException

from services.launch_library import fetch_upcoming_launches, fetch_launch_by_id

router = APIRouter()


@router.get("/launches")
async def get_launches(limit: int = 10):
    try:
        launches = await fetch_upcoming_launches(limit=limit)
        return {"launches": launches}
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/launches/{launch_id}")
async def get_launch(launch_id: str):
    try:
        launch = await fetch_launch_by_id(launch_id)
        if launch is None:
            raise HTTPException(status_code=404, detail="Launch not found")
        return launch
    except HTTPException:
        raise
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc
