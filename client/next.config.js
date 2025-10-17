/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://server:8000/api/:path*',
      },
    ]
  },
  images: {
    domains: [
      'mars.nasa.gov',
      'epic.gsfc.nasa.gov',
      'apod.nasa.gov',
      'api.nasa.gov',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: '**.thespacedevs.com',
      },
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
    ],
  },
}

module.exports = nextConfig
