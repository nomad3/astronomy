from fastapi import FastAPI
from api.router import api_router

app = FastAPI(
    title="Space Exploration Data Dashboard API",
    description="API for aggregating and serving space-related data.",
    version="1.0.0"
)

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Space Exploration API"}
