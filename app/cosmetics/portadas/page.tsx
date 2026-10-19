import type { Metadata } from "next"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { CosmeticsHero } from "@/components/sections/cosmetics-hero"
import { HeroCopyPreview } from "@/components/sections/hero-copy-preview"

export const metadata: Metadata = {
  title: "Posiciones del texto de la portada — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para comparar dónde va el texto de la portada. Borrar al elegir una. */
export default function HeroCopyPage() {
  return (
    <MotionProvider>
      <main data-face="cosmetics" className="relative overflow-x-hidden pb-28">
        <Navbar face="cosmetics" separate announce />
        <HeroCopyPreview />
        <div className="lg:hidden">
          <CosmeticsHero />
        </div>
      </main>
    </MotionProvider>
  )
}
