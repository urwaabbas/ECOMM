import type { NextConfig } from "next";

const nextConfig: NextConfig = { 
  allowedDevOrigins: ['172.30.111.172'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // Covers Unsplash+ images
      }
    ],
  },
};

export default nextConfig;