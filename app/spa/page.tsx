import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { SpaHero } from "@/components/sections/spa-hero"
import { Marquee } from "@/components/sections/marquee"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const SpaRituals      = dynamic(() => import("@/components/sections/spa-rituals").then((m) => m.SpaRituals))
const SpaGallery      = dynamic(() => import("@/components/sections/spa-gallery").then((m) => m.SpaGallery))
const SpaTestimonials = dynamic(() => import("@/components/sections/spa-testimonials").then((m) => m.SpaTestimonials))
const SpaFAQ          = dynamic(() => import("@/components/sections/spa-faq").then((m) => m.SpaFAQ))
const SpaCTA          = dynamic(() => import("@/components/sections/spa-cta").then((m) => m.SpaCTA))
const Location        = dynamic(() => import("@/components/sections/location").then((m) => m.Location))
const Footer          = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Queens Spa — Faciales y Masajes en Palmira",
  description:
    "Spa en Palmira: limpiezas faciales, masajes relajantes, cejas, pestañas y manicure spa. Con cita previa en la Cra 25 #11-23. Reserva por WhatsApp.",
  openGraph: {
    title: "Queens Spa — Faciales y Masajes en Palmira",
    description:
      "La otra cara de la reina: faciales, masajes y rituales para desconectarte. Cra 25 #11-23, Palmira.",
  },
}

/* Lado B: the spa, bookings only — no cart here. */
export default function SpaPage() {
  return (
    <main className="relative overflow-x-hidden bg-noir">
      <ScrollProgress />
      <Navbar face="spa" />
      <SpaHero />
      <Marquee face="spa" />
      <SpaRituals />
      <SpaGallery />
      <SpaTestimonials />
      <SpaFAQ />
      <SpaCTA />
      <Location face="spa" />
      <Footer face="spa" />
      <WhatsAppFloat />
    </main>
  )
}
