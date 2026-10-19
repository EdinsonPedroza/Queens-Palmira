import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { CartProvider } from "@/context/cart-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { CosmeticsHero } from "@/components/sections/cosmetics-hero"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"

const Catalog        = dynamic(() => import("@/components/sections/catalog").then((m) => m.Catalog))
const Gallery        = dynamic(() => import("@/components/sections/gallery").then((m) => m.Gallery))
const Testimonials   = dynamic(() => import("@/components/sections/testimonials").then((m) => m.Testimonials))
const FAQ            = dynamic(() => import("@/components/sections/faq").then((m) => m.FAQ))
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

/*
 * Lado A: the store, with the cart. The cart's state (and with it the product
 * catalog) is mounted here and nowhere else. The catalog has no layout animations
 * any more, so it runs on the light motion provider.
 */
export default function CosmeticsPage() {
  return (
    <CartProvider>
      <MotionProvider>
        <main data-face="cosmetics" data-palette="queens" className="relative flow-root overflow-x-clip">
          <ScrollProgress />
          <Navbar face="cosmetics" separate announce />
          <CosmeticsHero />
          <Catalog />
          <Gallery />
          <Testimonials />
          <Location face="cosmetics" />
          <FAQ />
          <Footer face="cosmetics" />
          <WhatsAppFloat />
          <CartFloat />
          <CartSidebar />
        </main>
      </MotionProvider>
    </CartProvider>
  )
}
