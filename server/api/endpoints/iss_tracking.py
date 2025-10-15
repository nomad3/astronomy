from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter()

ISS_API_URL = "https://api.wheretheiss.at/v1/satellites/25544"

@router.get("/iss-tracking")
async def get_iss_position():
    """
    Fetches the current position of the International Space Station.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(ISS_API_URL)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=f"Error response {exc.response.status_code} from ISS API.")
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"An error occurred while requesting {exc.request.url!r}.")
