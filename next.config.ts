import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/mockInterview/:path*',
        destination: 'https://www.2100wbtc.com:8080/mockInterview/:path*'
      },
      {
        source: '/text-to-voice',
        destination: 'https://www.2100wbtc.com:8080/text-to-voice'
      }
    ]
  }
};

export default nextConfig;
