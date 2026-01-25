"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type IntelligenceStats } from "@/lib/api";
import { Newspaper, Lightbulb, Bell, Link2, TrendingUp, HelpCircle, AlertTriangle } from "lucide-react";

interface StatsOverviewProps {
  stats: IntelligenceStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Collected News</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total_news}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/20">
              <Newspaper className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">AI Insights</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total_insights}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/20">
              <Lightbulb className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Unread Alerts</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.unread_alerts}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-500/20">
              <Bell className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Categories</p>
              <p className="text-3xl font-bold text-white mt-1">
                {Object.keys(stats.categories).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500/20">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InsightTypeBreakdown({ types }: { types: Record<string, number> }) {
  const typeConfig = [
    { key: "connection", label: "Connections", icon: Link2, color: "text-blue-400" },
    { key: "trend", label: "Trends", icon: TrendingUp, color: "text-green-400" },
    { key: "gap", label: "Gaps", icon: HelpCircle, color: "text-yellow-400" },
    { key: "anomaly", label: "Anomalies", icon: AlertTriangle, color: "text-red-400" },
  ];

  const total = Object.values(types).reduce((a, b) => a + b, 0) || 1;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Insight Types</h3>
        <div className="space-y-3">
          {typeConfig.map(({ key, label, icon: Icon, color }) => {
            const count = types[key] || 0;
            const percentage = Math.round((count / total) * 100);

            return (
              <div key={key} className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{label}</span>
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        key === "connection" ? "bg-blue-500" :
                        key === "trend" ? "bg-green-500" :
                        key === "gap" ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryBreakdown({ categories }: { categories: Record<string, number> }) {
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const total = sortedCategories.reduce((a, [, b]) => a + b, 0) || 1;

  const categoryColors: Record<string, string> = {
    exoplanets: "bg-green-500",
    galaxies: "bg-purple-500",
    nebulae: "bg-pink-500",
    stars: "bg-yellow-500",
    solar_system: "bg-blue-500",
    cosmology: "bg-indigo-500",
    space_weather: "bg-orange-500",
    black_holes: "bg-red-500",
    other: "bg-gray-500",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-400 mb-4">News by Category</h3>
        <div className="space-y-3">
          {sortedCategories.map(([category, count]) => {
            const percentage = Math.round((count / total) * 100);

            return (
              <div key={category} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${categoryColors[category] || categoryColors.other}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 capitalize">{category.replace(/_/g, " ")}</span>
                    <span className="text-sm text-gray-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${categoryColors[category] || categoryColors.other}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
