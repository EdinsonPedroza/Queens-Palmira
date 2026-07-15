import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Queens Cosmetics",
    short_name: "Queens",
    description: "Cosmética premium en Unicentro Palmira. Maquillaje, skincare, esmaltes y línea capilar.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFB6C1",
    theme_color: "#FFB6C1",
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
