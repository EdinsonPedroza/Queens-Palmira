import type { Metadata, Viewport } from "next"
import Script from "next/script"
import localFont from "next/font/local"
import "./globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://queenscosmetics.co"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

// Brand typeface. Bold for titles, Regular for everything else.
//
// ⚠ The files in ./fonts are the DEMO build of The Seasons. Only A–Z a–z , . : ; ? and the
// digits 0–3 5–9 are real glyphs; everything else (á é í ó ú ñ ¿ ¡ ! $ + - ( ) & @ # % / * 4
// — “ ” ' ") is a "DEMO" watermark ornament. `unicode-range` keeps the browser from ever
// drawing those, so it falls back glyph by glyph to the font below. Digits are left out on
// purpose so a number never mixes two fonts (the demo has no "4").
// Once the licensed full font replaces these files, delete `declarations` and the two
// `glyphFallback*` fonts.
//
// The files are WOFF2 wrappers of the client's TTF/OTF (same outlines and metrics, less
// than half the bytes). The originals are in ACTUALIZACION/NEWW/tipografía queens/.
//
// Upright and italic cuts are separate families on purpose. next/font preloads every file
// of a font or none, and the italics are only used in a handful of places far down the
// page, so they must not be preloaded on every route. `globals.css` sends anything italic
// (`em`, `i`, `.italic`) to the italic families.
//
// next/font reads these options at build time, so every value has to be written out as a
// literal in each call: the repeated `declarations` cannot be hoisted into a constant.
const theSeasons = localFont({
  src: [
    { path: "./fonts/TheSeasons-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/TheSeasons-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-seasons",
  display: "swap",
  // Next's auto-generated Arial-based fallback would catch every glyph excluded below
  // before glyphFallback gets a chance.
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+0020, U+002C, U+002E, U+003A-003B, U+003F, U+0041-005A, U+0061-007A" },
  ],
})

const theSeasonsItalic = localFont({
  src: [
    { path: "./fonts/TheSeasons-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/TheSeasons-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-seasons-italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: "unicode-range", value: "U+0020, U+002C, U+002E, U+003A-003B, U+003F, U+0041-005A, U+0061-007A" },
  ],
})

// Close cousin (high-contrast, small x-height) that covers every glyph the demo lacks. Self-hosted (Latin-1 subset)
// so it can be scaled: Cormorant is ~12% shorter in capitals and ~30% shorter in lowercase than The Seasons, which made
// every accented letter (á é í ó ú ñ) look smaller than its neighbours. 120% evens out the lowercase accents without
// making the rare capital accent (Í) too tall.
const glyphFallback = localFont({
  src: [
    { path: "./fonts/Cormorant-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Cormorant-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-glyph-fallback",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "size-adjust", value: "120%" }],
})

const glyphFallbackItalic = localFont({
  src: [
    { path: "./fonts/Cormorant-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Cormorant-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-glyph-fallback-italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "size-adjust", value: "120%" }],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Queens Cosmetics — Cosmética Premium en Palmira",
  description:
    "Tienda de cosméticos premium en Unicentro Palmira. Labiales, skincare, maquillaje, esmaltes y línea capilar. Productos 100% originales. Pide por WhatsApp.",
  keywords: [
    "cosméticos palmira",
    "maquillaje palmira",
    "queens cosmetics",
    "skincare palmira",
    "labiales",
    "esmaltes palmira",
    "unicentro palmira",
    "belleza colombia",
    "línea capilar",
  ],
  authors: [{ name: "Queens Cosmetics" }],
  alternates: {
    // './' resolves per-route against metadataBase → self-referencing canonical on every page
    canonical: "./",
  },
  openGraph: {
    title: "Queens Cosmetics — Cosmética Premium en Palmira",
    description:
      "La belleza que mereces. Maquillaje, skincare, esmaltes y línea capilar premium en Unicentro Palmira.",
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Queens Cosmetics",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Queens Cosmetics — Cosmética Premium en Unicentro Palmira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Queens Cosmetics",
    description: "Cosmética premium en Unicentro Palmira",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  // Set NEXT_PUBLIC_GSC_VERIFICATION in Vercel to verify Search Console via meta tag
  // (or verify the domain via DNS, which is preferred)
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
}

export const viewport: Viewport = {
  themeColor: "#FFFFEE",
  width: "device-width",
  initialScale: 1,
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const SHARED = {
  telephone: "+573148677230",
  priceRange: "$$",
  areaServed: { "@type": "City", name: "Palmira" },
  sameAs: ["https://www.instagram.com/queenscosmeticss/"],
}

// Two venues, two entities — otherwise Google reads the spa's services as
// happening at the Unicentro store.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/cosmetics#store`,
    name: "Queens Cosmetics",
    description:
      "Tienda de cosméticos premium en Unicentro Palmira: labiales, skincare, maquillaje, esmaltes y línea capilar. Productos 100% originales.",
    url: `${SITE_URL}/cosmetics`,
    image: `${SITE_URL}/og-image.jpg`,
    ...SHARED,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Local 1-28, Unicentro Palmira",
      addressLocality: "Palmira",
      addressRegion: "Valle del Cauca",
      addressCountry: "CO",
    },
    geo: { "@type": "GeoCoordinates", latitude: 3.5400896, longitude: -76.310776 },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ALL_DAYS, opens: "10:00", closes: "20:00" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    "@id": `${SITE_URL}/spa#spa`,
    name: "Queens Spa",
    description:
      "Spa de uñas en Palmira: manicure, pedicure spa, esmaltado semipermanente, uñas en gel y acrílico y nail art. Con cita previa.",
    url: `${SITE_URL}/spa`,
    image: `${SITE_URL}/og-image.jpg`,
    ...SHARED,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carrera 25 #11-23",
      addressLocality: "Palmira",
      addressRegion: "Valle del Cauca",
      addressCountry: "CO",
    },
    geo: { "@type": "GeoCoordinates", latitude: 3.509948, longitude: -76.2984773 },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ALL_DAYS, opens: "10:00", closes: "20:00" },
    ],
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CO"
      // globals.css sets `scroll-behavior: smooth` on <html>. Without this attribute Next scrolls to the top of a new page THROUGH that smooth
      // scroll (e.g. the gallery card that links to /quienes-somos): it would glide up from wherever the visitor was. With it, route changes jump
      // and the in-page anchors (#catalogo, #ubicacion…) stay smooth.
      data-scroll-behavior="smooth"
      className={`${theSeasons.variable} ${theSeasonsItalic.variable} ${glyphFallback.variable} ${glyphFallbackItalic.variable}`}
    >
      <head>
        {/* No preconnect to Unsplash: every image goes through /_next/image, so the browser never talks to it. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {/* Providers live in the pages that need them (motion on the animated ones, the cart on
            /cosmetics), so the legal pages and the portal do not download what they never use. */}
        {children}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
