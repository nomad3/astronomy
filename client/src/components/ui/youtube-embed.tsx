"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

function extractVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/live\/([^&\s?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function YouTubeEmbed({ url, title, className = "" }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = extractVideoId(url);

  if (!videoId) {
    return null;
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isLoaded) {
    return (
      <div
        className={`relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group ${className}`}
        onClick={() => setIsLoaded(true)}
      >
        {/* Thumbnail */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={title || "Video thumbnail"}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to hqdefault if maxresdefault doesn't exist
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }}
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-8 w-8 md:h-10 md:w-10 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Title overlay */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-sm md:text-base font-medium line-clamp-2">{title}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
