"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type AnalyticsOverview } from "@/lib/api";
import { Rocket, Orbit, CloudSun, AlertTriangle } from "lucide-react";

export function StatsCards() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Upcoming Launches",
      value: data?.total_upcoming_launches ?? 0,
      icon: Rocket,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Near-Earth Objects",
      value: data?.active_neos ?? 0,
      icon: Orbit,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Weather Alerts",
      value: data?.space_weather_alerts ?? 0,
      icon: CloudSun,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Threat Level",
      value: data?.threat_level ?? "LOW",
      icon: AlertTriangle,
      color: data?.threat_level === "HIGH" ? "text-red-400" : "text-emerald-400",
      bgColor: data?.threat_level === "HIGH" ? "bg-red-500/10" : "bg-emerald-500/10",
      isBadge: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="hover:border-white/20 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                {stat.isBadge ? (
                  <Badge
                    variant={stat.value === "HIGH" ? "danger" : "success"}
                    className="mt-2 text-base"
                  >
                    {stat.value}
                  </Badge>
                ) : (
                  <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                )}
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
