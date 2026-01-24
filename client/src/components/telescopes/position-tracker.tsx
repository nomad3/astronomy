"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type TelescopeStatus } from "@/lib/api";
import { InstrumentBadge } from "./instrument-badge";
import {
  Satellite,
  MapPin,
  Gauge,
  Target,
  Compass,
  RotateCw,
  AlertCircle,
} from "lucide-react";

interface PositionTrackerProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function PositionTracker({
  autoRefresh = true,
  refreshInterval = 30000,
}: PositionTrackerProps) {
  const [status, setStatus] = useState<TelescopeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchStatus = async () => {
    try {
      const data = await api.getJWSTStatus();
      setStatus(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch JWST status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (autoRefresh) {
      const interval = setInterval(fetchStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatCoordinate = (value: number | undefined, type: "ra" | "dec") => {
    if (value === undefined || value === null) return "N/A";
    if (type === "ra") {
      // Convert RA from degrees to hours:minutes:seconds
      const hours = Math.floor(value / 15);
      const minutes = Math.floor((value / 15 - hours) * 60);
      const seconds = ((value / 15 - hours) * 60 - minutes) * 60;
      return `${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
    } else {
      // DEC in degrees:arcmin:arcsec
      const sign = value >= 0 ? "+" : "-";
      const absVal = Math.abs(value);
      const degrees = Math.floor(absVal);
      const arcmin = Math.floor((absVal - degrees) * 60);
      const arcsec = ((absVal - degrees) * 60 - arcmin) * 60;
      return `${sign}${degrees}° ${arcmin}' ${arcsec.toFixed(1)}"`;
    }
  };

  const formatDistance = (km: number | undefined) => {
    if (!km) return "N/A";
    if (km >= 1000000) {
      return `${(km / 1000000).toFixed(3)} million km`;
    }
    return `${Math.round(km).toLocaleString()} km`;
  };

  if (loading) {
    return (
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-amber-400" />
            JWST Position Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status?.error || !status?.position) {
    return (
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-amber-400" />
            JWST Position Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <AlertCircle className="h-12 w-12 mb-3 opacity-50" />
            <p>Live tracking temporarily unavailable</p>
            <button
              onClick={fetchStatus}
              className="mt-4 flex items-center gap-2 text-blue-400 hover:underline"
            >
              <RotateCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400">JWST Position Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            {status.instrument && (
              <InstrumentBadge instrument={status.instrument} telescope="jwst" />
            )}
            <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse" />
              Live
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* L2 Orbit Visualization */}
        <div className="relative bg-black/30 rounded-xl p-6 overflow-hidden">
          {/* Simple orbit visualization */}
          <div className="flex items-center justify-center gap-8">
            {/* Sun indicator */}
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-yellow-500 mx-auto mb-2 shadow-lg shadow-yellow-500/50" />
              <span className="text-xs text-gray-500">Sun</span>
            </div>

            {/* Earth */}
            <div className="text-center">
              <div className="w-6 h-6 rounded-full bg-blue-500 mx-auto mb-2" />
              <span className="text-xs text-gray-500">Earth</span>
            </div>

            {/* L2 Point with JWST */}
            <div className="text-center relative">
              <div className="w-4 h-4 rounded-full bg-amber-400 mx-auto mb-2 animate-pulse" />
              <span className="text-xs text-amber-400 font-medium">JWST @ L2</span>
              <span className="text-[10px] text-gray-500 block">1.5M km from Earth</span>
            </div>
          </div>

          {/* Orbit path hint */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full opacity-20">
              <ellipse
                cx="50%"
                cy="50%"
                rx="40%"
                ry="20%"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="text-amber-400"
              />
            </svg>
          </div>
        </div>

        {/* Position Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <MapPin className="h-4 w-4" />
              Distance from Earth
            </div>
            <p className="text-xl font-bold text-white">
              {formatDistance(status.position.distance_km)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Gauge className="h-4 w-4" />
              Velocity
            </div>
            <p className="text-xl font-bold text-white">
              {status.position.velocity_kms?.toFixed(3)} km/s
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Compass className="h-3 w-3" />
              Right Ascension
            </div>
            <p className="text-sm font-mono text-white">
              {formatCoordinate(status.position.ra, "ra")}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/20">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Compass className="h-3 w-3" />
              Declination
            </div>
            <p className="text-sm font-mono text-white">
              {formatCoordinate(status.position.dec, "dec")}
            </p>
          </div>
        </div>

        {/* Current Target */}
        {status.current_target && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
              <Target className="h-4 w-4" />
              Currently Observing
            </div>
            <p className="text-lg font-semibold text-white">
              {status.current_target}
            </p>
          </div>
        )}

        {/* Last Update */}
        {lastUpdate && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <button
              onClick={fetchStatus}
              className="flex items-center gap-1 hover:text-gray-400 transition-colors"
            >
              <RotateCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
