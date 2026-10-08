import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { IntroScreen } from "@/components/intro-screen"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Hero } from "@/components/sections/hero"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const Locations = dynamic(() => import("@/components/sections/locations").then((m) => m.Locations))
const Footer    = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Queens — Cosmetics & Spa en Palmira",
  description:
    "Dos casas en Palmira: Queens Cosmetics, cosmética premium en el Local 128 de Unicentro, y Queens Spa, faciales y masajes con cita previa en la Cra 25 #11-23.",
  openGraph: {
    title: "Queens — Cosmetics & Spa en Palmira",
    description:
      "Dos casas, una reina: cosmética premium en Unicentro y un spa para bajar el ritmo en la Cra 25.",
  },
}

/* The portal: two doors, then where each one is. */
export default function Home() {
  return (
    <main className="relative overflow-x-hidden shimmer-overlay">
      <IntroScreen />
      <ScrollProgress />
      <Navbar face="portal" />
      <Hero />
      <Locations />
      <Footer face="portal" />
      <WhatsAppFloat />
    </main>
  )
}
