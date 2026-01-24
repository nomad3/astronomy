"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Observation } from "@/lib/api";
import { ObservationCard } from "./observation-card";
import { CategoryFilter } from "./category-filter";
import { Telescope, RefreshCw } from "lucide-react";

interface ObservationFeedProps {
  telescope?: "jwst" | "hubble" | "both";
  limit?: number;
  showFilter?: boolean;
  showHeader?: boolean;
  title?: string;
  variant?: "grid" | "list";
}

export function ObservationFeed({
  telescope = "both",
  limit = 12,
  showFilter = true,
  showHeader = true,
  title = "Recent Observations",
  variant = "grid",
}: ObservationFeedProps) {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchObservations = async () => {
    setRefreshing(true);
    try {
      let allObs: Observation[] = [];

      if (telescope === "both") {
        const [jwst, hubble] = await Promise.all([
          api.getObservations("jwst", { category: category || undefined, limit: limit / 2 }),
          api.getObservations("hubble", { category: category || undefined, limit: limit / 2 }),
        ]);
        allObs = [...jwst.observations, ...hubble.observations];
        // Sort by date
        allObs.sort((a, b) => new Date(b.date_observed).getTime() - new Date(a.date_observed).getTime());
      } else {
        const result = await api.getObservations(telescope, { category: category || undefined, limit });
        allObs = result.observations;
      }

      setObservations(allObs.slice(0, limit));
    } catch (error) {
      console.error("Failed to fetch observations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchObservations();
  }, [telescope, category, limit]);

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Telescope className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          {showFilter && (
            <div className="mb-4">
              <Skeleton className="h-8 w-full max-w-md" />
            </div>
          )}
          <div className={variant === "grid"
            ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-2"
          }>
            {[...Array(limit > 8 ? 8 : limit)].map((_, i) => (
              <Skeleton key={i} className={variant === "grid" ? "aspect-video rounded-lg" : "h-20 rounded-lg"} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Telescope className="h-5 w-5 text-blue-400" />
              {title}
            </div>
            <button
              onClick={fetchObservations}
              disabled={refreshing}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {showFilter && (
          <div className="mb-4">
            <CategoryFilter selected={category} onChange={setCategory} />
          </div>
        )}

        {observations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Telescope className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No observations found</p>
            {category && (
              <button
                onClick={() => setCategory(null)}
                className="text-blue-400 hover:underline mt-2 text-sm"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : variant === "grid" ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {observations.map((obs) => (
              <ObservationCard key={obs.obs_id} observation={obs} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {observations.map((obs) => (
              <ObservationCard key={obs.obs_id} observation={obs} variant="compact" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
