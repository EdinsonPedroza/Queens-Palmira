import type { Metadata } from "next"
import { SpaCtaIdeas } from "@/components/sections/spa-cta-ideas"

export const metadata: Metadata = {
  title: "Ideas de cierre — Queens Spa",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada): cinco ideas para el bloque de cierre del spa. Borrar al elegir (junto con `components/sections/spa-cta-ideas.tsx`). */
export default function IdeasCierrePage() {
  return (
    <main data-palette="spa" data-page="spa" className="min-h-screen bg-[var(--crema)]">
      <SpaCtaIdeas />
    </main>
  )
}
