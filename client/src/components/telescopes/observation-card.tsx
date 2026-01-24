"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Observation } from "@/lib/api";
import { InstrumentBadge } from "./instrument-badge";
import { formatDate } from "@/lib/utils";
import { Calendar, ImageOff, ExternalLink } from "lucide-react";

interface ObservationCardProps {
  observation: Observation;
  variant?: "default" | "compact";
}

const categoryColors: Record<string, string> = {
  exoplanets: "bg-green-500/20 text-green-400 border-green-500/30",
  galaxies: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  nebulae: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  stars: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  solar_system: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export function ObservationCard({ observation, variant = "default" }: ObservationCardProps) {
  const [imageError, setImageError] = useState(false);

  if (variant === "compact") {
    return (
      <Link href={`/telescopes/observations/${observation.obs_id}`}>
        <div className="flex gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          {/* Thumbnail */}
          <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
            {observation.thumbnail_url && !imageError ? (
              <Image
                src={observation.thumbnail_url}
                alt={observation.target_name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ImageOff className="h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {observation.target_name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <InstrumentBadge instrument={observation.instrument} telescope={observation.telescope} />
              <span className="text-xs text-gray-500">
                {formatDate(observation.date_observed)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/telescopes/observations/${observation.obs_id}`}>
      <Card className="overflow-hidden hover:bg-white/5 transition-colors cursor-pointer group">
        {/* Image */}
        <div className="relative aspect-video bg-gray-800">
          {observation.thumbnail_url && !imageError ? (
            <Image
              src={observation.thumbnail_url}
              alt={observation.target_name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center">
              <ImageOff className="h-8 w-8 text-gray-600 mb-2" />
              <span className="text-xs text-gray-500">No preview</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge className={categoryColors[observation.category] || categoryColors.other}>
              {observation.category}
            </Badge>
          </div>

          <div className="absolute top-2 right-2">
            <Badge className={observation.telescope === "jwst"
              ? "bg-amber-500/80 text-white"
              : "bg-purple-500/80 text-white"
            }>
              {observation.telescope === "jwst" ? "JWST" : "Hubble"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {observation.target_name}
          </h3>

          {observation.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {observation.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <InstrumentBadge instrument={observation.instrument} telescope={observation.telescope} />
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {formatDate(observation.date_observed)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
