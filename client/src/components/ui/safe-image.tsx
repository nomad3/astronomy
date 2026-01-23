"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export function SafeImage({ fallbackText = "Image unavailable", alt, className, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-800/50 text-gray-500 ${className || ""}`}>
        <ImageOff className="h-8 w-8 mb-2 opacity-50" />
        <span className="text-xs text-center px-2">{fallbackText}</span>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={(e) => {
        console.warn(`[SafeImage] Failed to load: ${props.src}`);
        setHasError(true);
      }}
    />
  );
}
