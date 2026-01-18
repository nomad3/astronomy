"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Launch } from "@/lib/api";
import { getTimeUntil, formatDateTime } from "@/lib/utils";
import {
  Rocket,
  MapPin,
  Calendar,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.getLaunches(20)
      .then(setLaunches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Upcoming Launches</h1>
          <p className="text-gray-400">Track rocket launches from around the world</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Rocket className="h-7 w-7 text-blue-400" />
          Upcoming Launches
        </h1>
        <p className="text-gray-400 mt-1">
          {launches.length} launches scheduled
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {launches.map((launch) => {
          const isExpanded = expanded === launch.id;

          return (
            <Card
              key={launch.id}
              className="overflow-hidden hover:border-white/20 transition-all"
            >
              <CardContent className="p-0">
                {launch.image_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={launch.image_url}
                      alt={launch.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge
                        variant={
                          launch.status === "Go" ? "success" :
                          launch.status === "TBD" ? "warning" : "default"
                        }
                        className="mb-2"
                      >
                        {launch.status}
                      </Badge>
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {launch.name}
                      </h3>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="info" className="font-mono">
                        {getTimeUntil(launch.net)}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(launch.net)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeUntil(launch.net)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 col-span-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{launch.location}</span>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Provider</p>
                          <div className="flex items-center gap-2 text-white mt-1">
                            <Building2 className="h-4 w-4 text-blue-400" />
                            {launch.provider}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Vehicle</p>
                          <div className="flex items-center gap-2 text-white mt-1">
                            <Rocket className="h-4 w-4 text-purple-400" />
                            {launch.vehicle}
                          </div>
                        </div>
                      </div>
                      {launch.mission_description && (
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Mission</p>
                          <p className="text-sm text-gray-300">
                            {launch.mission_description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setExpanded(isExpanded ? null : launch.id)}
                    className="w-full flex items-center justify-center gap-2 pt-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show More <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
