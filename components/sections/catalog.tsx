"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { CATEGORIES, getProductsByCategory } from "@/lib/products"

export function Catalog() {
  return (
    <section
      id="catalogo"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white to-[var(--rose-pastel)]/15 overflow-hidden"
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-10 -left-20 h-64 w-64 rounded-full bg-[var(--rose-pastel)]/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--gold)]/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--gold-deep)] mb-3">
            Nuestro catálogo
          </span>
          <h2
            className="font-display font-semibold text-ink mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Productos que te harán{" "}
            <span className="text-queens-gradient">sentir única</span>
          </h2>
          <p className="text-[var(--muted-foreground)] text-base md:text-lg">
            Explora por categoría y agrega tus favoritos al carrito.
            Confirmamos tu pedido por WhatsApp.
          </p>
        </div>

        <Tabs defaultValue="labiales" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c.id} value={c.id}>
                  <span aria-hidden="true">{c.icon}</span>
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {CATEGORIES.map((cat) => {
            const products = getProductsByCategory(cat.id)
            return (
              <TabsContent key={cat.id} value={cat.id}>
                <div className="text-center mb-8">
                  <p className="text-sm font-medium tracking-[0.12em] text-gold-deep uppercase">
                    {cat.tagline}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
