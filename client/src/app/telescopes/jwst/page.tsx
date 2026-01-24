"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type TelescopeImage } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PositionTracker,
  ObservationFeed,
  ImageGallery,
} from "@/components/telescopes";
import { ArrowLeft, Telescope, Info } from "lucide-react";

export default function JWSTPage() {
  const [images, setImages] = useState<TelescopeImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    api.getJWSTImages(16)
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
          <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-3">
            <span className="text-3xl">🔭</span>
            James Webb Space Telescope
          </h1>
          <p className="text-gray-400 mt-1">
            Live tracking, observations, and imagery from humanity&apos;s most powerful space telescope
          </p>
        </div>
      </div>

      {/* Position Tracker + Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PositionTracker autoRefresh={true} />

        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-400" />
              About JWST
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              The James Webb Space Telescope is the largest and most powerful space telescope ever built.
              Launched on December 25, 2021, it observes in infrared light, allowing it to see through
              cosmic dust and observe the most distant galaxies in the universe.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Primary Mirror</p>
                <p className="text-lg font-semibold text-white">6.5 meters</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-lg font-semibold text-white">L2 Point</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Launch Date</p>
                <p className="text-lg font-semibold text-white">Dec 25, 2021</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-gray-500">Wavelength</p>
                <p className="text-lg font-semibold text-white">0.6 - 28 μm</p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium text-white mb-2">Instruments</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400">NIRCam</span>
                <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">NIRSpec</span>
                <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">MIRI</span>
                <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">NIRISS</span>
                <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">FGS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Observations */}
      <ObservationFeed
        telescope="jwst"
        limit={12}
        title="JWST Observations"
        showFilter={true}
      />

      {/* Image Gallery */}
      {loadingImages ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Telescope className="h-5 w-5 text-amber-400" />
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
          telescope="jwst"
          title="JWST Image Gallery"
        />
      )}
    </div>
  );
}
