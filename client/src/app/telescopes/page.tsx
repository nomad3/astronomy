"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type TelescopeImage } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Telescope, Calendar, ExternalLink } from "lucide-react";

const telescopes = [
  { id: "jwst", name: "James Webb", icon: "🔭", color: "amber" },
  { id: "hubble", name: "Hubble", icon: "🌌", color: "purple" },
];

export default function TelescopesPage() {
  const [jwstImages, setJwstImages] = useState<TelescopeImage[]>([]);
  const [hubbleImages, setHubbleImages] = useState<TelescopeImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTelescope, setSelectedTelescope] = useState("jwst");
  const [selectedImage, setSelectedImage] = useState<TelescopeImage | null>(null);

  useEffect(() => {
    Promise.all([api.getJWSTImages(12), api.getHubbleImages(12)])
      .then(([jwst, hubble]) => {
        setJwstImages(jwst);
        setHubbleImages(hubble);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const images = selectedTelescope === "jwst" ? jwstImages : hubbleImages;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Space Telescopes</h1>
          <p className="text-gray-400">Imagery from JWST and Hubble</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Telescope className="h-7 w-7 text-amber-400" />
          Space Telescopes
        </h1>
        <p className="text-gray-400 mt-1">
          Deep space imagery from humanity&apos;s greatest observatories
        </p>
      </div>

      {/* Telescope Selector */}
      <div className="flex gap-4">
        {telescopes.map((telescope) => (
          <button
            key={telescope.id}
            onClick={() => {
              setSelectedTelescope(telescope.id);
              setSelectedImage(null);
            }}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
              selectedTelescope === telescope.id
                ? telescope.color === "amber"
                  ? "bg-amber-500/20 border-2 border-amber-500/50"
                  : "bg-purple-500/20 border-2 border-purple-500/50"
                : "bg-white/5 border-2 border-white/10 hover:bg-white/10"
            }`}
          >
            <span className="text-2xl">{telescope.icon}</span>
            <div className="text-left">
              <p className={`font-semibold ${
                selectedTelescope === telescope.id
                  ? telescope.color === "amber" ? "text-amber-400" : "text-purple-400"
                  : "text-white"
              }`}>
                {telescope.name}
              </p>
              <p className="text-xs text-gray-500">Space Telescope</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Image Display */}
      {selectedImage && (
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square lg:aspect-auto lg:min-h-[500px]">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6 flex flex-col justify-center">
              <Badge
                variant={selectedTelescope === "jwst" ? "warning" : "purple"}
                className="w-fit mb-3"
              >
                {selectedTelescope === "jwst" ? "James Webb" : "Hubble"}
              </Badge>
              <h2 className="text-xl font-bold text-white mb-3">
                {selectedImage.title}
              </h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                <Calendar className="h-4 w-4" />
                {formatDate(selectedImage.date_created)}
              </div>
              <p className="text-gray-400 leading-relaxed line-clamp-6">
                {selectedImage.description}
              </p>
              {selectedImage.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedImage.keywords.slice(0, 5).map((keyword) => (
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
            </CardContent>
          </div>
        </Card>
      )}

      {/* Image Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <button
            key={image.nasa_id}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all group ${
              selectedImage?.nasa_id === image.nasa_id
                ? selectedTelescope === "jwst"
                  ? "ring-2 ring-amber-500 scale-95"
                  : "ring-2 ring-purple-500 scale-95"
                : "hover:scale-105"
            }`}
          >
            <Image
              src={image.image_url}
              alt={image.title}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
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
        <Card>
          <CardContent className="py-12 text-center">
            <Telescope className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No images available</p>
          </CardContent>
        </Card>
      )}

      {/* Telescope Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🔭</span>
              <div>
                <h3 className="text-lg font-semibold text-amber-400">James Webb Space Telescope</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Launched December 25, 2021. The most powerful space telescope ever built,
                  observing in infrared to see the earliest galaxies and peer through cosmic dust.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white/5">
                    <p className="text-gray-500">Mirror Diameter</p>
                    <p className="text-white">6.5 meters</p>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <p className="text-gray-500">Location</p>
                    <p className="text-white">L2 Lagrange Point</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🌌</span>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Hubble Space Telescope</h3>
                <p className="text-sm text-gray-400 mt-2">
                  Launched April 24, 1990. Has revolutionized astronomy with over 1.5 million
                  observations, capturing iconic images of deep space.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white/5">
                    <p className="text-gray-500">Mirror Diameter</p>
                    <p className="text-white">2.4 meters</p>
                  </div>
                  <div className="p-2 rounded bg-white/5">
                    <p className="text-gray-500">Orbit</p>
                    <p className="text-white">~540 km LEO</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
