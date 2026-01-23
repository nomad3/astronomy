"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type ISSPosition } from "@/lib/api";
import { Satellite, MapPin, Gauge, Mountain, ExternalLink } from "lucide-react";

interface ISSMiniTrackerProps {
  className?: string;
}

export function ISSMiniTracker({ className }: ISSMiniTrackerProps) {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosition = () => {
      api.getISSPosition()
        .then(setPosition)
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    fetchPosition();
    const interval = setInterval(fetchPosition, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`overflow-hidden flex flex-col ${className || ""}`}>
      <div className="relative h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <Satellite className="h-16 w-16 text-blue-400/30 animate-float" />
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="success" className="animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
            Live Tracking
          </Badge>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Satellite className="h-4 w-4 text-blue-400" />
              ISS Location
            </h3>
            <p className="text-xs text-gray-500">International Space Station</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : position ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <MapPin className="h-3 w-3" />
                  Latitude
                </div>
                <p className="text-white font-mono text-sm">
                  {position.latitude.toFixed(4)}°
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <MapPin className="h-3 w-3" />
                  Longitude
                </div>
                <p className="text-white font-mono text-sm">
                  {position.longitude.toFixed(4)}°
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Mountain className="h-3 w-3" />
                  Altitude
                </div>
                <p className="text-white font-mono text-sm">
                  {position.altitude.toFixed(0)} km
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Gauge className="h-3 w-3" />
                  Velocity
                </div>
                <p className="text-white font-mono text-sm">
                  {position.velocity.toFixed(0)} km/h
                </p>
              </div>
            </div>
            <Link
              href="/iss"
              className="mt-4 flex items-center justify-center gap-2 p-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              Open Live Map
              <ExternalLink className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <p className="text-gray-400 text-center py-4">Unable to fetch position</p>
        )}
      </CardContent>
    </Card>
  );
}
