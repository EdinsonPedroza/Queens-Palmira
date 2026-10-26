import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { ScrollProgress } from "@/components/scroll-progress"
import { SpaHero } from "@/components/sections/spa-hero"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { openGraph } from "@/lib/seo"

const SpaServices     = dynamic(() => import("@/components/sections/spa-services").then((m) => m.SpaServices))
const SpaBooking      = dynamic(() => import("@/components/sections/spa-booking").then((m) => m.SpaBooking))
const SpaTestimonials = dynamic(() => import("@/components/sections/spa-testimonials").then((m) => m.SpaTestimonials))
const SpaFAQ          = dynamic(() => import("@/components/sections/spa-faq").then((m) => m.SpaFAQ))
const SpaCTA          = dynamic(() => import("@/components/sections/spa-cta").then((m) => m.SpaCTA))
const Location        = dynamic(() => import("@/components/sections/location").then((m) => m.Location))
const Footer          = dynamic(() => import("@/components/sections/footer").then((m) => m.Footer))

export const metadata: Metadata = {
  title: "Queens Spa — Uñas, Manicure y Pedicure en Palmira",
  description:
    "Spa de uñas en Palmira: manicure, pedicure spa, esmaltado semipermanente, uñas en gel y acrílico y nail art. Con cita previa en la Cra 25 #11-23. Reserva por WhatsApp.",
  openGraph: openGraph(
    "/spa",
    "Queens Spa — Uñas, Manicure y Pedicure en Palmira",
    "La otra cara de la reina: un spa de uñas para consentir tus manos y pies. Cra 25 #11-23, Palmira.",
  ),
}

/* Lado B: the spa, bookings only — no cart here. Built in the store's language (strip + solid header, hero with a photo and the copy on the crema, flat square controls, fine lines)
 * and told apart by its gold. */
export default function SpaPage() {
  return (
    <MotionProvider>
      {/* No announcement strip on the spa (the client took it out), so what sits above the hero is only the header: `--header-h` (where the hero starts, and the height the hero's
          calculations subtract) is the header's own height here. It is declared on <main> because the root's `--header-h` already has the strip's height added in. */}
      <main data-palette="spa" data-page="spa" className="relative flow-root overflow-x-clip" style={{ ["--header-h" as string]: "var(--nav-h)" }}>
        <ScrollProgress />
        <Navbar face="spa" separate />
        <SpaHero />
        <SpaServices />
        <SpaBooking />
        <SpaTestimonials />
        <SpaFAQ />
        <SpaCTA />
        <Location face="spa" />
        <Footer face="spa" tone="crema" />
        <WhatsAppFloat />
      </main>
    </MotionProvider>
  )
}
