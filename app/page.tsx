import dynamic from "next/dynamic"
import { IntroScreen } from "@/components/intro-screen"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Hero } from "@/components/sections/hero"
import { Marquee } from "@/components/sections/marquee"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"

const WhyQueens      = dynamic(() => import("@/components/sections/why-queens").then((m) => m.WhyQueens))
const Catalog        = dynamic(() => import("@/components/sections/catalog").then((m) => m.Catalog))
const DigitalCatalog = dynamic(() => import("@/components/sections/digital-catalog").then((m) => m.DigitalCatalog))
const Gallery      = dynamic(() => import("@/components/sections/gallery").then((m) => m.Gallery))
const Testimonials = dynamic(() => import("@/components/sections/testimonials").then((m) => m.Testimonials))
const FAQ          = dynamic(() => import("@/components/sections/faq").then((m) => m.FAQ))
const CTA          = dynamic(() => import("@/components/sections/cta").then((m) => m.CTA))
const Location     = dynamic(() => import("@/components/sections/location").then((m) => m.Location))
const Footer       = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export default function Home() {
  return (
    <main className="relative overflow-x-hidden shimmer-overlay">
      <IntroScreen />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Catalog />
      <WhyQueens />
      <DigitalCatalog />
      <Gallery />
      <Testimonials />
      <FAQ />
      <CTA />
      <Location />
      <Footer />
      <WhatsAppFloat />
      <CartFloat />
      <CartSidebar />
    </main>
  )
}
