import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'gtxngthtpisigkys.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
