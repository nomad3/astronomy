"use client";

import { Badge } from "@/components/ui/badge";

interface InstrumentBadgeProps {
  instrument: string;
  telescope?: "jwst" | "hubble";
}

const instrumentInfo: Record<string, { color: string; description: string }> = {
  // JWST Instruments
  NIRCam: { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", description: "Near Infrared Camera" },
  NIRSpec: { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", description: "Near Infrared Spectrograph" },
  MIRI: { color: "bg-red-500/20 text-red-400 border-red-500/30", description: "Mid-Infrared Instrument" },
  FGS: { color: "bg-green-500/20 text-green-400 border-green-500/30", description: "Fine Guidance Sensor" },
  NIRISS: { color: "bg-purple-500/20 text-purple-400 border-purple-500/30", description: "Near Infrared Imager" },
  // Hubble Instruments
  ACS: { color: "bg-violet-500/20 text-violet-400 border-violet-500/30", description: "Advanced Camera for Surveys" },
  WFC3: { color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", description: "Wide Field Camera 3" },
  STIS: { color: "bg-pink-500/20 text-pink-400 border-pink-500/30", description: "Space Telescope Imaging Spectrograph" },
  COS: { color: "bg-orange-500/20 text-orange-400 border-orange-500/30", description: "Cosmic Origins Spectrograph" },
  // Default
  Unknown: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", description: "Unknown Instrument" },
};

export function InstrumentBadge({ instrument, telescope }: InstrumentBadgeProps) {
  const info = instrumentInfo[instrument] || instrumentInfo.Unknown;

  return (
    <Badge
      className={`${info.color} border text-xs`}
      title={info.description}
    >
      {instrument}
    </Badge>
  );
}
