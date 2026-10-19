import type { Metadata } from "next"
import { MotionProvider } from "@/components/motion-provider"
import { AnimationFixesPreview } from "@/components/sections/animation-fixes-preview"

export const metadata: Metadata = {
  title: "Animaciones — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para ver antes/después de los ajustes de animación. Borrar al decidir. */
export default function AnimationFixesPage() {
  return (
    <MotionProvider>
      <main data-face="cosmetics" className="relative min-h-screen overflow-x-hidden">
        <header className="px-6 pb-2 pt-10 text-center md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
          <h1 className="mt-2 text-3xl md:text-5xl">Ajustes de animación</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
            A la izquierda cómo está hoy, a la derecha cómo quedaría. Nada de esto está aplicado en el sitio todavía.
          </p>
        </header>
        <AnimationFixesPreview />
      </main>
    </MotionProvider>
  )
}
