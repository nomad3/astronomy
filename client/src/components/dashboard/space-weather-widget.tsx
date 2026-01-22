"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type SpaceWeatherAlert } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { CloudSun, Sun, Zap, Shield, ArrowRight } from "lucide-react";

const getAlertIcon = (type: string) => {
  if (type.toLowerCase().includes("flare")) return Sun;
  if (type.toLowerCase().includes("cme")) return Zap;
  return Shield;
};

const getAlertVariant = (type: string): "danger" | "warning" | "info" => {
  if (type.toLowerCase().includes("flare")) return "danger";
  if (type.toLowerCase().includes("cme")) return "warning";
  return "info";
};

export function SpaceWeatherWidget() {
  const [alerts, setAlerts] = useState<SpaceWeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSpaceWeather()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            Space Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-purple-400" />
          Space Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-emerald-500/10 mb-3">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-medium">All Clear</p>
            <p className="text-sm text-gray-500 mt-1">No active space weather alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 4).map((alert) => {
              const Icon = getAlertIcon(alert.messageType);
              const variant = getAlertVariant(alert.messageType);

              return (
                <div
                  key={alert.messageID}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      variant === "danger" ? "bg-red-500/20" :
                      variant === "warning" ? "bg-amber-500/20" : "bg-blue-500/20"
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        variant === "danger" ? "text-red-400" :
                        variant === "warning" ? "text-amber-400" : "text-blue-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={variant} className="text-xs">
                          {alert.messageType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {alert.messageBody.split('\n').find(line => line.includes('Summary'))?.replace('## Summary:', '').trim() || alert.messageType}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(alert.messageIssueTime)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <Link
              href="/weather"
              className="flex items-center justify-center gap-2 p-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5 rounded-lg transition-colors"
            >
              View All Alerts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
