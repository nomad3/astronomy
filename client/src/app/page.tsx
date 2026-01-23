import { StatsCards } from "@/components/dashboard/stats-cards";
import { UpcomingLaunches } from "@/components/dashboard/upcoming-launches";
import { APODHero } from "@/components/dashboard/apod-hero";
import { AsteroidAlerts } from "@/components/dashboard/asteroid-alerts";
import { SpaceWeatherWidget } from "@/components/dashboard/space-weather-widget";
import { ISSMiniTracker } from "@/components/dashboard/iss-mini-tracker";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero - Picture of the Day */}
      <APODHero />

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Grid - Launches and ISS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Launches */}
        <div className="lg:col-span-2 flex flex-col">
          <UpcomingLaunches className="flex-1" />
        </div>

        {/* Right Column - ISS Tracker */}
        <div className="flex flex-col">
          <ISSMiniTracker className="flex-1" />
        </div>
      </div>

      {/* Secondary Grid - Asteroids and Space Weather */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Asteroids */}
        <div className="flex flex-col">
          <AsteroidAlerts className="flex-1" />
        </div>

        {/* Space Weather */}
        <div className="flex flex-col">
          <SpaceWeatherWidget className="flex-1" />
        </div>
      </div>
    </div>
  );
}
