import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingLaunches } from "@/components/dashboard/upcoming-launches";
import { APODPreview } from "@/components/dashboard/apod-preview";
import { AsteroidAlerts } from "@/components/dashboard/asteroid-alerts";
import { SpaceWeatherWidget } from "@/components/dashboard/space-weather-widget";
import { ISSMiniTracker } from "@/components/dashboard/iss-mini-tracker";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Launches */}
        <div className="lg:col-span-2">
          <UpcomingLaunches />
        </div>

        {/* Right Column - ISS Tracker */}
        <div>
          <ISSMiniTracker />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* APOD Preview */}
        <div className="lg:col-span-1">
          <APODPreview />
        </div>

        {/* Asteroids */}
        <div className="lg:col-span-1">
          <AsteroidAlerts />
        </div>

        {/* Space Weather */}
        <div className="lg:col-span-1">
          <SpaceWeatherWidget />
        </div>
      </div>
    </div>
  );
}
