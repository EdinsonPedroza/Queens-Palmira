import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { DM_Sans, Inter } from "next/font/google"
import { CartProvider } from "@/context/cart-context"
import { MotionProvider } from "@/components/motion-provider"
import "./globals.css"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://queenscosmetics.co"
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
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
  themeColor: "#FFB6C1",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Queens Cosmetics",
  description:
    "Tienda de cosméticos premium en Unicentro Palmira: labiales, skincare, maquillaje, esmaltes y línea capilar. Productos 100% originales.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: "+573148677230",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Local 128, Unicentro Palmira",
    addressLocality: "Palmira",
    addressRegion: "Valle del Cauca",
    addressCountry: "CO",
  },
  areaServed: { "@type": "City", name: "Palmira" },
  sameAs: ["https://www.instagram.com/queenscosmeticss/"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CO"
      className={`${dmSans.variable} ${inter.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          <MotionProvider>{children}</MotionProvider>
        </CartProvider>
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
