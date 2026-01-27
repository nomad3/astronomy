import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from api.router import api_router
from db.init_db import init_db
from services.enrichment_service import run_daily_enrichment


# Scheduler for background jobs
scheduler = AsyncIOScheduler()


async def scheduled_enrichment_job():
    """Wrapper for the daily enrichment job."""
    try:
        print("[Scheduler] Running daily enrichment job...")
        result = await run_daily_enrichment()
        print(f"[Scheduler] Enrichment complete: {result}")
    except Exception as e:
        print(f"[Scheduler] Enrichment job failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()

    # Schedule daily enrichment at 2 AM UTC
    scheduler.add_job(
        scheduled_enrichment_job,
        CronTrigger(hour=2, minute=0),
        id="daily_enrichment",
        replace_existing=True,
    )
    scheduler.start()
    print("[Scheduler] Started daily enrichment job (2 AM UTC)")

    yield

    # Shutdown
    scheduler.shutdown()


app = FastAPI(
    title="Space Exploration Data Dashboard API",
    description="API for aggregating and serving space-related data.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Space Exploration API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/scheduler/status")
def scheduler_status():
    """Check scheduler status and next run times."""
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
        })
    return {"scheduler_running": scheduler.running, "jobs": jobs}
