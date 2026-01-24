"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type TelescopeImage } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Images, Calendar, ExternalLink, X, ImageOff } from "lucide-react";

interface ImageGalleryProps {
  images: TelescopeImage[];
  telescope: "jwst" | "hubble";
  title?: string;
  showHeader?: boolean;
}

export function ImageGallery({
  images,
  telescope,
  title = "Image Gallery",
  showHeader = true,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<TelescopeImage | null>(null);
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  const handleImageError = (nasaId: string) => {
    setErrorImages(prev => new Set(prev).add(nasaId));
  };

  const config = telescope === "jwst"
    ? { color: "amber", bgClass: "bg-amber-500/20", textClass: "text-amber-400" }
    : { color: "purple", bgClass: "bg-purple-500/20", textClass: "text-purple-400" };

  return (
    <>
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Images className={`h-5 w-5 ${config.textClass}`} />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((image) => (
              <button
                key={image.nasa_id}
                onClick={() => setSelectedImage(image)}
                className={`
                  relative aspect-square rounded-xl overflow-hidden transition-all group
                  ${selectedImage?.nasa_id === image.nasa_id
                    ? `ring-2 ring-${config.color}-500 scale-95`
                    : "hover:scale-105"
                  }
                `}
              >
                {!errorImages.has(image.nasa_id) && image.image_url ? (
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    onError={() => handleImageError(image.nasa_id)}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-800">
                    <ImageOff className="h-8 w-8 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium text-white line-clamp-2">
                    {image.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(image.date_created)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Images className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No images available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-gray-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            <div className="grid lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square lg:aspect-auto lg:min-h-[500px] bg-black">
                {selectedImage.image_url && !errorImages.has(selectedImage.nasa_id) ? (
                  <Image
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                    onError={() => handleImageError(selectedImage.nasa_id)}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ImageOff className="h-16 w-16 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col">
                <Badge className={`${config.bgClass} ${config.textClass} w-fit mb-3`}>
                  {telescope === "jwst" ? "James Webb" : "Hubble"}
                </Badge>

                <h2 className="text-xl font-bold text-white mb-3">
                  {selectedImage.title}
                </h2>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedImage.date_created)}
                </div>

                <p className="text-gray-400 leading-relaxed flex-1">
                  {selectedImage.description}
                </p>

                {selectedImage.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedImage.keywords.slice(0, 6).map((keyword) => (
                      <Badge key={keyword} variant="default" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                <a
                  href={selectedImage.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
                >
                  View Full Resolution
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
