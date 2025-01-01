import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'https://www.2100wbtc.com:8080/:path*'
      }
    ]
  }
};

export default nextConfig;
