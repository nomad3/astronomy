"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Asteroid } from "@/lib/api";
import { formatDistance, formatDate } from "@/lib/utils";
import { Orbit, AlertTriangle, ArrowRight } from "lucide-react";

export function AsteroidAlerts() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAsteroids(5)
      .then(setAsteroids)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hazardous = asteroids.filter((a) => a.is_potentially_hazardous);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Orbit className="h-5 w-5" />
            Near-Earth Objects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Orbit className="h-5 w-5 text-amber-400" />
          Near-Earth Objects
        </CardTitle>
        {hazardous.length > 0 && (
          <Badge variant="danger" className="animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {hazardous.length} Hazardous
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {asteroids.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No nearby asteroids</p>
        ) : (
          <>
            {asteroids.slice(0, 4).map((asteroid) => (
              <div
                key={asteroid.id}
                className={`p-3 rounded-lg transition-colors ${
                  asteroid.is_potentially_hazardous
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h4 className="font-medium text-white truncate text-sm">
                      {asteroid.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(asteroid.close_approach_date)} • {formatDistance(parseFloat(asteroid.miss_distance_km))}
                    </p>
                  </div>
                  <Badge
                    variant={asteroid.is_potentially_hazardous ? "danger" : "success"}
                    className="flex-shrink-0 ml-2"
                  >
                    {asteroid.is_potentially_hazardous ? "PHA" : "Safe"}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Diameter:</span>
                    <span className="text-gray-300 ml-1">
                      {(asteroid.estimated_diameter_km * 1000).toFixed(0)}m
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Velocity:</span>
                    <span className="text-gray-300 ml-1">
                      {parseFloat(asteroid.relative_velocity_kms).toFixed(1)} km/s
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Link
              href="/asteroids"
              className="flex items-center justify-center gap-2 p-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              View All Objects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
