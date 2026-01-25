"""News collector service - aggregates news from NASA sources."""

from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import httpx
import hashlib

from core.config import settings
from db.session import SessionLocal
from db.models import SpaceNews
from services import chromadb_service


# NASA API endpoints
NASA_IMAGE_LIBRARY = "https://images-api.nasa.gov/search"
WEBB_TELESCOPE_NEWS = "https://webbtelescope.org/api/v1/news_releases"
NASA_NEWS_API = "https://api.nasa.gov"


def generate_content_hash(title: str, source: str) -> str:
    """Generate a unique hash for deduplication."""
    content = f"{source}:{title}".lower()
    return hashlib.md5(content.encode()).hexdigest()


async def collect_webb_news(limit: int = 20) -> List[Dict[str, Any]]:
    """Collect news from Webb Telescope."""
    news_items = []

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                WEBB_TELESCOPE_NEWS,
                params={"page": 1, "page_size": limit}
            )

            if response.status_code == 200:
                data = response.json()
                for item in data.get("results", []):
                    news_items.append({
                        "source": "webb_telescope",
                        "external_id": str(item.get("id")),
                        "title": item.get("title", ""),
                        "summary": item.get("abstract", "")[:500] if item.get("abstract") else "",
                        "content": item.get("abstract", ""),
                        "url": f"https://webbtelescope.org{item.get('url', '')}",
                        "image_url": item.get("thumbnail"),
                        "category": categorize_content(item.get("title", ""), item.get("abstract", "")),
                        "published_at": parse_date(item.get("release_date")),
                    })
    except Exception as e:
        print(f"Error collecting Webb news: {e}")

    return news_items


async def collect_nasa_images(query: str = "space discovery", limit: int = 20) -> List[Dict[str, Any]]:
    """Collect from NASA Image Library."""
    news_items = []

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                NASA_IMAGE_LIBRARY,
                params={
                    "q": query,
                    "media_type": "image",
                    "year_start": str(datetime.now().year - 1),
                }
            )

            if response.status_code == 200:
                data = response.json()
                items = data.get("collection", {}).get("items", [])[:limit]

                for item in items:
                    item_data = item.get("data", [{}])[0]
                    links = item.get("links", [])

                    news_items.append({
                        "source": "nasa_images",
                        "external_id": item_data.get("nasa_id"),
                        "title": item_data.get("title", ""),
                        "summary": (item_data.get("description", "") or "")[:500],
                        "content": item_data.get("description", ""),
                        "url": f"https://images.nasa.gov/details/{item_data.get('nasa_id')}",
                        "image_url": links[0].get("href") if links else None,
                        "category": categorize_content(
                            item_data.get("title", ""),
                            item_data.get("description", ""),
                            item_data.get("keywords", [])
                        ),
                        "published_at": parse_date(item_data.get("date_created")),
                    })
    except Exception as e:
        print(f"Error collecting NASA images: {e}")

    return news_items


async def collect_apod(days: int = 7) -> List[Dict[str, Any]]:
    """Collect Astronomy Picture of the Day."""
    news_items = []

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            response = await client.get(
                f"{NASA_NEWS_API}/planetary/apod",
                params={
                    "api_key": settings.NASA_API_KEY,
                    "start_date": start_date.strftime("%Y-%m-%d"),
                    "end_date": end_date.strftime("%Y-%m-%d"),
                }
            )

            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    for item in data:
                        news_items.append({
                            "source": "apod",
                            "external_id": item.get("date"),
                            "title": item.get("title", ""),
                            "summary": (item.get("explanation", "") or "")[:500],
                            "content": item.get("explanation", ""),
                            "url": item.get("url"),
                            "image_url": item.get("hdurl") or item.get("url"),
                            "category": categorize_content(
                                item.get("title", ""),
                                item.get("explanation", "")
                            ),
                            "published_at": parse_date(item.get("date")),
                        })
    except Exception as e:
        print(f"Error collecting APOD: {e}")

    return news_items


async def collect_space_weather() -> List[Dict[str, Any]]:
    """Collect space weather notifications from DONKI."""
    news_items = []

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=7)

            response = await client.get(
                f"{NASA_NEWS_API}/DONKI/notifications",
                params={
                    "api_key": settings.NASA_API_KEY,
                    "startDate": start_date.strftime("%Y-%m-%d"),
                    "endDate": end_date.strftime("%Y-%m-%d"),
                }
            )

            if response.status_code == 200:
                data = response.json()
                for item in data:
                    news_items.append({
                        "source": "donki",
                        "external_id": item.get("messageID"),
                        "title": f"Space Weather: {item.get('messageType')}",
                        "summary": (item.get("messageBody", "") or "")[:500],
                        "content": item.get("messageBody", ""),
                        "url": item.get("messageURL"),
                        "image_url": None,
                        "category": "space_weather",
                        "published_at": parse_date(item.get("messageIssueTime")),
                    })
    except Exception as e:
        print(f"Error collecting space weather: {e}")

    return news_items


def categorize_content(title: str, description: str = "", keywords: List[str] = None) -> str:
    """Categorize content based on text analysis."""
    text = f"{title} {description} {' '.join(keywords or [])}".lower()

    categories = {
        "exoplanets": ["exoplanet", "planet", "habitable", "biosignature", "transit", "atmosphere"],
        "galaxies": ["galaxy", "galaxies", "quasar", "agn", "merger", "cosmic"],
        "stars": ["star", "stellar", "supernova", "neutron", "pulsar", "dwarf"],
        "nebulae": ["nebula", "nebulae", "cloud", "gas", "dust", "formation"],
        "black_holes": ["black hole", "event horizon", "singularity", "gravitational"],
        "solar_system": ["mars", "jupiter", "saturn", "asteroid", "comet", "moon"],
        "cosmology": ["universe", "big bang", "dark matter", "dark energy", "expansion"],
        "space_weather": ["solar", "flare", "cme", "geomagnetic", "radiation"],
    }

    for category, keywords_list in categories.items():
        if any(kw in text for kw in keywords_list):
            return category

    return "other"


def parse_date(date_str: Optional[str]) -> Optional[datetime]:
    """Parse various date formats."""
    if not date_str:
        return None

    formats = [
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str[:26], fmt)
        except (ValueError, TypeError):
            continue

    return None


async def collect_all_news() -> Dict[str, Any]:
    """Collect news from all sources and store in database."""
    all_news = []

    # Collect from all sources
    webb_news = await collect_webb_news(20)
    nasa_images = await collect_nasa_images("space telescope discovery", 20)
    apod_news = await collect_apod(7)
    weather_news = await collect_space_weather()

    all_news.extend(webb_news)
    all_news.extend(nasa_images)
    all_news.extend(apod_news)
    all_news.extend(weather_news)

    # Store in database
    db = SessionLocal()
    stored_count = 0
    skipped_count = 0

    try:
        for news_item in all_news:
            # Check if already exists
            existing = db.query(SpaceNews).filter(
                SpaceNews.source == news_item["source"],
                SpaceNews.external_id == news_item["external_id"]
            ).first()

            if existing:
                skipped_count += 1
                continue

            # Create new record
            news_record = SpaceNews(
                source=news_item["source"],
                external_id=news_item["external_id"],
                title=news_item["title"],
                summary=news_item["summary"],
                content=news_item["content"],
                url=news_item["url"],
                image_url=news_item["image_url"],
                category=news_item["category"],
                published_at=news_item["published_at"],
            )

            db.add(news_record)
            db.flush()

            # Add to ChromaDB for embeddings
            document_text = f"{news_item['title']}\n\n{news_item['summary']}"
            await chromadb_service.add_documents(
                documents=[document_text],
                metadatas=[{
                    "source": news_item["source"],
                    "category": news_item["category"],
                    "title": news_item["title"],
                    "date": news_item["published_at"].isoformat() if news_item["published_at"] else "",
                }],
                ids=[str(news_record.id)],
            )

            # Update embedding_id reference
            news_record.embedding_id = str(news_record.id)
            stored_count += 1

        db.commit()

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

    return {
        "total_collected": len(all_news),
        "stored": stored_count,
        "skipped_duplicates": skipped_count,
    }


async def get_recent_news(limit: int = 50) -> List[Dict[str, Any]]:
    """Get recent news from database."""
    db = SessionLocal()
    try:
        news = db.query(SpaceNews).order_by(
            SpaceNews.published_at.desc()
        ).limit(limit).all()

        return [n.to_dict() for n in news]
    finally:
        db.close()
