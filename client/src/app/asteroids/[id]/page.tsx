"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type AsteroidDetail } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  Orbit,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Ruler,
  Gauge,
  Calendar,
  Target,
  Globe,
  Activity,
  Info,
  Shield,
  Zap,
} from "lucide-react";

export default function AsteroidDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [asteroid, setAsteroid] = useState<AsteroidDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const asteroidId = params.id as string;

  useEffect(() => {
    if (!asteroidId) return;

    api.getAsteroid(asteroidId)
      .then(setAsteroid)
      .catch((err) => {
        console.error(err);
        setError("Failed to load asteroid details");
      })
      .finally(() => setLoading(false));
  }, [asteroidId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !asteroid) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Asteroid Not Found</h2>
        <p className="text-gray-400 mb-6">{error || "The asteroid you're looking for doesn't exist."}</p>
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

  const isHazardous = asteroid.is_potentially_hazardous_asteroid;
  const diameterKm = asteroid.estimated_diameter.kilometers;
  const diameterM = asteroid.estimated_diameter.meters;
  const nextApproach = asteroid.close_approach_data[asteroid.close_approach_data.length - 1];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/asteroids"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Near-Earth Objects
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-xl ${isHazardous ? "bg-red-500/20" : "bg-amber-500/20"}`}>
              <Orbit className={`h-8 w-8 ${isHazardous ? "text-red-400" : "text-amber-400"}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {asteroid.name}
              </h1>
              {asteroid.designation && (
                <p className="text-gray-400">Designation: {asteroid.designation}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant={isHazardous ? "danger" : "success"} className="text-sm">
              {isHazardous ? (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Potentially Hazardous
                </>
              ) : (
                <>
                  <Shield className="h-3 w-3 mr-1" />
                  Not Hazardous
                </>
              )}
            </Badge>
            {asteroid.is_sentry_object && (
              <Badge variant="warning" className="text-sm">
                <Target className="h-3 w-3 mr-1" />
                Sentry Object
              </Badge>
            )}
          </div>
        </div>
        {asteroid.nasa_jpl_url && (
          <a
            href={asteroid.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View on NASA JPL
          </a>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={isHazardous ? "border-red-500/30" : ""}>
          <CardContent className="pt-6 text-center">
            <Ruler className="h-6 w-6 mx-auto text-blue-400 mb-2" />
            <p className="text-xs text-gray-500">Diameter (est.)</p>
            <p className="text-lg font-bold text-white">
              {diameterM.min.toFixed(0)} - {diameterM.max.toFixed(0)}m
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Activity className="h-6 w-6 mx-auto text-purple-400 mb-2" />
            <p className="text-xs text-gray-500">Absolute Magnitude</p>
            <p className="text-lg font-bold text-white">{asteroid.absolute_magnitude_h.toFixed(2)} H</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-6 w-6 mx-auto text-emerald-400 mb-2" />
            <p className="text-xs text-gray-500">Close Approaches</p>
            <p className="text-lg font-bold text-white">{asteroid.close_approach_data.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Globe className="h-6 w-6 mx-auto text-amber-400 mb-2" />
            <p className="text-xs text-gray-500">Orbital Period</p>
            <p className="text-lg font-bold text-white">
              {asteroid.orbital_data.orbital_period
                ? `${parseFloat(asteroid.orbital_data.orbital_period).toFixed(0)} days`
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Estimated Diameter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-blue-400" />
              Estimated Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-500 mb-1">Minimum Diameter</p>
                  <p className="text-xl font-bold text-white">{diameterKm.min.toFixed(3)} km</p>
                  <p className="text-sm text-gray-400">{diameterM.min.toFixed(0)} meters</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-500 mb-1">Maximum Diameter</p>
                  <p className="text-xl font-bold text-white">{diameterKm.max.toFixed(3)} km</p>
                  <p className="text-sm text-gray-400">{diameterM.max.toFixed(0)} meters</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-400">
                  <Info className="h-4 w-4 inline mr-2" />
                  For comparison: A football field is about 100 meters long.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orbital Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Orbit className="h-5 w-5 text-purple-400" />
              Orbital Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Eccentricity</p>
                <p className="text-white font-mono">{parseFloat(asteroid.orbital_data.eccentricity || "0").toFixed(6)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Semi-Major Axis</p>
                <p className="text-white font-mono">{parseFloat(asteroid.orbital_data.semi_major_axis || "0").toFixed(4)} AU</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Inclination</p>
                <p className="text-white font-mono">{parseFloat(asteroid.orbital_data.inclination || "0").toFixed(4)}°</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Perihelion Distance</p>
                <p className="text-white font-mono">{parseFloat(asteroid.orbital_data.perihelion_distance || "0").toFixed(4)} AU</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Aphelion Distance</p>
                <p className="text-white font-mono">{parseFloat(asteroid.orbital_data.aphelion_distance || "0").toFixed(4)} AU</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Orbit Uncertainty</p>
                <p className="text-white font-mono">{asteroid.orbital_data.orbit_uncertainty || "N/A"}</p>
              </div>
            </div>
            {asteroid.orbital_data.orbit_class && (
              <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="text-sm font-medium text-purple-400 mb-1">
                  Orbit Class: {asteroid.orbital_data.orbit_class.type}
                </p>
                <p className="text-xs text-gray-400">{asteroid.orbital_data.orbit_class.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Close Approach Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-400" />
            Close Approach History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Miss Distance</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Velocity</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Orbiting</th>
                </tr>
              </thead>
              <tbody>
                {asteroid.close_approach_data.map((approach, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-white">
                      {approach.close_approach_date_full || approach.close_approach_date}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white">{parseFloat(approach.miss_distance.kilometers).toLocaleString()} km</p>
                        <p className="text-xs text-gray-500">{parseFloat(approach.miss_distance.lunar).toFixed(2)} lunar distances</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white">{parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(2)} km/s</p>
                        <p className="text-xs text-gray-500">{parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white">{approach.orbiting_body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Observation Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-400" />
            Observation Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500 mb-1">First Observed</p>
              <p className="text-white">{asteroid.orbital_data.first_observation_date || "Unknown"}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500 mb-1">Last Observed</p>
              <p className="text-white">{asteroid.orbital_data.last_observation_date || "Unknown"}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500 mb-1">Observations Used</p>
              <p className="text-white">{asteroid.orbital_data.observations_used || "Unknown"}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500 mb-1">Data Arc</p>
              <p className="text-white">{asteroid.orbital_data.data_arc_in_days ? `${asteroid.orbital_data.data_arc_in_days} days` : "Unknown"}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500 mb-1">Orbit ID</p>
              <p className="text-white font-mono text-sm">{asteroid.orbital_data.orbit_id || "Unknown"}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <p className="text-xs text-gray-500 mb-1">NEO Reference ID</p>
              <p className="text-white font-mono text-sm">{asteroid.neo_reference_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
