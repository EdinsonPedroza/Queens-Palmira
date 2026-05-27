/** @type {import('next').NextConfig} */
import path from "path"

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com;
  font-src 'self';
  connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com;
  frame-src https://www.google.com https://maps.google.com https://maps.googleapis.com https://www.openstreetmap.org;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\n/g, " ").trim();

const securityHeaders = [
  { key: "Content-Security-Policy",  value: ContentSecurityPolicy },
  { key: "X-XSS-Protection",         value: "1; mode=block" },
  { key: "X-Frame-Options",          value: "DENY" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
]

const nextConfig = {
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [100, 75],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256],
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
}

export default nextConfig
