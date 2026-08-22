import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only permits quality 75 by default; allow 90 for the hero.
    qualities: [75, 90],
  },
};

export default nextConfig;
