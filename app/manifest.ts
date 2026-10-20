import type { MetadataRoute } from "next"

// The site is exported as static files (Cloudflare): this file is turned into /manifest.webmanifest at build time.
export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Queens Cosmetics",
    short_name: "Queens",
    description: "Cosmética premium en Unicentro Palmira. Maquillaje, skincare, esmaltes y línea capilar.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFEE",
    theme_color: "#FFFFEE",
    lang: "es-CO",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
