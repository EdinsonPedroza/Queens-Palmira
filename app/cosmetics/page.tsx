import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { CosmeticsHero } from "@/components/sections/cosmetics-hero"
import { Marquee } from "@/components/sections/marquee"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"

const Catalog        = dynamic(() => import("@/components/sections/catalog").then((m) => m.Catalog))
const WhyQueens      = dynamic(() => import("@/components/sections/why-queens").then((m) => m.WhyQueens))
const DigitalCatalog = dynamic(() => import("@/components/sections/digital-catalog").then((m) => m.DigitalCatalog))
const Gallery        = dynamic(() => import("@/components/sections/gallery").then((m) => m.Gallery))
const Testimonials   = dynamic(() => import("@/components/sections/testimonials").then((m) => m.Testimonials))
const FAQ            = dynamic(() => import("@/components/sections/faq").then((m) => m.FAQ))
const CTA            = dynamic(() => import("@/components/sections/cta").then((m) => m.CTA))
const Location       = dynamic(() => import("@/components/sections/location").then((m) => m.Location))
const Footer         = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Queens Cosmetics — Cosmética Premium en Palmira",
  description:
    "Tienda de cosméticos premium en Unicentro Palmira. Labiales, skincare, maquillaje, esmaltes y línea capilar. Productos 100% originales. Pide por WhatsApp.",
  openGraph: {
    title: "Queens Cosmetics — Cosmética Premium en Palmira",
    description:
      "La belleza que mereces. Maquillaje, skincare, esmaltes y línea capilar premium en Unicentro Palmira.",
  },
}

/* Lado A: the store, with the cart. */
export default function CosmeticsPage() {
  return (
    <main className="relative overflow-x-hidden shimmer-overlay">
      <ScrollProgress />
      <Navbar face="cosmetics" />
      <CosmeticsHero />
      <Marquee />
      <Catalog />
      <WhyQueens />
      <DigitalCatalog />
      <Gallery />
      <Testimonials />
      <FAQ />
      <CTA />
      <Location face="cosmetics" />
      <Footer face="cosmetics" />
      <WhatsAppFloat />
      <CartFloat />
      <CartSidebar />
    </main>
  )
}
