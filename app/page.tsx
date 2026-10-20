import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { CartProvider } from "@/context/cart-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { HomeHero } from "@/components/sections/home-hero"
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
 * El INICIO del sitio (queenscosmeticscol.com): la tienda. Abre con la portada de las dos puertas (catálogo y spa) y sigue con el catálogo, conócenos,
 * reseñas, ubicación y preguntas. El spa vive en `/spa`, dentro del mismo dominio. El estado del carrito (y con él el catálogo) se monta aquí y en ningún
 * otro sitio; el catálogo no tiene animaciones de layout, así que corre con el proveedor de animación ligero.
 */
export default function HomePage() {
  return (
    <CartProvider>
      <MotionProvider>
        <main data-face="cosmetics" data-palette="queens" className="relative flow-root overflow-x-clip">
          <ScrollProgress />
          <Navbar face="cosmetics" separate announce />
          <HomeHero />
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
