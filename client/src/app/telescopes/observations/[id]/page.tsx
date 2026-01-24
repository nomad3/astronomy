"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, type ObservationDetail } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InstrumentBadge } from "@/components/telescopes";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Target,
  Telescope,
  FileText,
  ExternalLink,
  ImageOff,
  Compass,
  Clock,
  Tag,
} from "lucide-react";

const categoryColors: Record<string, string> = {
  exoplanets: "bg-green-500/20 text-green-400 border-green-500/30",
  galaxies: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  nebulae: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  stars: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  solar_system: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function ObservationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [observation, setObservation] = useState<ObservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;

    api.getObservationDetail(id)
      .then(setObservation)
      .catch((err) => {
        console.error("Failed to fetch observation:", err);
        setError("Observation not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-video rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !observation) {
    return (
      <div className="space-y-6">
        <Link
          href="/telescopes"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Telescopes
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <Telescope className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Observation Not Found</h2>
            <p className="text-gray-400">
              The observation you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/telescopes"
              className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Telescopes
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const telescopeConfig = observation.telescope === "jwst"
    ? { name: "James Webb", color: "amber", bgClass: "bg-amber-500/20", textClass: "text-amber-400" }
    : { name: "Hubble", color: "purple", bgClass: "bg-purple-500/20", textClass: "text-purple-400" };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href={`/telescopes/${observation.telescope}`}
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {telescopeConfig.name}
      </Link>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image */}
        <Card className="overflow-hidden">
          <div className="relative aspect-square bg-black">
            {observation.image_url && !imageError ? (
              <Image
                src={observation.hd_url || observation.image_url}
                alt={observation.target_name}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center">
                <ImageOff className="h-16 w-16 text-gray-600 mb-3" />
                <span className="text-gray-500">Image unavailable</span>
              </div>
            )}

            {/* Telescope Badge */}
            <div className="absolute top-4 right-4">
              <Badge className={`${telescopeConfig.bgClass} ${telescopeConfig.textClass}`}>
                {telescopeConfig.name}
              </Badge>
            </div>
          </div>

          {observation.image_url && (
            <CardContent className="p-4 border-t border-white/10">
              <a
                href={observation.hd_url || observation.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:underline"
              >
                View Full Resolution
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          )}
        </Card>

        {/* Details */}
        <div className="space-y-4">
          {/* Title and Category */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={categoryColors[observation.category] || categoryColors.other}>
                {observation.category}
              </Badge>
              <InstrumentBadge instrument={observation.instrument} telescope={observation.telescope} />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {observation.target_name}
            </h1>
          </div>

          {/* Metadata Grid */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Date Observed</p>
                    <p className="text-sm text-white">{formatDate(observation.date_observed)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Telescope className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Telescope</p>
                    <p className="text-sm text-white">{telescopeConfig.name}</p>
                  </div>
                </div>

                {observation.program_id && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Program ID</p>
                      <p className="text-sm text-white">{observation.program_id}</p>
                    </div>
                  </div>
                )}

                {observation.pi_name && (
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Credit</p>
                      <p className="text-sm text-white">{observation.pi_name}</p>
                    </div>
                  </div>
                )}

                {observation.ra !== undefined && observation.ra !== null && (
                  <div className="flex items-start gap-3">
                    <Compass className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">RA / Dec</p>
                      <p className="text-sm text-white font-mono">
                        {observation.ra?.toFixed(4)}° / {observation.dec?.toFixed(4)}°
                      </p>
                    </div>
                  </div>
                )}

                {observation.exposure_time && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Exposure Time</p>
                      <p className="text-sm text-white">{observation.exposure_time}s</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {observation.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {observation.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {observation.keywords && observation.keywords.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Keywords
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {observation.keywords.map((keyword) => (
                    <Badge key={keyword} variant="default" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* External Link */}
          <a
            href={`https://images.nasa.gov/details/${observation.obs_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:underline"
          >
            View on NASA Images
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
