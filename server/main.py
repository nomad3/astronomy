from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import api_router
from db.init_db import init_db

app = FastAPI(
    title="Space Exploration Data Dashboard API",
    description="API for aggregating and serving space-related data.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Space Exploration API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
