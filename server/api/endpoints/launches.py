import re
from fastapi import APIRouter, HTTPException, BackgroundTasks

from services.launch_library import fetch_upcoming_launches, fetch_launch_by_id, fetch_launch_by_slug
from services.enrichment_service import (
    get_enrichment_for_launch,
    trigger_enrichment,
    run_daily_enrichment,
)

router = APIRouter()

# UUID pattern to distinguish IDs from slugs
UUID_PATTERN = re.compile(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    re.IGNORECASE
)


@router.get("/launches")
async def get_launches(limit: int = 10):
    try:
        launches = await fetch_upcoming_launches(limit=limit)
        return {"launches": launches}
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.get("/launches/{launch_identifier}")
async def get_launch(launch_identifier: str):
    """Get launch by ID (UUID) or slug."""
    try:
        # Check if it's a UUID or a slug
        if UUID_PATTERN.match(launch_identifier):
            launch = await fetch_launch_by_id(launch_identifier)
        else:
            launch = await fetch_launch_by_slug(launch_identifier)

        if launch is None:
            raise HTTPException(status_code=404, detail="Launch not found")

        # Add enrichment data if available
        launch_id = launch.get("id")
        if launch_id:
            enrichment = await get_enrichment_for_launch(launch_id)
            if enrichment:
                launch["enrichment"] = enrichment

        return launch
    except HTTPException:
        raise
    except Exception as exc:  # pylint: disable=broad-except
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/launches/{launch_id}/enrich")
async def enrich_launch_endpoint(launch_id: str, background_tasks: BackgroundTasks):
    """Trigger enrichment for a specific launch (runs in background)."""
    try:
        # Run enrichment in background
        background_tasks.add_task(trigger_enrichment, "launch", launch_id)
        return {"status": "enrichment_started", "launch_id": launch_id}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/enrichment/run")
async def run_enrichment_job(background_tasks: BackgroundTasks):
    """Manually trigger the daily enrichment job."""
    try:
        background_tasks.add_task(run_daily_enrichment)
        return {"status": "enrichment_job_started"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
