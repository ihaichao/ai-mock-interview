import type { NextConfig } from "next";
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack', openIn: 'reuse'}));
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/mockInterview/:path*',
        destination: 'https://www.2100wbtc.com:8080/mockInterview/:path*'
      },
      {
        source: '/text-to-voice',
        destination: 'https://www.2100wbtc.com:8080/text-to-voice'
      },
      {
        source: '/file/voice-to-text',
        destination: 'https://www.2100wbtc.com:8080/file/voice-to-text'
      }
    ]
  }
};

export default nextConfig;
