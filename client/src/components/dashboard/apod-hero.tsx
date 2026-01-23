"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type APOD } from "@/lib/api";
import { Sparkles, ExternalLink, Camera, ImageOff } from "lucide-react";

export function APODHero() {
  const [apod, setApod] = useState<APOD | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    api.getAPOD()
      .then(setApod)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
        <Skeleton className="absolute inset-0" />
      </div>
    );
  }

  if (!apod) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden group">
      {/* Background Image */}
      {imageError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80">
          <ImageOff className="h-12 w-12 text-gray-500 mb-2" />
          <span className="text-gray-400 text-sm">Image unavailable</span>
        </div>
      ) : apod.media_type === "image" ? (
        <Image
          src={apod.hdurl || apod.url}
          alt={apod.title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => {
            console.warn(`[APOD Hero] Failed to load image: ${apod.hdurl || apod.url}`);
            setImageError(true);
          }}
        />
      ) : (
        <iframe
          src={apod.url}
          title={apod.title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        <div className="max-w-3xl">
          <Badge variant="purple" className="mb-3">
            <Sparkles className="h-3 w-3 mr-1" />
            NASA Picture of the Day
          </Badge>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {apod.title}
          </h2>

          <p className="text-sm md:text-base text-gray-200 line-clamp-2 md:line-clamp-3 max-w-2xl drop-shadow">
            {apod.explanation}
          </p>

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            {apod.copyright && (
              <span className="text-xs md:text-sm text-gray-300 flex items-center gap-1">
                <Camera className="h-3 w-3" />
                {apod.copyright}
              </span>
            )}
            <span className="text-xs md:text-sm text-gray-400">
              {apod.date}
            </span>
            <Link
              href="/gallery"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              View Full Gallery
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle animated border glow */}
      <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
    </div>
  );
}
