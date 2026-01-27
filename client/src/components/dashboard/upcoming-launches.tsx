"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Launch } from "@/lib/api";
import { getTimeUntil, formatDateTime } from "@/lib/utils";
import { Rocket, MapPin, Calendar, ImageOff, Star, Users, Moon } from "lucide-react";

interface UpcomingLaunchesProps {
  className?: string;
}

// Keywords for identifying notable launches
const NOTABLE_CRITERIA = {
  crewed: ["crew", "crewed", "astronaut", "cosmonaut", "taikonaut"],
  lunar: ["moon", "lunar", "artemis", "gateway"],
  mars: ["mars", "martian"],
  deepSpace: ["jupiter", "saturn", "asteroid", "comet", "europa", "titan", "psyche"],
  historic: ["first", "maiden", "inaugural"],
  programs: ["artemis", "apollo", "iss", "tiangong", "starship"],
};

function calculateNotabilityScore(launch: Launch): number {
  let score = 0;
  const searchText = `${launch.name} ${launch.mission} ${launch.mission_description} ${launch.orbit}`.toLowerCase();

  if (NOTABLE_CRITERIA.crewed.some(k => searchText.includes(k))) score += 100;
  if (NOTABLE_CRITERIA.lunar.some(k => searchText.includes(k))) score += 80;
  if (NOTABLE_CRITERIA.mars.some(k => searchText.includes(k))) score += 70;
  if (NOTABLE_CRITERIA.deepSpace.some(k => searchText.includes(k))) score += 60;
  if (NOTABLE_CRITERIA.historic.some(k => searchText.includes(k))) score += 40;
  if (NOTABLE_CRITERIA.programs.some(k => searchText.includes(k))) score += 30;

  return score;
}

function getNotabilityTags(launch: Launch): { icon: React.ReactNode; label: string }[] {
  const tags: { icon: React.ReactNode; label: string }[] = [];
  const searchText = `${launch.name} ${launch.mission} ${launch.mission_description} ${launch.orbit}`.toLowerCase();

  if (NOTABLE_CRITERIA.crewed.some(k => searchText.includes(k))) {
    tags.push({ icon: <Users className="h-3 w-3" />, label: "Crewed" });
  }
  if (NOTABLE_CRITERIA.lunar.some(k => searchText.includes(k))) {
    tags.push({ icon: <Moon className="h-3 w-3" />, label: "Lunar" });
  }

  return tags;
}

function LaunchImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="h-20 w-32 flex-shrink-0 rounded-lg bg-gray-800 flex items-center justify-center">
        <ImageOff className="h-6 w-6 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        unoptimized
        onError={() => {
          console.warn(`[LaunchImage] Failed to load: ${src}`);
          setError(true);
        }}
      />
    </div>
  );
}

interface ScoredLaunch extends Launch {
  notabilityScore: number;
  tags: { icon: React.ReactNode; label: string }[];
}

export function UpcomingLaunches({ className }: UpcomingLaunchesProps) {
  const [launches, setLaunches] = useState<ScoredLaunch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLaunches(15)
      .then((rawLaunches) => {
        // Score all launches
        const scored = rawLaunches.map(launch => ({
          ...launch,
          notabilityScore: calculateNotabilityScore(launch),
          tags: getNotabilityTags(launch),
        }));

        // Sort: notable launches first (by score), then chronologically
        scored.sort((a, b) => {
          // If one is notable and other isn't, notable comes first
          if (a.notabilityScore > 0 && b.notabilityScore === 0) return -1;
          if (b.notabilityScore > 0 && a.notabilityScore === 0) return 1;
          // If both notable, sort by score (highest first)
          if (a.notabilityScore > 0 && b.notabilityScore > 0) {
            return b.notabilityScore - a.notabilityScore;
          }
          // Otherwise sort by date
          return new Date(a.window_start).getTime() - new Date(b.window_start).getTime();
        });

        // Take top 6
        setLaunches(scored.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Upcoming Launches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-32 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-400" />
          Upcoming Launches
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {launches.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No upcoming launches</p>
        ) : (
          launches.map((launch, index) => {
            const isFeatured = launch.notabilityScore > 0 && index === 0;
            const isNotable = launch.notabilityScore > 0;

            return (
              <Link key={launch.id} href={`/launches/${launch.slug}`}>
                <div
                  className={`
                    flex gap-4 p-3 rounded-lg transition-all cursor-pointer relative
                    ${isFeatured
                      ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                      : isNotable
                        ? 'bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40'
                        : 'bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  {/* Featured Star Icon */}
                  {isFeatured && (
                    <div className="absolute -top-2 -left-2 bg-amber-500 rounded-full p-1.5 shadow-lg shadow-amber-500/50">
                      <Star className="h-3 w-3 text-black fill-current" />
                    </div>
                  )}

                  {launch.image && <LaunchImage src={launch.image} alt={launch.name} />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${isFeatured ? 'text-amber-400' : 'text-white'}`}>
                          {launch.name}
                        </h4>
                        {/* Notable tags */}
                        {isNotable && launch.tags.length > 0 && (
                          <div className="flex gap-1.5 mt-1">
                            {launch.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="info"
                                className="text-[10px] px-1.5 py-0 h-4 bg-blue-500/20 text-blue-300 border-blue-500/30"
                              >
                                {tag.icon}
                                <span className="ml-1">{tag.label}</span>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          launch.status === "Go for Launch" ? "success" :
                          launch.status === "To Be Determined" ? "warning" : "default"
                        }
                        className={`flex-shrink-0 ${isFeatured ? 'shadow-lg' : ''}`}
                      >
                        {getTimeUntil(launch.window_start)}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(launch.window_start)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{launch.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
