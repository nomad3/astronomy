"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Asteroid } from "@/lib/api";
import { formatDistance, formatDate } from "@/lib/utils";
import { Orbit, AlertTriangle, Shield, Gauge, Ruler, Calendar } from "lucide-react";

export default function AsteroidsPage() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAsteroids(20)
      .then(setAsteroids)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hazardous = asteroids.filter((a) => a.is_potentially_hazardous);
  const safe = asteroids.filter((a) => !a.is_potentially_hazardous);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Near-Earth Objects</h1>
          <p className="text-gray-400">Tracking asteroids approaching Earth</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Orbit className="h-7 w-7 text-amber-400" />
            Near-Earth Objects
          </h1>
          <p className="text-gray-400 mt-1">
            {asteroids.length} objects tracked • {hazardous.length} potentially hazardous
          </p>
        </div>
        {hazardous.length > 0 && (
          <Badge variant="danger" className="animate-pulse text-base px-4 py-2">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {hazardous.length} PHA Detected
          </Badge>
        )}
      </div>

      {/* Hazardous Asteroids */}
      {hazardous.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Potentially Hazardous Asteroids
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hazardous.map((asteroid) => (
              <AsteroidCard key={asteroid.id} asteroid={asteroid} />
            ))}
          </div>
        </div>
      )}

      {/* Safe Asteroids */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Non-Hazardous Objects
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {safe.map((asteroid) => (
            <AsteroidCard key={asteroid.id} asteroid={asteroid} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AsteroidCard({ asteroid }: { asteroid: Asteroid }) {
  return (
    <Card
      className={`overflow-hidden transition-all hover:border-white/20 ${
        asteroid.is_potentially_hazardous
          ? "border-red-500/30 bg-red-500/5"
          : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{asteroid.name}</h3>
            <p className="text-xs text-gray-500 mt-1">NEO ID: {asteroid.id}</p>
          </div>
          <Badge variant={asteroid.is_potentially_hazardous ? "danger" : "success"}>
            {asteroid.is_potentially_hazardous ? "PHA" : "Safe"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <Calendar className="h-4 w-4 text-blue-400" />
            <div>
              <p className="text-xs text-gray-500">Close Approach</p>
              <p className="text-sm text-white">{formatDate(asteroid.close_approach_date)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Ruler className="h-3 w-3" />
                Diameter
              </div>
              <p className="text-sm text-white">
                {asteroid.estimated_diameter_min.toFixed(0)}-{asteroid.estimated_diameter_max.toFixed(0)}m
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Gauge className="h-3 w-3" />
                Velocity
              </div>
              <p className="text-sm text-white">
                {(asteroid.relative_velocity / 1000).toFixed(1)} km/s
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5 text-center">
            <p className="text-xs text-gray-500 mb-1">Miss Distance</p>
            <p className="text-lg font-semibold text-amber-400">
              {formatDistance(asteroid.miss_distance)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
