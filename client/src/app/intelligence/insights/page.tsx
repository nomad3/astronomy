"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Insight } from "@/lib/api";
import { InsightCard, InsightTypeBadge } from "@/components/intelligence";
import { Lightbulb, Filter, ChevronLeft } from "lucide-react";
import Link from "next/link";

const insightTypes = ["connection", "trend", "gap", "anomaly"] as const;

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const params: { type?: string; limit: number } = { limit: 50 };
        if (selectedType) params.type = selectedType;

        const data = await api.getInsights(params);
        setInsights(data.insights);
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [selectedType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/intelligence"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Intelligence
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Lightbulb className="h-7 w-7 text-blue-400" />
            AI-Detected Insights
          </h1>
          <p className="text-gray-400 mt-1">
            Patterns discovered by Claude from analyzing NASA space science news
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter by type:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                All
              </Button>
              {insightTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="gap-1"
                >
                  <InsightTypeBadge type={type} showIcon={true} />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      {loading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : insights.length > 0 ? (
        <>
          {/* Featured insight */}
          {insights.length > 0 && !selectedType && (
            <InsightCard insight={insights[0]} variant="featured" />
          )}

          {/* Grid of insights */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {(selectedType ? insights : insights.slice(1)).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center text-gray-400">
              <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">No insights found</h3>
              <p className="max-w-md mx-auto">
                {selectedType
                  ? `No ${selectedType} insights have been detected yet. Try a different filter or run pattern analysis.`
                  : "No insights have been generated yet. Collect news and run pattern analysis to discover insights."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
