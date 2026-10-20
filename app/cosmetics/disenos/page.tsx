import type { Metadata } from "next"
import { CartProvider } from "@/context/cart-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"
import { CatalogLayoutPreview } from "@/components/sections/catalog-layout-preview"

export const metadata: Metadata = {
  title: "Diseños del catálogo — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para comparar diseños del catálogo. Borrar al elegir uno. */
export default function CatalogLayoutsPage() {
  return (
    <CartProvider>
      <MotionProvider>
        <main data-face="cosmetics" className="relative overflow-x-hidden pb-28">
          <Navbar face="cosmetics" separate announce />
          <section id="hero" className="px-6 pb-2 pt-10 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
            <h1 className="mt-2 text-3xl md:text-5xl">Diseños del catálogo</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
              Los mismos productos, el carrito y los tonos de verdad, organizados de cinco maneras. Cambia de diseño con la barra de abajo.
            </p>
          </section>
          <CatalogLayoutPreview />
          <CartFloat />
          <CartSidebar />
        </main>
      </MotionProvider>
    </CartProvider>
  )
}
