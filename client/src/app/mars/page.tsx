"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type MarsPhoto, type MarsWeather } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import {
  Globe,
  Camera,
  Thermometer,
  Wind,
  Gauge,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const rovers = [
  { id: "curiosity", name: "Curiosity", status: "Active", landingDate: "Aug 6, 2012" },
  { id: "perseverance", name: "Perseverance", status: "Active", landingDate: "Feb 18, 2021" },
  { id: "opportunity", name: "Opportunity", status: "Complete", landingDate: "Jan 25, 2004" },
  { id: "spirit", name: "Spirit", status: "Complete", landingDate: "Jan 4, 2004" },
];

export default function MarsPage() {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [weather, setWeather] = useState<MarsWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [sol, setSol] = useState(1000);
  const [selectedPhoto, setSelectedPhoto] = useState<MarsPhoto | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getMarsPhotos(selectedRover, sol, 12),
      api.getMarsWeather(),
    ])
      .then(([photosData, weatherData]) => {
        setPhotos(photosData);
        setWeather(weatherData);
        setSelectedPhoto(null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRover, sol]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Globe className="h-7 w-7 text-red-400" />
          Mars Explorer
        </h1>
        <p className="text-gray-400 mt-1">
          Rover imagery and weather data from the Red Planet
        </p>
      </div>

      {/* Rover Selector */}
      <div className="flex flex-wrap gap-3">
        {rovers.map((rover) => (
          <button
            key={rover.id}
            onClick={() => setSelectedRover(rover.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedRover === rover.id
                ? "bg-red-500/20 border border-red-500/50 text-red-400"
                : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            <span className="font-medium">{rover.name}</span>
            <Badge
              variant={rover.status === "Active" ? "success" : "default"}
              className="ml-2 text-xs"
            >
              {rover.status}
            </Badge>
          </button>
        ))}
      </div>

      {/* Sol Selector */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-400">Martian Sol</p>
              <p className="text-xl font-mono text-white">{sol}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setSol(Math.max(1, sol - 100))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <input
              type="range"
              min="1"
              max="4000"
              value={sol}
              onChange={(e) => setSol(Number(e.target.value))}
              className="w-48 accent-red-500"
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setSol(Math.min(4000, sol + 100))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Photo Gallery */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">Rover Photos</h2>
            <Badge variant="default" className="ml-2">{photos.length} images</Badge>
          </div>

          {selectedPhoto && (
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={selectedPhoto.img_src}
                  alt={`Mars photo from ${selectedPhoto.rover_name}`}
                  fill
                  className="object-contain bg-black"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{selectedPhoto.camera_full_name}</p>
                    <p className="text-sm text-gray-400">
                      {selectedPhoto.rover_name} • Sol {selectedPhoto.sol} • {formatDate(selectedPhoto.earth_date)}
                    </p>
                  </div>
                  <Badge variant="info">{selectedPhoto.camera_name}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="grid gap-3 grid-cols-3 md:grid-cols-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No photos available for this sol</p>
                <p className="text-sm text-gray-500 mt-1">Try a different sol or rover</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 grid-cols-3 md:grid-cols-4">
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedPhoto?.id === photo.id
                      ? "ring-2 ring-red-500 scale-95"
                      : "hover:scale-105"
                  }`}
                >
                  <Image
                    src={photo.img_src}
                    alt={`Mars ${photo.camera_name}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1 left-1">
                    <Badge variant="default" className="text-xs">
                      {photo.camera_name}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weather Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Mars Weather</h2>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">InSight Lander Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weather.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400">Weather data unavailable</p>
                  <p className="text-xs text-gray-500 mt-1">InSight mission has concluded</p>
                </div>
              ) : (
                weather.slice(0, 5).map((day) => (
                  <div key={day.sol} className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Sol {day.sol}</span>
                      <Badge variant="default" className="text-xs">{day.season}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-3 w-3 text-blue-400" />
                        <span className="text-gray-400">
                          {day.min_temp}° / {day.max_temp}°C
                        </span>
                      </div>
                      {day.wind_speed && (
                        <div className="flex items-center gap-2">
                          <Wind className="h-3 w-3 text-teal-400" />
                          <span className="text-gray-400">{day.wind_speed} m/s</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 col-span-2">
                        <Gauge className="h-3 w-3 text-purple-400" />
                        <span className="text-gray-400">{day.pressure} Pa</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Rover Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Rover Info</CardTitle>
            </CardHeader>
            <CardContent>
              {rovers.filter(r => r.id === selectedRover).map((rover) => (
                <div key={rover.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{rover.name}</span>
                    <Badge variant={rover.status === "Active" ? "success" : "default"}>
                      {rover.status}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-500">Landing Date</p>
                    <p className="text-white">{rover.landingDate}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
