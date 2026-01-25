from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    NASA_API_KEY: str = "DEMO_KEY"
    ANTHROPIC_API_KEY: str = ""
    CHROMADB_HOST: str = "localhost"
    CHROMADB_PORT: int = 8000

    class Config:
        env_file = ".env"

settings = Settings()
