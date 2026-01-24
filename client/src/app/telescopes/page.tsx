"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Discovery } from "@/lib/api";
import {
  TelescopeStatusCard,
  DiscoveryCard,
  ObservationFeed,
} from "@/components/telescopes";
import { Telescope, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function TelescopesPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loadingDiscoveries, setLoadingDiscoveries] = useState(true);

  useEffect(() => {
    api.getDiscoveries(8)
      .then(setDiscoveries)
      .catch(console.error)
      .finally(() => setLoadingDiscoveries(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Telescope className="h-7 w-7 text-blue-400" />
          Space Telescopes
        </h1>
        <p className="text-gray-400 mt-1">
          Live observatory status, recent discoveries, and observation data from JWST and Hubble
        </p>
      </div>

      {/* Telescope Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <TelescopeStatusCard telescope="jwst" />
        <TelescopeStatusCard telescope="hubble" />
      </div>

      {/* Latest Discoveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Latest Discoveries
            </div>
            <Link
              href="https://webbtelescope.org/news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingDiscoveries ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : discoveries.length > 0 ? (
            <>
              {/* Featured discovery */}
              <div className="mb-4">
                <DiscoveryCard discovery={discoveries[0]} variant="featured" />
              </div>

              {/* Other discoveries */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {discoveries.slice(1, 5).map((discovery) => (
                  <DiscoveryCard key={discovery.id} discovery={discovery} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No discoveries available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Observations Feed */}
      <ObservationFeed
        telescope="both"
        limit={8}
        title="Recent Observations"
        showFilter={true}
      />

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/telescopes/jwst">
          <Card className="border-amber-500/30 hover:bg-amber-500/5 transition-colors cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🔭</span>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-400 group-hover:underline">
                      James Webb Space Telescope
                    </h3>
                    <p className="text-sm text-gray-400">
                      Live tracking, observations, and gallery
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/telescopes/hubble">
          <Card className="border-purple-500/30 hover:bg-purple-500/5 transition-colors cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🌌</span>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 group-hover:underline">
                      Hubble Space Telescope
                    </h3>
                    <p className="text-sm text-gray-400">
                      Observations and image gallery
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
