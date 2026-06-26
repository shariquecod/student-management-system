/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'standalone', // Enable standalone output for Docker deployment
  // Ensure all static assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
}

export default nextConfig
