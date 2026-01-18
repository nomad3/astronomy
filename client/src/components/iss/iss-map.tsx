"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ISSPosition } from "@/lib/api";

interface ISSMapProps {
  position: ISSPosition | null;
}

export default function ISSMap({ position }: ISSMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!mapRef.current) {
      mapRef.current = L.map("iss-map", {
        center: [0, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
        }
      ).addTo(mapRef.current);

      const issIcon = L.divIcon({
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            animation: pulse 2s ease-in-out infinite;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        `,
        className: "iss-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      markerRef.current = L.marker([0, 0], { icon: issIcon }).addTo(
        mapRef.current
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (position && markerRef.current && mapRef.current) {
      const { latitude, longitude } = position;
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.panTo([latitude, longitude], { animate: true });
    }
  }, [position]);

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .iss-marker {
          animation: none !important;
        }
      `}</style>
      <div id="iss-map" className="h-[500px] w-full" />
    </>
  );
}
