import type { NextConfig } from "next";

// Content-Security-Policy. Kept permissive enough for Razorpay Checkout (loaded
// from checkout.razorpay.com, which opens *.razorpay.com iframes) and Cloudinary
// reel videos, while still restricting which external origins may load at all.
// 'unsafe-inline'/'unsafe-eval' are required by Next's runtime and the Razorpay
// SDK; the value here is still meaningful for origin restriction + clickjacking.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.razorpay.com",
  "font-src 'self' data:",
  "media-src 'self' https://res.cloudinary.com",
  "connect-src 'self' https://*.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://*.razorpay.com https://checkout.razorpay.com",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Next 16 only permits quality 75 by default; allow 90 for the hero.
    qualities: [75, 90],
    // Legacy product images / reels may still be served from Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
