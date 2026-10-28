import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { About } from "@/components/sections/about"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { openGraph } from "@/lib/seo"

const Footer = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Quiénes somos — Queens Cosmetics & Spa",
  description:
    "Conoce a Queens: una casa de belleza en Palmira con tienda de cosméticos y spa, donde te atendemos como en familia, con productos originales y asesoría de verdad.",
  openGraph: openGraph(
    "/quienes-somos",
    "Quiénes somos — Queens Cosmetics & Spa",
    "Una casa de belleza en Palmira donde te sientes como en familia. Tienda de cosméticos en Unicentro y spa en Alameda.",
  ),
}

/* The warm page: who we are, in plain words. No intro screen, no cart. Built in the store's language (strip + solid header, flat square pieces, fine lines). */
export default function AboutPage() {
  return (
    <MotionProvider>
      {/* flow-root: the hero's margin-top (the strip + header) must stay inside <main>, or the strip, which hangs from the top of <main>, would slide down with it */}
      <main data-face="cosmetics" className="relative flow-root overflow-x-clip">
        <ScrollProgress />
        <Navbar face="about" separate announce />
        <About />
        <Footer face="about" />
        <WhatsAppFloat />
      </main>
    </MotionProvider>
  )
}
