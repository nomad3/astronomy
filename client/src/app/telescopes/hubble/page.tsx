"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type TelescopeImage } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TelescopeStatusCard,
  ObservationFeed,
  ImageGallery,
} from "@/components/telescopes";
import { ArrowLeft, Telescope, Info, Satellite } from "lucide-react";

export default function HubblePage() {
  const [images, setImages] = useState<TelescopeImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    api.getHubbleImages(16)
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoadingImages(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/telescopes"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Telescopes
          </Link>
          <h1 className="text-2xl font-bold text-purple-400 flex items-center gap-3">
            <span className="text-3xl">🌌</span>
            Hubble Space Telescope
          </h1>
          <p className="text-gray-400 mt-1">
            Observations and imagery from the pioneering space observatory
          </p>
        </div>
      </div>

      {/* Status + Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400">Telescope Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-black/20">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-lg font-semibold text-green-400">Operational</p>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <p className="text-xs text-gray-500">Years in Service</p>
                <p className="text-lg font-semibold text-white">34+</p>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <p className="text-xs text-gray-500">Orbit Altitude</p>
                <p className="text-lg font-semibold text-white">~540 km</p>
              </div>
              <div className="p-3 rounded-lg bg-black/20">
                <p className="text-xs text-gray-500">Orbital Period</p>
                <p className="text-lg font-semibold text-white">~95 minutes</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <p className="text-sm text-gray-300">
                Hubble completes approximately 15 orbits per day, traveling at about 27,000 km/h
                around Earth in low Earth orbit (LEO).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-purple-400" />
              About Hubble
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              The Hubble Space Telescope, launched on April 24, 1990, has revolutionized our
              understanding of the universe. It has made over 1.5 million observations and helped
              determine the age of the universe, discovered dark energy, and captured iconic images
              of deep space.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Primary Mirror</p>
                <p className="text-lg font-semibold text-white">2.4 meters</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Launch Date</p>
                <p className="text-lg font-semibold text-white">Apr 24, 1990</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Observations</p>
                <p className="text-lg font-semibold text-white">1.5M+</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Wavelength</p>
                <p className="text-lg font-semibold text-white">UV - Near IR</p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">Instruments</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded text-xs bg-violet-500/20 text-violet-400">ACS</span>
                <span className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-400">WFC3</span>
                <span className="px-2 py-1 rounded text-xs bg-pink-500/20 text-pink-400">STIS</span>
                <span className="px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400">COS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Observations */}
      <ObservationFeed
        telescope="hubble"
        limit={12}
        title="Hubble Observations"
        showFilter={true}
      />

      {/* Image Gallery */}
      {loadingImages ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Telescope className="h-5 w-5 text-purple-400" />
              Image Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <ImageGallery
          images={images}
          telescope="hubble"
          title="Hubble Image Gallery"
        />
      )}
    </div>
  );
}
