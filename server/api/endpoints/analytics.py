"""Analytics endpoint that aggregates real metrics from all NASA APIs."""

from fastapi import APIRouter, HTTPException

from services.launch_library import fetch_upcoming_launches
from services.nasa import fetch_near_earth_objects, fetch_space_weather_data

router = APIRouter()


@router.get("/analytics/overview")
async def get_analytics_overview():
    """Get real-time analytics overview from all data sources (cached 5 minutes)."""
    try:
        # Fetch data from all sources (uses individual caching)
        # Reduce limits to avoid rate limiting
        launches = await fetch_upcoming_launches(limit=10)
        asteroids = await fetch_near_earth_objects(limit=20)
        space_weather = await fetch_space_weather_data()

        # Calculate real metrics
        total_upcoming_launches = len(launches)

        # Count launches by status
        launch_statuses = {}
        for launch in launches:
            status = launch.get("status", "Unknown")
            launch_statuses[status] = launch_statuses.get(status, 0) + 1

        # Count providers
        providers = set(launch.get("provider") for launch in launches if launch.get("provider"))

        # Asteroid analysis
        total_asteroids = len(asteroids)
        hazardous_asteroids = sum(1 for a in asteroids if a.get("is_potentially_hazardous"))

        # Average asteroid metrics
        avg_diameter = sum(a.get("estimated_diameter_km", 0) for a in asteroids) / max(total_asteroids, 1)
        avg_velocity = sum(float(a.get("relative_velocity_kms", 0)) for a in asteroids) / max(total_asteroids, 1)

        # Space weather analysis
        notifications = space_weather.get("notifications", [])
        total_alerts = len(notifications)

        # Count by type
        alert_types = {}
        for alert in notifications:
            msg_type = alert.get("messageType", "Unknown")
            alert_types[msg_type] = alert_types.get(msg_type, 0) + 1

        # Calculate threat level
        threat_level = "LOW"
        if hazardous_asteroids > 5 or total_alerts > 10:
            threat_level = "MEDIUM"
        if hazardous_asteroids > 10 or total_alerts > 20:
            threat_level = "HIGH"

        # Mission distribution (from launches)
        mission_types = {}
        for launch in launches:
            orbit = launch.get("orbit", "Unknown")
            if orbit and orbit != "Unknown":
                mission_types[orbit] = mission_types.get(orbit, 0) + 1

        return {
            # Flat fields for stats cards
            "total_upcoming_launches": total_upcoming_launches,
            "active_neos": total_asteroids,
            "space_weather_alerts": total_alerts,
            "threat_level": threat_level,
            "missions_by_status": launch_statuses,

            # Detailed nested data
            "launches": {
                "total": total_upcoming_launches,
                "by_status": launch_statuses,
                "providers": len(providers),
                "next_launch": launches[0] if launches else None,
            },
            "asteroids": {
                "total": total_asteroids,
                "hazardous": hazardous_asteroids,
                "safe": total_asteroids - hazardous_asteroids,
                "avg_diameter_km": round(avg_diameter, 2),
                "avg_velocity_kms": round(avg_velocity, 2),
            },
            "space_weather": {
                "total_alerts": total_alerts,
                "by_type": alert_types,
                "latest_alert": notifications[0] if notifications else None,
            },
            "missions": {
                "by_orbit": mission_types,
                "total_orbits": len(mission_types),
            },
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error aggregating analytics: {str(exc)}") from exc


@router.get("/analytics/launch-trends")
async def get_launch_trends():
    """Get launch trends and statistics (uses cached launches)."""
    try:
        # Use same cached data as overview
        launches = await fetch_upcoming_launches(limit=10)

        # Group by month
        monthly_counts = {}
        for launch in launches:
            window_start = launch.get("window_start", "")
            if window_start:
                month = window_start[:7]  # YYYY-MM
                monthly_counts[month] = monthly_counts.get(month, 0) + 1

        # Success rate calculation (from status)
        total = len(launches)
        successful = sum(1 for l in launches if "Success" in l.get("status", ""))
        success_rate = (successful / total * 100) if total > 0 else 0

        return {
            "monthly_counts": monthly_counts,
            "total_launches": total,
            "success_rate": round(success_rate, 1),
            "successful": successful,
            "pending": total - successful,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error calculating trends: {str(exc)}") from exc
