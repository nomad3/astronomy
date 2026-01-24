"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type TelescopeStatus } from "@/lib/api";
import { InstrumentBadge } from "./instrument-badge";
import {
  Telescope,
  MapPin,
  Gauge,
  Target,
  ArrowRight,
  Satellite,
  AlertCircle,
} from "lucide-react";

interface TelescopeStatusCardProps {
  telescope: "jwst" | "hubble";
  showLink?: boolean;
}

const telescopeConfig = {
  jwst: {
    name: "James Webb",
    fullName: "James Webb Space Telescope",
    icon: "🔭",
    color: "amber",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-400",
  },
  hubble: {
    name: "Hubble",
    fullName: "Hubble Space Telescope",
    icon: "🌌",
    color: "purple",
    borderClass: "border-purple-500/30",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-400",
  },
};

export function TelescopeStatusCard({ telescope, showLink = true }: TelescopeStatusCardProps) {
  const [status, setStatus] = useState<TelescopeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const config = telescopeConfig[telescope];

  useEffect(() => {
    const fetchStatus = async () => {
      if (telescope === "jwst") {
        try {
          const data = await api.getJWSTStatus();
          setStatus(data);
        } catch (error) {
          console.error("Failed to fetch JWST status:", error);
        }
      } else {
        // Hubble doesn't have live tracking, show static info
        setStatus({
          telescope: "hubble",
          position: undefined,
          current_target: undefined,
          instrument: undefined,
          last_updated: new Date().toISOString(),
        });
      }
      setLoading(false);
    };

    fetchStatus();

    // Auto-refresh for JWST every 30 seconds
    if (telescope === "jwst") {
      const interval = setInterval(fetchStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [telescope]);

  if (loading) {
    return (
      <Card className={config.borderClass}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  const formatDistance = (km: number) => {
    if (km >= 1000000) {
      return `${(km / 1000000).toFixed(2)}M km`;
    }
    return `${Math.round(km).toLocaleString()} km`;
  };

  return (
    <Card className={`${config.borderClass} ${config.bgClass} overflow-hidden`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <span className={config.textClass}>{config.name}</span>
          </div>
          {status?.instrument && (
            <InstrumentBadge instrument={status.instrument} telescope={telescope} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {telescope === "jwst" && status?.position ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-400 text-xs">Distance</p>
                  <p className="text-white font-medium">
                    {formatDistance(status.position.distance_km)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-400 text-xs">Velocity</p>
                  <p className="text-white font-medium">
                    {status.position.velocity_kms?.toFixed(2)} km/s
                  </p>
                </div>
              </div>
            </div>

            {status.current_target && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-black/20">
                <Target className="h-4 w-4 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-xs">Current Target</p>
                  <p className="text-white text-sm font-medium">{status.current_target}</p>
                </div>
              </div>
            )}
          </>
        ) : telescope === "jwst" && status?.error ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlertCircle className="h-4 w-4" />
            <span>Live status temporarily unavailable</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Satellite className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-gray-400 text-xs">Orbit</p>
                <p className="text-white font-medium">~540 km LEO</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-gray-400 text-xs">Status</p>
                <p className="text-white font-medium">Operational since 1990</p>
              </div>
            </div>
          </div>
        )}

        {showLink && (
          <Link
            href={`/telescopes/${telescope}`}
            className={`
              inline-flex items-center gap-1 text-sm font-medium
              ${config.textClass} hover:underline mt-2
            `}
          >
            View {config.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
