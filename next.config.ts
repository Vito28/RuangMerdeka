import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/2026",
        destination: "/2026/17-08",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
