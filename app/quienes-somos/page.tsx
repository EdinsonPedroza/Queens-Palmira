import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { About } from "@/components/sections/about"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const Footer = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Quiénes somos — Queens Cosmetics & Spa",
  description:
    "Conoce a Queens: una casa de belleza en Palmira con tienda de cosméticos y spa, donde te atendemos como en familia, con productos originales y asesoría de verdad.",
  openGraph: {
    title: "Quiénes somos — Queens Cosmetics & Spa",
    description:
      "Una casa de belleza en Palmira donde te sientes como en familia. Tienda de cosméticos en Unicentro y spa en la Cra 25.",
  },
}

/* The warm page: who we are, in plain words. No intro screen, no cart. */
export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden">
      <ScrollProgress />
      <Navbar face="about" />
      <About />
      <Footer face="about" />
      <WhatsAppFloat />
    </main>
  )
}
