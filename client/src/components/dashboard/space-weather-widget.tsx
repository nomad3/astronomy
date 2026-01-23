"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type SpaceWeatherAlert } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { CloudSun, Sun, Zap, Shield, ArrowRight, Radio, Waves, Activity } from "lucide-react";

// Alert type descriptions and styling
const alertTypeInfo: Record<string, {
  icon: typeof Sun;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}> = {
  CME: {
    icon: Zap,
    label: "Coronal Mass Ejection",
    description: "Solar plasma cloud heading toward Earth",
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
  FLR: {
    icon: Sun,
    label: "Solar Flare",
    description: "Intense burst of radiation from the Sun",
    color: "text-red-400",
    bgColor: "bg-red-500/20",
  },
  SEP: {
    icon: Activity,
    label: "Solar Energetic Particles",
    description: "High-energy particles from the Sun",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
  },
  RBE: {
    icon: Radio,
    label: "Radiation Belt Enhancement",
    description: "Elevated radiation in Earth's belts",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
  },
  GST: {
    icon: Waves,
    label: "Geomagnetic Storm",
    description: "Disturbance in Earth's magnetic field",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  Report: {
    icon: CloudSun,
    label: "Space Weather Report",
    description: "General space weather update",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
  },
};

const getAlertInfo = (type: string) => {
  return alertTypeInfo[type] || {
    icon: Shield,
    label: type,
    description: "Space weather notification",
    color: "text-gray-400",
    bgColor: "bg-gray-500/20",
  };
};

// Extract a meaningful summary from the message body
const extractSummary = (body: string, type: string): string => {
  if (!body) return getAlertInfo(type).description;

  // Try to find Summary section
  const summaryMatch = body.match(/##\s*Summary[:\s]*\n?([\s\S]*?)(?=##|$)/i);
  if (summaryMatch && summaryMatch[1].trim()) {
    const summary = summaryMatch[1].trim().split('\n')[0];
    if (summary.length > 10) return summary.substring(0, 120) + (summary.length > 120 ? "..." : "");
  }

  // Try to find first meaningful sentence after headers
  const lines = body.split('\n').filter(l => !l.startsWith('##') && l.trim().length > 20);
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    return firstLine.substring(0, 120) + (firstLine.length > 120 ? "..." : "");
  }

  return getAlertInfo(type).description;
};

interface SpaceWeatherWidgetProps {
  className?: string;
}

export function SpaceWeatherWidget({ className }: SpaceWeatherWidgetProps) {
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
      <Card className={`flex flex-col ${className || ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            Space Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 flex-1">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex flex-col ${className || ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-purple-400" />
          Space Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
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
              const info = getAlertInfo(alert.messageType);
              const Icon = info.icon;
              const summary = extractSummary(alert.messageBody, alert.messageType);

              return (
                <Link
                  key={alert.messageID}
                  href="/weather"
                  className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${info.bgColor} flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${info.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${info.color}`}>
                          {info.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {summary}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(alert.messageIssueTime)}
                      </p>
                    </div>
                  </div>
                </Link>
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
