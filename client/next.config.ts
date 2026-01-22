import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "**.thespacedevs.com",
      },
      {
        protocol: "https",
        hostname: "**.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "http",
        hostname: "mars.jpl.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "mars.jpl.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "images-assets.nasa.gov",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://server:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
