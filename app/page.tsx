import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { IntroScreen } from "@/components/intro-screen"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { Hero } from "@/components/sections/hero"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const Locations = dynamic(() => import("@/components/sections/locations").then((m) => m.Locations))
const Footer    = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Queens — Cosmetics & Spa en Palmira",
  description:
    "Dos casas en Palmira: Queens Cosmetics, cosmética premium en el Local 1-28 de Unicentro, y Queens Spa, spa de uñas con cita previa en la Cra 25 #11-23.",
  openGraph: {
    title: "Queens — Cosmetics & Spa en Palmira",
    description:
      "Dos casas, una reina: cosmética premium en Unicentro y un spa de uñas en la Cra 25.",
  },
}

/* The portal: two doors, then where each one is. */
export default function Home() {
  return (
    <MotionProvider>
      <main data-palette="spa" className="relative overflow-x-hidden">
        <IntroScreen />
        <ScrollProgress />
        <Navbar face="portal" />
        <Hero />
        <Locations />
        <Footer face="portal" tone="crema" />
        <WhatsAppFloat />
      </main>
    </MotionProvider>
  )
}
