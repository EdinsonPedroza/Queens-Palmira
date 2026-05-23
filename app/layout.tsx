import type { Metadata, Viewport } from "next"
import { DM_Sans, Inter } from "next/font/google"
import { CartProvider } from "@/context/cart-context"
import { MotionProvider } from "@/components/motion-provider"
import "./globals.css"

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
  openGraph: {
    title: "Queens Cosmetics — Cosmética Premium en Palmira",
    description:
      "La belleza que mereces. Maquillaje, skincare, esmaltes y línea capilar premium en Unicentro Palmira.",
    type: "website",
    locale: "es_CO",
    siteName: "Queens Cosmetics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Queens Cosmetics",
    description: "Cosmética premium en Unicentro Palmira",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: "#FFB6C1",
  width: "device-width",
  initialScale: 1,
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
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          <MotionProvider>{children}</MotionProvider>
        </CartProvider>
      </body>
    </html>
  )
}
