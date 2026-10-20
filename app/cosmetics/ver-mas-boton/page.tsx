import type { Metadata } from "next"
import { CartProvider } from "@/context/cart-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Navbar } from "@/components/navbar"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloat } from "@/components/cart-float"
import { MoreButtonPreview } from "@/components/sections/more-button-preview"

export const metadata: Metadata = {
  title: "Botón Ver más — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada) para comparar diseños del "Ver más" del catálogo. Borrar al elegir (junto con components/sections/more-button-preview.tsx). */
export default function MoreButtonPage() {
  return (
    <CartProvider>
      <MotionProvider>
        <main data-face="cosmetics" className="relative overflow-x-hidden pb-28">
          <Navbar face="cosmetics" separate announce />
          <section id="hero" className="px-6 pb-4 pt-10 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
            <h1 className="mt-2 text-3xl md:text-5xl">Botón &ldquo;Ver más&rdquo;</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
              Baja hasta el final de la rejilla y cambia de diseño con la barra de abajo. Todos funcionan: al pulsarlos aparecen 15 productos más.
            </p>
          </section>
          <MoreButtonPreview />
          <CartFloat />
          <CartSidebar />
        </main>
      </MotionProvider>
    </CartProvider>
  )
}
