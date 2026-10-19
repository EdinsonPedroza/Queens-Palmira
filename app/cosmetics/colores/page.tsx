import type { Metadata } from "next"
import { CartProvider } from "@/context/cart-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"
import { CatalogColorPreview } from "@/components/sections/catalog-color-preview"

export const metadata: Metadata = {
  title: "Colores del catálogo — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para comparar dónde van los colores del catálogo. Borrar al elegir una. */
export default function CatalogColorsPage() {
  return (
    <CartProvider>
      <MotionProvider>
        <main data-face="cosmetics" className="relative overflow-x-hidden pb-28">
          <Navbar face="cosmetics" />
          <section id="hero" className="px-6 pb-2 pt-28 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
            <h1 className="mt-2 text-3xl md:text-5xl">Colores del catálogo</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
              El mismo catálogo con la misma paleta, repartida de seis maneras. Cambia de idea con la barra de abajo.
            </p>
          </section>
          <CatalogColorPreview />
          <CartFloat />
          <CartSidebar />
        </main>
      </MotionProvider>
    </CartProvider>
  )
}
