"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Discovery } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Calendar, ExternalLink, ImageOff, Sparkles } from "lucide-react";

interface DiscoveryCardProps {
  discovery: Discovery;
  variant?: "default" | "featured";
}

export function DiscoveryCard({ discovery, variant = "default" }: DiscoveryCardProps) {
  const [imageError, setImageError] = useState(false);

  if (variant === "featured") {
    return (
      <a
        href={discovery.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <Card className="overflow-hidden hover:ring-2 hover:ring-blue-500/50 transition-all">
          <div className="relative aspect-video bg-gray-800">
            {discovery.image_url && !imageError ? (
              <Image
                src={discovery.image_url}
                alt={discovery.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                <Sparkles className="h-12 w-12 text-blue-400 mb-2" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                {discovery.telescope && (
                  <Badge className={discovery.telescope === "jwst"
                    ? "bg-amber-500/80 text-white"
                    : "bg-purple-500/80 text-white"
                  }>
                    {discovery.telescope === "jwst" ? "JWST" : "Hubble"}
                  </Badge>
                )}
                <span className="text-xs text-gray-300">
                  {formatDate(discovery.date)}
                </span>
              </div>

              <h3 className="font-bold text-white text-lg line-clamp-2 group-hover:text-blue-300 transition-colors">
                {discovery.title}
              </h3>

              <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                {discovery.summary}
              </p>

              <div className="flex items-center gap-1 mt-3 text-blue-400 text-sm">
                <span>Read more</span>
                <ExternalLink className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </a>
    );
  }

  return (
    <a
      href={discovery.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="overflow-hidden hover:bg-white/5 transition-colors h-full">
        {/* Image */}
        <div className="relative h-32 bg-gray-800">
          {discovery.image_url && !imageError ? (
            <Image
              src={discovery.image_url}
              alt={discovery.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-purple-900/30">
              <Sparkles className="h-8 w-8 text-blue-400/50" />
            </div>
          )}

          {discovery.telescope && (
            <div className="absolute top-2 right-2">
              <Badge className={discovery.telescope === "jwst"
                ? "bg-amber-500/80 text-white text-xs"
                : "bg-purple-500/80 text-white text-xs"
              }>
                {discovery.telescope === "jwst" ? "JWST" : "Hubble"}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Calendar className="h-3 w-3" />
            {formatDate(discovery.date)}
          </div>

          <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
            {discovery.title}
          </h3>

          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {discovery.summary}
          </p>
        </div>
      </Card>
    </a>
  );
}
