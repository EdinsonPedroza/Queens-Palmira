import type { Metadata } from "next"
import { IntroVersionsPreview } from "@/components/sections/intro-versions-preview"

export const metadata: Metadata = {
  title: "Entrada del portal — Queens",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para elegir la entrada del portal. Borrar al decidir. */
export default function IntroVersionsPage() {
  return (
    <main data-face="cosmetics" className="relative min-h-screen overflow-x-clip pb-20">
      <header className="px-6 pb-2 pt-10 text-center md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
        <h1 className="mt-2 text-3xl md:text-5xl">Entrada del portal</h1>
      </header>
      <IntroVersionsPreview />
    </main>
  )
}
