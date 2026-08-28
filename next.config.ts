import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only permits quality 75 by default; allow 90 for the hero.
    qualities: [75, 90],
    // Product images uploaded by the admin are served from Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
