"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type Launch } from "@/lib/api";
import { getTimeUntil, formatDateTime } from "@/lib/utils";
import {
  Rocket,
  MapPin,
  Calendar,
  Clock,
  Building2,
  ArrowRight,
  Star,
  Users,
  Moon,
} from "lucide-react";

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

interface ScoredLaunch extends Launch {
  notabilityScore: number;
  tags: { icon: React.ReactNode; label: string }[];
}

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<ScoredLaunch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLaunches(20)
      .then((rawLaunches) => {
        // Score all launches
        const scored = rawLaunches.map(launch => ({
          ...launch,
          notabilityScore: calculateNotabilityScore(launch),
          tags: getNotabilityTags(launch),
        }));

        // Sort: notable launches first (by score), then chronologically
        scored.sort((a, b) => {
          if (a.notabilityScore > 0 && b.notabilityScore === 0) return -1;
          if (b.notabilityScore > 0 && a.notabilityScore === 0) return 1;
          if (a.notabilityScore > 0 && b.notabilityScore > 0) {
            return b.notabilityScore - a.notabilityScore;
          }
          return new Date(a.window_start).getTime() - new Date(b.window_start).getTime();
        });

        setLaunches(scored);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Upcoming Launches</h1>
          <p className="text-gray-400">Track rocket launches from around the world</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Rocket className="h-7 w-7 text-blue-400" />
          Upcoming Launches
        </h1>
        <p className="text-gray-400 mt-1">
          {launches.length} launches scheduled
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {launches.map((launch, index) => {
          const isFeatured = launch.notabilityScore > 0 && index === 0;
          const isNotable = launch.notabilityScore > 0;

          return (
            <Link key={launch.id} href={`/launches/${launch.slug}`}>
              <Card
                className={`
                  overflow-hidden transition-all cursor-pointer h-full relative
                  ${isFeatured
                    ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]'
                    : isNotable
                      ? 'border-amber-500/30 hover:border-amber-500/50'
                      : 'hover:border-white/20 hover:bg-white/5'
                  }
                `}
              >
                {/* Featured Star Badge */}
                {isFeatured && (
                  <div className="absolute top-3 left-3 z-10 bg-amber-500 rounded-full p-2 shadow-lg shadow-amber-500/50">
                    <Star className="h-4 w-4 text-black fill-current" />
                  </div>
                )}

                <CardContent className="p-0">
                  {launch.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={launch.image}
                        alt={launch.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      <div className={`absolute inset-0 ${isFeatured ? 'bg-gradient-to-t from-amber-900/80 via-black/50 to-transparent' : 'bg-gradient-to-t from-black/80 to-transparent'}`} />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              launch.status === "Go for Launch" ? "success" :
                              launch.status === "To Be Determined" ? "warning" : "default"
                            }
                          >
                            {launch.status}
                          </Badge>
                          {/* Notable tags */}
                          {isNotable && launch.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              className="bg-blue-500/30 text-blue-200 border-blue-500/50"
                            >
                              {tag.icon}
                              <span className="ml-1">{tag.label}</span>
                            </Badge>
                          ))}
                        </div>
                        <h3 className={`text-lg font-semibold line-clamp-2 ${isFeatured ? 'text-amber-400' : 'text-white'}`}>
                          {launch.name}
                        </h3>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="info" className={`font-mono ${isFeatured ? 'bg-amber-500/30 text-amber-200 border-amber-500/50' : ''}`}>
                          {getTimeUntil(launch.window_start)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className={`p-4 space-y-3 ${isFeatured ? 'bg-gradient-to-b from-amber-500/5 to-transparent' : ''}`}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(launch.window_start)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeUntil(launch.window_start)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{launch.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Building2 className="h-4 w-4 text-blue-400" />
                          <span className="truncate max-w-[120px]">{launch.provider}</span>
                        </div>
                        {launch.orbit && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Rocket className="h-4 w-4 text-purple-400" />
                            <span>{launch.orbit}</span>
                          </div>
                        )}
                      </div>
                      <ArrowRight className={`h-5 w-5 ${isFeatured ? 'text-amber-500' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
