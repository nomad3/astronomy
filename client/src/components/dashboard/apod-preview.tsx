"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type APOD } from "@/lib/api";
import { Sparkles, ExternalLink } from "lucide-react";

interface APODPreviewProps {
  className?: string;
}

export function APODPreview({ className }: APODPreviewProps) {
  const [apod, setApod] = useState<APOD | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAPOD()
      .then(setApod)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className={`overflow-hidden flex flex-col ${className || ""}`}>
        <Skeleton className="aspect-video w-full" />
        <CardContent className="pt-4 flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </CardContent>
      </Card>
    );
  }

  if (!apod) return null;

  return (
    <Card className={`overflow-hidden group flex flex-col ${className || ""}`}>
      <div className="relative aspect-video w-full overflow-hidden">
        {apod.media_type === "image" ? (
          <Image
            src={apod.url}
            alt={apod.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <iframe
            src={apod.url}
            title={apod.title}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant="purple" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Picture of the Day
          </Badge>
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {apod.title}
          </h3>
        </div>
      </div>
      <CardContent className="pt-4 flex-1">
        <p className="text-sm text-gray-400 line-clamp-2">{apod.explanation}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {apod.copyright && `© ${apod.copyright}`}
          </span>
          <Link
            href="/gallery"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View Gallery
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
