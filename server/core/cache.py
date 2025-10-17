"""Redis caching utilities."""

import json
from typing import Any, Optional
from redis import asyncio as aioredis
from core.config import settings

redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Get Redis client instance."""
    global redis_client
    if redis_client is None:
        redis_client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return redis_client


async def get_cached(key: str) -> Optional[Any]:
    """Get cached value from Redis."""
    try:
        redis = await get_redis()
        cached = await redis.get(key)
        if cached:
            return json.loads(cached)
    except Exception:
        pass
    return None


async def set_cache(key: str, value: Any, expire: int = 300) -> None:
    """Set cached value in Redis with expiration time in seconds."""
    try:
        redis = await get_redis()
        await redis.setex(key, expire, json.dumps(value))
    except Exception:
        pass
