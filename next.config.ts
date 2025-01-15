import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/mockInterview/:path*',
        destination: 'https://www.2100wbtc.com:8080/mockInterview/:path*'
      }
    ]
  }
};

export default nextConfig;
