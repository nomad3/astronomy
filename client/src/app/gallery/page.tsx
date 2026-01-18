"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api, type APOD, type EarthImage } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Image as ImageIcon, Sparkles, Globe, Calendar, ExternalLink, Play } from "lucide-react";

export default function GalleryPage() {
  const [apod, setApod] = useState<APOD | null>(null);
  const [earthImages, setEarthImages] = useState<EarthImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEarth, setSelectedEarth] = useState<EarthImage | null>(null);

  useEffect(() => {
    Promise.all([api.getAPOD(), api.getEarthImages(6)])
      .then(([apodData, earthData]) => {
        setApod(apodData);
        setEarthImages(earthData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-gray-400">NASA imagery from space</p>
        </div>
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ImageIcon className="h-7 w-7 text-purple-400" />
          Gallery
        </h1>
        <p className="text-gray-400 mt-1">
          NASA imagery from across the cosmos
        </p>
      </div>

      {/* APOD Section */}
      {apod && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Astronomy Picture of the Day</h2>
          </div>
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px]">
                {apod.media_type === "image" ? (
                  <Image
                    src={apod.url}
                    alt={apod.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full min-h-[400px]">
                    <iframe
                      src={apod.url}
                      title={apod.title}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="info">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-6 flex flex-col justify-center">
                <Badge variant="purple" className="w-fit mb-3">
                  {formatDate(apod.date)}
                </Badge>
                <h3 className="text-xl font-bold text-white mb-3">{apod.title}</h3>
                <p className="text-gray-400 leading-relaxed line-clamp-6">
                  {apod.explanation}
                </p>
                {apod.copyright && (
                  <p className="text-sm text-gray-500 mt-4">
                    © {apod.copyright}
                  </p>
                )}
                {apod.hdurl && (
                  <a
                    href={apod.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4"
                  >
                    <Button variant="secondary">
                      View HD Image
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                )}
              </CardContent>
            </div>
          </Card>
        </section>
      )}

      {/* Earth from Space Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Earth from Space</h2>
          <Badge variant="info" className="ml-2">DSCOVR EPIC</Badge>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Full-disk images of Earth from the DSCOVR satellite at the L1 Lagrange point
        </p>

        {selectedEarth && (
          <Card className="overflow-hidden mb-4">
            <div className="grid lg:grid-cols-2">
              <div className="relative aspect-square">
                <Image
                  src={selectedEarth.image_url}
                  alt={selectedEarth.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedEarth.date)}
                </div>
                <p className="text-gray-300">{selectedEarth.caption}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-500">Latitude</p>
                    <p className="text-white font-mono">
                      {selectedEarth.centroid_coordinates.lat.toFixed(2)}°
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-500">Longitude</p>
                    <p className="text-white font-mono">
                      {selectedEarth.centroid_coordinates.lon.toFixed(2)}°
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {earthImages.map((image) => (
            <button
              key={image.identifier}
              onClick={() => setSelectedEarth(image)}
              className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                selectedEarth?.identifier === image.identifier
                  ? "ring-2 ring-blue-500 scale-95"
                  : "hover:scale-105"
              }`}
            >
              <Image
                src={image.image_url}
                alt={image.caption}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs text-white truncate">
                  {formatDate(image.date)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
