"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type LaunchDetail } from "@/lib/api";
import { formatDateTime, getTimeUntil } from "@/lib/utils";
import {
  Rocket,
  MapPin,
  Calendar,
  Clock,
  Building2,
  Globe,
  ExternalLink,
  Play,
  ArrowLeft,
  Target,
  Gauge,
  Ruler,
  Weight,
  Flame,
  Trophy,
  AlertCircle,
  Info,
  Map,
  RefreshCw,
  X,
  ZoomIn,
  Users,
  BookOpen,
  History,
  Wrench,
  User,
  CheckCircle2,
  Route,
} from "lucide-react";

export default function LaunchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [launch, setLaunch] = useState<LaunchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  // The param can be either a UUID or a slug - backend handles both
  const launchIdentifier = params.id as string;

  useEffect(() => {
    if (!launchIdentifier) return;

    api.getLaunch(launchIdentifier)
      .then(setLaunch)
      .catch((err) => {
        console.error(err);
        setError("Failed to load launch details");
      })
      .finally(() => setLoading(false));
  }, [launchIdentifier]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !launch) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Launch Not Found</h2>
        <p className="text-gray-400 mb-6">{error || "The launch you're looking for doesn't exist."}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const statusVariant = launch.status.abbrev === "Go" ? "success" :
    launch.status.abbrev === "TBD" || launch.status.abbrev === "TBC" ? "warning" : "default";

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/launches"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Launches
      </Link>

      {/* Full Screen Image Modal */}
      {showFullImage && launch.image && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-zoom-out"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
            <Image
              src={launch.image}
              alt={launch.name}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
          <p className="absolute bottom-4 text-gray-400 text-sm">Click anywhere to close</p>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        {launch.image ? (
          <div
            className="relative h-72 md:h-96 w-full cursor-zoom-in group"
            onClick={() => setShowFullImage(true)}
          >
            <Image
              src={launch.image}
              alt={launch.name}
              fill
              className="object-contain bg-black/50"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            {/* Zoom hint */}
            <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white/80 text-sm">
              <ZoomIn className="h-4 w-4" />
              Click to enlarge
            </div>
          </div>
        ) : (
          <div className="h-72 md:h-96 w-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
            <Rocket className="h-24 w-24 text-white/20" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={statusVariant} className="text-sm">
              {launch.status.name}
            </Badge>
            {launch.webcast_live && (
              <Badge variant="danger" className="text-sm animate-pulse">
                <Play className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            )}
            {launch.probability !== null && launch.probability >= 0 && (
              <Badge variant="info" className="text-sm">
                {launch.probability}% probability
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            {launch.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDateTime(launch.window_start)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {getTimeUntil(launch.window_start)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <Building2 className="h-6 w-6 mx-auto text-blue-400 mb-2" />
            <p className="text-xs text-gray-500">Provider</p>
            <p className="text-sm font-medium text-white truncate">{launch.provider.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Rocket className="h-6 w-6 mx-auto text-purple-400 mb-2" />
            <p className="text-xs text-gray-500">Rocket</p>
            <p className="text-sm font-medium text-white truncate">{launch.rocket.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Target className="h-6 w-6 mx-auto text-amber-400 mb-2" />
            <p className="text-xs text-gray-500">Orbit</p>
            <p className="text-sm font-medium text-white truncate">
              {launch.mission?.orbit?.name || "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <MapPin className="h-6 w-6 mx-auto text-emerald-400 mb-2" />
            <p className="text-xs text-gray-500">Launch Site</p>
            <p className="text-sm font-medium text-white truncate">{launch.pad.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Mission & Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Details */}
          {launch.mission && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-400" />
                  Mission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{launch.mission.name}</h3>
                  {launch.mission.type && (
                    <Badge variant="default" className="mt-2">{launch.mission.type}</Badge>
                  )}
                </div>
                {launch.mission.description && (
                  <p className="text-gray-300 leading-relaxed">{launch.mission.description}</p>
                )}
                {launch.mission.orbit && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="h-4 w-4" />
                    <span>Target Orbit: {launch.mission.orbit.name}</span>
                    {launch.mission.orbit.abbrev && (
                      <Badge variant="info" className="text-xs">{launch.mission.orbit.abbrev}</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Crew Profiles - Enriched Content */}
          {launch.enrichment?.crew_profiles?.crew && launch.enrichment.crew_profiles.crew.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Crew
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {launch.enrichment.crew_profiles.crew.map((member, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">{member.name}</h4>
                        <p className="text-sm text-blue-400">{member.role}</p>
                        {member.agency && (
                          <p className="text-xs text-gray-500">{member.agency} • {member.nationality}</p>
                        )}
                        {member.bio && (
                          <p className="text-xs text-gray-400 mt-2 line-clamp-2">{member.bio}</p>
                        )}
                        {member.previous_missions && member.previous_missions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.previous_missions.slice(0, 2).map((mission, i) => (
                              <Badge key={i} variant="default" className="text-[10px]">
                                {mission}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mission Objectives - Enriched Content */}
          {launch.enrichment?.mission_objectives && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-400" />
                  Mission Objectives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {launch.enrichment.mission_objectives.primary_goal && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Primary Goal</h4>
                    <p className="text-gray-300">{launch.enrichment.mission_objectives.primary_goal}</p>
                  </div>
                )}

                {launch.enrichment.mission_objectives.experiments && launch.enrichment.mission_objectives.experiments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Experiments & Payloads</h4>
                    <ul className="space-y-2">
                      {launch.enrichment.mission_objectives.experiments.map((exp, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {launch.enrichment.mission_objectives.milestones && launch.enrichment.mission_objectives.milestones.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Key Milestones</h4>
                    <ul className="space-y-2">
                      {launch.enrichment.mission_objectives.milestones.map((milestone, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                          <Target className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-4 pt-3 border-t border-white/10 text-sm">
                  {launch.enrichment.mission_objectives.duration && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{launch.enrichment.mission_objectives.duration}</span>
                    </div>
                  )}
                  {launch.enrichment.mission_objectives.trajectory && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Route className="h-4 w-4" />
                      <span>{launch.enrichment.mission_objectives.trajectory}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historical Context - Enriched Content */}
          {launch.enrichment?.historical_context && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-400" />
                  Historical Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {launch.enrichment.historical_context.significance && (
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-gray-300 leading-relaxed">
                      {launch.enrichment.historical_context.significance}
                    </p>
                  </div>
                )}

                {launch.enrichment.historical_context.program_history && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Program History</h4>
                    <p className="text-gray-300 text-sm">
                      {launch.enrichment.historical_context.program_history}
                    </p>
                  </div>
                )}

                {launch.enrichment.historical_context.milestones && launch.enrichment.historical_context.milestones.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Historical Milestones</h4>
                    <div className="space-y-2">
                      {launch.enrichment.historical_context.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                          <div className="h-2 w-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {launch.enrichment.historical_context.future_implications && (
                  <div className="pt-3 border-t border-white/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Future Implications</h4>
                    <p className="text-gray-300 text-sm">
                      {launch.enrichment.historical_context.future_implications}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Details - Enriched Content */}
          {launch.enrichment?.technical_details && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-400" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {launch.enrichment.technical_details.vehicle && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Launch Vehicle</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {launch.enrichment.technical_details.vehicle.name && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.vehicle.name}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.vehicle.height && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Height</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.vehicle.height}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.vehicle.thrust && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Thrust</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.vehicle.thrust}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.vehicle.stages && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Stages</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.vehicle.stages}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {launch.enrichment.technical_details.spacecraft && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Spacecraft</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {launch.enrichment.technical_details.spacecraft.name && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.spacecraft.name}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.spacecraft.capacity && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Capacity</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.spacecraft.capacity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {launch.enrichment.technical_details.mission_parameters && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Mission Parameters</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {launch.enrichment.technical_details.mission_parameters.destination && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Destination</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.mission_parameters.destination}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.mission_parameters.distance && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Distance</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.mission_parameters.distance}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.mission_parameters.duration && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.mission_parameters.duration}</p>
                        </div>
                      )}
                      {launch.enrichment.technical_details.mission_parameters.orbit_type && (
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-gray-500">Orbit Type</p>
                          <p className="text-white font-medium">{launch.enrichment.technical_details.mission_parameters.orbit_type}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Rocket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-purple-400" />
                Rocket: {launch.rocket.full_name || launch.rocket.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                {launch.rocket.image_url && (
                  <div className="relative h-32 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={launch.rocket.image_url}
                      alt={launch.rocket.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  {launch.rocket.description && (
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                      {launch.rocket.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                {launch.rocket.length && (
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Ruler className="h-3 w-3" />
                      Length
                    </div>
                    <p className="text-white font-mono">{launch.rocket.length}m</p>
                  </div>
                )}
                {launch.rocket.diameter && (
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Gauge className="h-3 w-3" />
                      Diameter
                    </div>
                    <p className="text-white font-mono">{launch.rocket.diameter}m</p>
                  </div>
                )}
                {launch.rocket.launch_mass && (
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Weight className="h-3 w-3" />
                      Launch Mass
                    </div>
                    <p className="text-white font-mono">{launch.rocket.launch_mass.toLocaleString()}t</p>
                  </div>
                )}
                {launch.rocket.to_thrust && (
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Flame className="h-3 w-3" />
                      Thrust
                    </div>
                    <p className="text-white font-mono">{launch.rocket.to_thrust.toLocaleString()}kN</p>
                  </div>
                )}
              </div>

              {(launch.rocket.leo_capacity || launch.rocket.gto_capacity) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  {launch.rocket.leo_capacity && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">LEO Capacity</p>
                      <p className="text-white">{launch.rocket.leo_capacity.toLocaleString()} kg</p>
                    </div>
                  )}
                  {launch.rocket.gto_capacity && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">GTO Capacity</p>
                      <p className="text-white">{launch.rocket.gto_capacity.toLocaleString()} kg</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">{launch.rocket.successful_launches}</span>
                  <span className="text-gray-500">successful</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400">{launch.rocket.failed_launches}</span>
                  <span className="text-gray-500">failed</span>
                </div>
                {launch.rocket.wiki_url && (
                  <a
                    href={launch.rocket.wiki_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Wiki
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Launch Updates */}
          {launch.updates && launch.updates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-400" />
                  Launch Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {launch.updates.slice(0, 5).map((update) => (
                  <div key={update.id} className="border-l-2 border-blue-500/50 pl-4 py-2">
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDateTime(update.created_on)}
                    </p>
                    <p className="text-gray-300 text-sm">{update.comment}</p>
                    {update.info_url && (
                      <a
                        href={update.info_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        More info
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Provider, Pad, Links */}
        <div className="space-y-6">
          {/* Launch Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-400" />
                Launch Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {launch.provider.logo_url && (
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/10">
                    <Image
                      src={launch.provider.logo_url}
                      alt={launch.provider.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-white">{launch.provider.name}</h3>
                  {launch.provider.country_code && (
                    <p className="text-xs text-gray-500">{launch.provider.country_code}</p>
                  )}
                </div>
              </div>
              {launch.provider.description && (
                <p className="text-sm text-gray-400 line-clamp-3">{launch.provider.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm pt-2 border-t border-white/10">
                <div>
                  <span className="text-emerald-400">{launch.provider.successful_launches}</span>
                  <span className="text-gray-500 ml-1">successful</span>
                </div>
                <div>
                  <span className="text-red-400">{launch.provider.failed_launches}</span>
                  <span className="text-gray-500 ml-1">failed</span>
                </div>
              </div>
              {launch.provider.wiki_url && (
                <a
                  href={launch.provider.wiki_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  Learn more
                </a>
              )}
            </CardContent>
          </Card>

          {/* Launch Pad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                Launch Pad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-white">{launch.pad.name}</h3>
                {launch.pad.location && (
                  <p className="text-sm text-gray-400">{launch.pad.location.name}</p>
                )}
              </div>
              {launch.pad.latitude && launch.pad.longitude && (
                <div className="text-sm text-gray-500">
                  <p>Lat: {launch.pad.latitude}</p>
                  <p>Lon: {launch.pad.longitude}</p>
                </div>
              )}
              <div className="text-sm">
                <span className="text-gray-500">Total launches from this pad: </span>
                <span className="text-white">{launch.pad.total_launch_count}</span>
              </div>
              <div className="flex gap-2">
                {launch.pad.map_url && (
                  <a
                    href={launch.pad.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <Map className="h-4 w-4" />
                    View Map
                  </a>
                )}
                {launch.pad.wiki_url && (
                  <a
                    href={launch.pad.wiki_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Wiki
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Links & Resources */}
          {(launch.vid_urls.length > 0 || launch.info_urls.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-400" />
                  Links & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {launch.vid_urls.map((vid, idx) => (
                  <a
                    key={idx}
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Play className="h-5 w-5 text-red-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{vid.title || "Watch Video"}</p>
                      {vid.description && (
                        <p className="text-xs text-gray-500 truncate">{vid.description}</p>
                      )}
                    </div>
                  </a>
                ))}
                {launch.info_urls.map((info, idx) => (
                  <a
                    key={idx}
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Info className="h-5 w-5 text-blue-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{info.title || "More Info"}</p>
                      {info.description && (
                        <p className="text-xs text-gray-500 truncate">{info.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Programs */}
          {launch.programs && launch.programs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-amber-400" />
                  Programs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {launch.programs.map((program) => (
                  <div key={program.id} className="flex gap-3">
                    {program.image_url && (
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={program.image_url}
                          alt={program.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm">{program.name}</h4>
                      {program.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">{program.description}</p>
                      )}
                      {program.wiki_url && (
                        <a
                          href={program.wiki_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Learn more
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Status Details */}
          {launch.status.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-gray-400" />
                  Status Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={statusVariant} className="mb-3">{launch.status.name}</Badge>
                <p className="text-sm text-gray-400">{launch.status.description}</p>
                {launch.hold_reason && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-400 font-medium mb-1">Hold Reason</p>
                    <p className="text-sm text-gray-300">{launch.hold_reason}</p>
                  </div>
                )}
                {launch.fail_reason && (
                  <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-xs text-red-400 font-medium mb-1">Failure Reason</p>
                    <p className="text-sm text-gray-300">{launch.fail_reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
