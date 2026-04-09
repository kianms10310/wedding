import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',          // ← 이거 추가
        hostname: 'res.cloudinary.com',
      }
    ]
  }
};

export default nextConfig;