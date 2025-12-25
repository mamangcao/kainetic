import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.strava.com',
      },
      {
        protocol: 'https',
        hostname: 'dgalywyr863hv.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'dgtzuqphqg23d.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'cf.shopee.ph',
      },
    ],
  },
};

export default nextConfig;
