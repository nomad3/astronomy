"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Launch } from "@/lib/api";
import { getTimeUntil, formatDateTime } from "@/lib/utils";
import { Rocket, MapPin, Calendar } from "lucide-react";

export function UpcomingLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLaunches(5)
      .then(setLaunches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Upcoming Launches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-32 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-400" />
          Upcoming Launches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {launches.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No upcoming launches</p>
        ) : (
          launches.map((launch) => (
            <div
              key={launch.id}
              className="flex gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {launch.image_url && (
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={launch.image_url}
                    alt={launch.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-white truncate">
                    {launch.name}
                  </h4>
                  <Badge
                    variant={
                      launch.status === "Go" ? "success" :
                      launch.status === "TBD" ? "warning" : "default"
                    }
                    className="flex-shrink-0"
                  >
                    {getTimeUntil(launch.net)}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateTime(launch.net)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{launch.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
