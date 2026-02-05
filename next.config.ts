import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/athar',
  assetPrefix: '/athar',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
