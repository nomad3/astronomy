"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type ISSPosition } from "@/lib/api";
import { Satellite, MapPin, Gauge, Mountain, Clock, Globe } from "lucide-react";

const ISSMap = dynamic(() => import("@/components/iss/iss-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full rounded-xl" />,
});

export default function ISSPage() {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchPosition = () => {
      api.getISSPosition()
        .then((data) => {
          setPosition(data);
          setLastUpdate(new Date());
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchPosition();
    const interval = setInterval(fetchPosition, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Satellite className="h-7 w-7 text-blue-400" />
            ISS Tracker
          </h1>
          <p className="text-gray-400 mt-1">
            Real-time International Space Station tracking
          </p>
        </div>
        <Badge variant="success" className="animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
          Live
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ISSMap position={position} />
            </CardContent>
          </Card>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <MapPin className="h-3 w-3" />
                      Latitude
                    </div>
                    <p className="text-xl font-mono text-white">
                      {position?.latitude.toFixed(4)}°
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Globe className="h-3 w-3" />
                      Longitude
                    </div>
                    <p className="text-xl font-mono text-white">
                      {position?.longitude.toFixed(4)}°
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">Telemetry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Mountain className="h-3 w-3" />
                      Altitude
                    </div>
                    <p className="text-xl font-mono text-blue-400">
                      {position?.altitude.toFixed(0)} km
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Gauge className="h-3 w-3" />
                      Velocity
                    </div>
                    <p className="text-xl font-mono text-purple-400">
                      {position?.velocity.toFixed(0)} km/h
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Clock className="h-3 w-3" />
                Last Update
              </div>
              <p className="text-sm text-white font-mono">
                {lastUpdate?.toLocaleTimeString() || "--:--:--"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Updates every 5 seconds
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-white mb-2">Orbital Period</h3>
            <p className="text-3xl font-bold text-blue-400">92.68 min</p>
            <p className="text-sm text-gray-500 mt-1">
              ~15.5 orbits per day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-white mb-2">Inclination</h3>
            <p className="text-3xl font-bold text-purple-400">51.64°</p>
            <p className="text-sm text-gray-500 mt-1">
              Orbital inclination angle
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-white mb-2">Crew Members</h3>
            <p className="text-3xl font-bold text-emerald-400">7</p>
            <p className="text-sm text-gray-500 mt-1">
              Expedition 70 crew
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
