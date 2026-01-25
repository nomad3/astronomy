"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type IntelligenceStats, type Insight, type Alert } from "@/lib/api";
import {
  StatsOverview,
  InsightTypeBreakdown,
  CategoryBreakdown,
  InsightCard,
  AlertItem,
} from "@/components/intelligence";
import {
  Brain,
  ChevronRight,
  MessageSquare,
  Lightbulb,
  Bell,
  RefreshCw,
} from "lucide-react";

export default function IntelligencePage() {
  const [stats, setStats] = useState<IntelligenceStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const fetchData = async () => {
    setLoadingStats(true);
    setLoadingAlerts(true);

    try {
      const [statsData, alertsData] = await Promise.all([
        api.getIntelligenceStats(),
        api.getAlerts(true, 5),
      ]);
      setStats(statsData);
      setAlerts(alertsData.alerts);
    } catch (error) {
      console.error("Failed to fetch intelligence data:", error);
    } finally {
      setLoadingStats(false);
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAlertSeen = () => {
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="h-7 w-7 text-purple-400" />
            AI Intelligence
          </h1>
          <p className="text-gray-400 mt-1">
            AI-powered pattern detection and insights from NASA space science discoveries
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchData}
          disabled={loadingStats}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loadingStats ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {loadingStats ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : stats ? (
        <StatsOverview stats={stats} />
      ) : null}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/intelligence/chat">
          <Card className="border-purple-500/30 hover:bg-purple-500/5 transition-colors cursor-pointer group h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <MessageSquare className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 group-hover:underline">
                      AI Chat
                    </h3>
                    <p className="text-sm text-gray-400">
                      Ask questions about space science
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/intelligence/insights">
          <Card className="border-blue-500/30 hover:bg-blue-500/5 transition-colors cursor-pointer group h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Lightbulb className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-400 group-hover:underline">
                      Browse Insights
                    </h3>
                    <p className="text-sm text-gray-400">
                      Explore AI-detected patterns
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-amber-500/30 h-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/20">
                <Bell className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-400">
                  {loadingAlerts ? "..." : alerts.length} Alerts
                </h3>
                <p className="text-sm text-gray-400">
                  High-confidence patterns detected
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent High-Confidence Insights */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-400" />
                  High-Confidence Insights
                </div>
                <Link
                  href="/intelligence/insights"
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : stats?.recent_high_confidence && stats.recent_high_confidence.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_high_confidence.slice(0, 5).map((insight) => (
                    <InsightCard key={insight.id} insight={insight} variant="compact" />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No high-confidence insights yet</p>
                  <p className="text-sm mt-1">Run pattern analysis to generate insights</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Type & Category Breakdown */}
        <div className="space-y-6">
          {loadingStats ? (
            <>
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </>
          ) : stats ? (
            <>
              <InsightTypeBreakdown types={stats.insight_types} />
              <CategoryBreakdown categories={stats.categories} />
            </>
          ) : null}
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                Recent Alerts
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingAlerts ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} onMarkSeen={handleAlertSeen} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
