import type { Metadata } from "next"
import { CartProvider } from "@/context/cart-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"
import { CatalogMorePreview } from "@/components/sections/catalog-more-preview"

export const metadata: Metadata = {
  title: "Muchos productos — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para comparar qué hacer al final de la rejilla con muchos productos. Borrar al elegir. */
export default function CatalogMorePage() {
  return (
    <CartProvider>
      <MotionProvider>
        <main data-face="cosmetics" className="relative overflow-x-hidden pb-28">
          <Navbar face="cosmetics" separate announce />
          <section id="hero" className="px-6 pb-2 pt-10 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
            <h1 className="mt-2 text-3xl md:text-5xl">Cuando hay muchos productos</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
              Empieza en Línea Capilar (75 productos). Cambia de opción con la barra de abajo y baja hasta el final de la rejilla.
            </p>
          </section>
          <CatalogMorePreview />
          <CartFloat />
          <CartSidebar />
        </main>
      </MotionProvider>
    </CartProvider>
  )
}
