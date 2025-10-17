from fastapi import APIRouter

from api.endpoints import celestial_objects, missions, iss_tracking, asteroids, astronomy_images, space_weather, launches, mars, analytics, telescopes

api_router = APIRouter()

api_router.include_router(celestial_objects.router, prefix="/api", tags=["celestial-objects"])
api_router.include_router(missions.router, prefix="/api", tags=["missions"])
api_router.include_router(iss_tracking.router, prefix="/api", tags=["iss-tracking"])
api_router.include_router(asteroids.router, prefix="/api", tags=["asteroids"])
api_router.include_router(astronomy_images.router, prefix="/api", tags=["astronomy-images"])
api_router.include_router(space_weather.router, prefix="/api", tags=["space-weather"])
api_router.include_router(launches.router, prefix="/api", tags=["launches"])
api_router.include_router(mars.router, prefix="/api", tags=["mars"])
api_router.include_router(analytics.router, prefix="/api", tags=["analytics"])
api_router.include_router(telescopes.router, prefix="/api", tags=["telescopes"])
