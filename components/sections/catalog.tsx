"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "@/components/product-card"
import { CATEGORIES, getProductsByCategory, type ProductCategory } from "@/lib/products"

export function Catalog() {
  const [active, setActive] = useState<ProductCategory>("labiales")
  const activeCategory = CATEGORIES.find((c) => c.id === active)!
  const products = getProductsByCategory(active)

  return (
    <section
      id="catalogo"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white to-[var(--rose-pastel)]/15 overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 -left-20 h-64 w-64 rounded-full bg-[var(--rose-pastel)]/30 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--gold)]/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
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

        {/* ── Selector premium ── */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-1.5 rounded-2xl bg-[var(--rose-pastel)]/25 p-2 backdrop-blur-sm border border-white/60 shadow-inner">
            {CATEGORIES.map((cat) => {
              const isActive = active === cat.id
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="relative px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                >
                  {/* Sliding pill */}
                  {isActive && (
                    <motion.div
                      layoutId="cat-pill"
                      className="absolute inset-0 rounded-xl bg-white"
                      style={{
                        boxShadow: "0 4px_24px_-4px rgba(212,175,55,0.45), 0 0 0 1.5px rgba(212,175,55,0.2)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}

                  {/* Glow ring on active */}
                  {isActive && (
                    <motion.div
                      layoutId="cat-glow"
                      className="absolute inset-0 rounded-xl"
                      style={{ boxShadow: "0 0 0 1.5px rgba(212,175,55,0.35), 0 6px 20px -4px rgba(212,175,55,0.3)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}

                  <span
                    className="relative z-10 flex items-center gap-2 transition-colors duration-200"
                    style={{ color: isActive ? "var(--gold-deep)" : "oklch(0.18 0.025 40 / 0.55)" }}
                  >
                    <motion.span
                      animate={{ scale: isActive ? 1.2 : 1, rotate: isActive ? [0, -10, 10, 0] : 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-base leading-none"
                    >
                      {cat.icon}
                    </motion.span>
                    <span className={isActive ? "font-semibold" : ""}>{cat.label}</span>
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Tagline animada */}
        <AnimatePresence mode="wait">
          <motion.p
            key={active + "-tag"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-center text-sm font-medium tracking-[0.12em] text-gold-deep uppercase mb-8"
          >
            {activeCategory.tagline}
          </motion.p>
        </AnimatePresence>

        {/* Grid animado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
