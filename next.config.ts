import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ⚠️ This disables ESLint errors from blocking `next build`
    ignoreDuringBuilds: true,
  },
  /* other config options here */
};

export default nextConfig;
