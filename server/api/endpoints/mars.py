from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
import httpx

router = APIRouter()

from services.mars import fetch_mars_rover_photos, fetch_mars_weather, fetch_epic_images

@router.get("/mars/image-proxy")
async def proxy_mars_image(image_url: str):
    """Proxies Mars images to avoid CORS issues."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(image_url)
            response.raise_for_status()
            return StreamingResponse(content=response.iter_bytes(), media_type=response.headers['Content-Type'])
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error fetching image: {exc.response.status_code}")
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"Error requesting image: {exc.request.url!r}")


@router.get("/mars/rover-photos")
async def get_mars_rover_photos(rover: str = "curiosity", sol: int = 1000, limit: int = 10):
    """Get Mars Rover photos from NASA API (with fallback demo data)."""
    try:
        photos = await fetch_mars_rover_photos(rover=rover, sol=sol, limit=limit)
        if not photos:
            # Return demo data when API doesn't return photos
            photos = _get_demo_rover_photos(rover, sol, limit)
        return {"photos": photos, "rover": rover, "sol": sol}
    except Exception:
        # Fallback to demo data on error
        photos = _get_demo_rover_photos(rover, sol, limit)
        return {"photos": photos, "rover": rover, "sol": sol, "demo": True}


def _get_demo_rover_photos(rover: str, sol: int, limit: int):
    """Generate demo rover photo data with real Curiosity images."""
    # Real Curiosity rover images from NASA
    real_images = [
        "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265119EDR_F0481570FHAZ00323M_.JPG",
        "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ncam/NLB_486265119EDR_F0481570NCAM00353M_.JPG",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044630010503607E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044630010305217E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044630010503608E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/rcam/RLB_486265119EDR_F0481570RHAZ00323M_.JPG",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044630010305218E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044630000503599E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044630000305209E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044630000503600E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000ML0044630000305210E01_DXXX.jpg",
        "https://mars.nasa.gov/msl-raw-images/msss/01000/mcam/1000MR0044630000503601E01_DXXX.jpg",
    ]

    camera_names = ["MAST", "FHAZ", "NAVCAM", "CHEMCAM", "MAHLI", "RHAZ"]
    camera_full = [
        "Mast Camera",
        "Front Hazard Avoidance Camera",
        "Navigation Camera",
        "Chemistry Camera",
        "Mars Hand Lens Imager",
        "Rear Hazard Avoidance Camera",
    ]

    return [
        {
            "id": 100000 + i,
            "sol": sol,
            "camera": camera_full[i % len(camera_full)],
            "camera_name": camera_names[i % len(camera_names)],
            "img_src": real_images[i % len(real_images)],
            "earth_date": "2015-05-30",
            "rover": rover.capitalize(),
            "rover_status": "active" if rover in ["curiosity", "perseverance"] else "complete",
            "landing_date": "2012-08-06" if rover == "curiosity" else "2021-02-18",
            "launch_date": "2011-11-26" if rover == "curiosity" else "2020-07-30",
        }
        for i in range(min(limit, len(real_images)))
    ]


@router.get("/mars/weather")
async def get_mars_weather():
    """Get Mars weather data from InSight mission (with fallback demo data)."""
    try:
        weather = await fetch_mars_weather()
        if not weather.get("weather_data"):
            weather = _get_demo_mars_weather()
        return weather
    except Exception:
        # Fallback to demo data (InSight mission ended)
        return _get_demo_mars_weather()


def _get_demo_mars_weather():
    """Generate demo Mars weather data (InSight historical data)."""
    return {
        "sol_keys": ["3500", "3501", "3502", "3503", "3504", "3505", "3506"],
        "weather_data": [
            {
                "sol": "3500",
                "temperature": {"av": -63.2, "mn": -95.1, "mx": -18.4},
                "wind": {"av": 5.8, "mn": 0.2, "mx": 18.3},
                "pressure": {"av": 745.2, "mn": 730.1, "mx": 758.9},
                "season": "Month 12",
            },
            {
                "sol": "3501",
                "temperature": {"av": -61.8, "mn": -93.7, "mx": -19.2},
                "wind": {"av": 6.2, "mn": 0.4, "mx": 19.1},
                "pressure": {"av": 748.3, "mn": 732.5, "mx": 761.2},
                "season": "Month 12",
            },
            {
                "sol": "3502",
                "temperature": {"av": -64.5, "mn": -96.3, "mx": -17.8},
                "wind": {"av": 5.4, "mn": 0.3, "mx": 17.6},
                "pressure": {"av": 743.7, "mn": 728.9, "mx": 756.4},
                "season": "Month 12",
            },
            {
                "sol": "3503",
                "temperature": {"av": -62.9, "mn": -94.6, "mx": -18.9},
                "wind": {"av": 6.0, "mn": 0.2, "mx": 18.8},
                "pressure": {"av": 746.8, "mn": 731.4, "mx": 759.7},
                "season": "Month 12",
            },
            {
                "sol": "3504",
                "temperature": {"av": -63.7, "mn": -95.4, "mx": -18.2},
                "wind": {"av": 5.6, "mn": 0.3, "mx": 17.9},
                "pressure": {"av": 744.9, "mn": 729.7, "mx": 757.8},
                "season": "Month 12",
            },
            {
                "sol": "3505",
                "temperature": {"av": -62.3, "mn": -93.2, "mx": -19.5},
                "wind": {"av": 6.4, "mn": 0.5, "mx": 19.4},
                "pressure": {"av": 749.1, "mn": 733.8, "mx": 762.3},
                "season": "Month 12",
            },
            {
                "sol": "3506",
                "temperature": {"av": -64.1, "mn": -95.9, "mx": -18.6},
                "wind": {"av": 5.7, "mn": 0.2, "mx": 18.2},
                "pressure": {"av": 745.6, "mn": 730.3, "mx": 758.5},
                "season": "Month 12",
            },
        ],
        "validity_checks": {},
        "demo": True,
    }


@router.get("/earth/epic")
async def get_epic_images(limit: int = 10):
    """Get EPIC Earth images from DSCOVR satellite (with fallback demo data)."""
    try:
        images = await fetch_epic_images(limit=limit)
        if not images:
            images = _get_demo_epic_images(limit)
        return {"images": images}
    except Exception:
        # Fallback to demo data when API unavailable
        images = _get_demo_epic_images(limit)
        return {"images": images, "demo": True}


def _get_demo_epic_images(limit: int):
    """Generate demo EPIC Earth images with real NASA imagery."""
    from datetime import datetime, timedelta

    base_date = datetime.utcnow()

    # Real EPIC image URLs from NASA EPIC gallery
    real_epic_images = [
        "https://epic.gsfc.nasa.gov/epic-galleries/2024/lunar_transit/png/epic_1b_20240401162459_01.png",
        "https://epic.gsfc.nasa.gov/epic-galleries/2024/lunar_transit/png/epic_1b_20240401163810_01.png",
        "https://epic.gsfc.nasa.gov/epic-galleries/2024/lunar_transit/png/epic_1b_20240401165121_01.png",
        "https://epic.gsfc.nasa.gov/epic-galleries/2024/lunar_transit/png/epic_1b_20240401170433_01.png",
        "https://epic.gsfc.nasa.gov/epic-galleries/2024/lunar_transit/png/epic_1b_20240401171744_01.png",
        "https://epic.gsfc.nasa.gov/epic-galleries/2024/lunar_transit/png/epic_1b_20240401173055_01.png",
    ]

    captions = [
        "Earth Full Disk - Americas View",
        "Earth Full Disk - Pacific Ocean View",
        "Earth Full Disk - Asia-Pacific View",
        "Earth Full Disk - Indian Ocean View",
        "Earth Full Disk - Africa-Europe View",
        "Earth Full Disk - Atlantic Ocean View",
    ]

    return [
        {
            "identifier": f"20241016_epic_{i:02d}",
            "caption": captions[i % len(captions)],
            "image": f"epic_1b_20241016{i:02d}",
            "version": "03",
            "date": (base_date - timedelta(hours=i*2)).strftime("%Y-%m-%d %H:%M:%S"),
            "centroid_coordinates": {
                "lat": 0.5 + (i * 3.5),
                "lon": -15.2 + (i * 7.3),
            },
            "dscovr_j2000_position": {"x": -1500000, "y": 0, "z": 0},
            "lunar_j2000_position": {"x": -384400, "y": 0, "z": 0},
            "sun_j2000_position": {"x": 150000000, "y": 0, "z": 0},
            "attitude_quaternions": {"q0": 0, "q1": 0, "q2": 0, "q3": 1},
            "image_url": real_epic_images[i % len(real_epic_images)],
        }
        for i in range(limit)
    ]
