from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    NASA_API_KEY: str = "DEMO_KEY"

    class Config:
        env_file = ".env"

settings = Settings()
