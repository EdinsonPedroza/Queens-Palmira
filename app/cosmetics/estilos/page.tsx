import type { Metadata } from "next"
import { CartProvider } from "@/context/cart-provider"
import { MotionProviderMax } from "@/components/motion-provider-max"
import { Navbar } from "@/components/navbar"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"
import { CatalogStylePreview } from "@/components/sections/catalog-style-preview"

export const metadata: Metadata = {
  title: "Estilos del catálogo — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para comparar estilos de tarjeta. Borrar al elegir uno. */
export default function CatalogStylesPage() {
  return (
    <CartProvider>
      <MotionProviderMax>
        <main data-face="cosmetics" className="relative overflow-x-hidden pb-28">
          <Navbar face="cosmetics" />
          <section id="hero" className="px-6 pb-2 pt-28 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
            <h1 className="mt-2 text-3xl md:text-5xl">Estilos del catálogo</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
              El mismo catálogo con cinco diseños de tarjeta. Cambia de estilo con la barra de abajo; el carrito y los tonos funcionan igual en todos.
            </p>
          </section>
          <CatalogStylePreview />
          <CartFloat />
          <CartSidebar />
        </main>
      </MotionProviderMax>
    </CartProvider>
  )
}
