import type { Metadata } from "next"

/*
 * The Open Graph block of every page (the preview WhatsApp, Facebook and Instagram show when someone shares a link).
 *
 * Next.js merges page metadata with the layout's ONE LEVEL DEEP: a page that writes its own `openGraph: { title, description }` REPLACES the layout's
 * whole `openGraph`, so the image, the page address, the site name and the locale were lost on `/`, `/spa` and `/quienes-somos` (shared links went out
 * with no picture). Every page now builds its block here, so nothing can be dropped.
 */
const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Queens Cosmetics — Cosmética Premium en Unicentro Palmira",
}

export function openGraph(path: string, title: string, description: string): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    type: "website",
    locale: "es_CO",
    url: path,
    siteName: "Queens Cosmetics",
    images: [OG_IMAGE],
  }
}
