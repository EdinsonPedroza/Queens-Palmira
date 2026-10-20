/** @type {import('next').NextConfig} */
import path from "path"

/*
 * Static export: `npm run build` writes the whole site to `out/`, which is what Cloudflare serves (no server). Consequences:
 *  - `images.unoptimized`: there is no image optimizer without a server, so the images go out as the files in `public/` (they are already WebP, hand-sized).
 *  - The security headers (CSP, HSTS...) no longer live here: a static host reads them from `public/_headers` (copied to `out/_headers`).
 *  - Redirects live in `public/_redirects` for the same reason.
 */
const nextConfig = {
  output: "export",
  poweredByHeader: false,
  typescript: { ignoreBuildErrors: false },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
}

export default nextConfig
