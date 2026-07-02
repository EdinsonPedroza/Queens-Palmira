"use client"

import { useState, useMemo, useCallback } from "react"
import { m, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, ChevronDown, X, ArrowUpDown } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { CATEGORIES, PRODUCTS, getProductsByCategory, type ProductCategory } from "@/lib/products"

const PAGE_SIZE = 12

type SortOrder = "default" | "price-asc" | "price-desc"

const SORT_LABELS: Record<SortOrder, string> = {
  default:    "Relevancia",
  "price-asc":  "Menor precio",
  "price-desc": "Mayor precio",
}

export function Catalog() {
  const [active, setActive]         = useState<ProductCategory>("labiales")
  const [search, setSearch]         = useState("")
  const [sortOrder, setSortOrder]   = useState<SortOrder>("default")
  const [sortOpen, setSortOpen]     = useState(false)
  const [visibleCount, setVisible]  = useState(PAGE_SIZE)

  const activeCategory = CATEGORIES.find((c) => c.id === active)!

  /* counts por categoría — se usa en los tabs */
  const categoryCounts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, getProductsByCategory(c.id).length])),
    [],
  )

  /* productos filtrados + ordenados */
  const filtered = useMemo(() => {
    const raw = getProductsByCategory(active)
    const q   = search.trim().toLowerCase()
    const hit = q
      ? raw.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      : raw
    if (sortOrder === "price-asc")  return [...hit].sort((a, b) => a.price - b.price)
    if (sortOrder === "price-desc") return [...hit].sort((a, b) => b.price - a.price)
    return hit
  }, [active, search, sortOrder])

  const visible    = filtered.slice(0, visibleCount)
  const hasMore    = visibleCount < filtered.length
  const remaining  = filtered.length - visibleCount

  const handleCategoryChange = useCallback((id: ProductCategory) => {
    setActive(id)
    setVisible(PAGE_SIZE)
    setSearch("")
  }, [])

  const handleSearch = useCallback((val: string) => {
    setSearch(val)
    setVisible(PAGE_SIZE)
  }, [])

  const handleSort = useCallback((s: SortOrder) => {
    setSortOrder(s)
    setSortOpen(false)
    setVisible(PAGE_SIZE)
  }, [])

  return (
    <section
      id="catalogo"
      className="relative py-20 md:py-28 bg-gradient-to-b from-white to-[var(--rose-pastel)]/15 overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 -left-20 h-64 w-64 rounded-full bg-[var(--rose-pastel)]/30 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--gold)]/20 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* ── Header ── */}
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
          </p>
        </div>

        {/* ── Sticky wrapper ── */}
        <div className="sticky top-[72px] z-30 -mx-6 md:-mx-10 px-6 md:px-10 pb-4 pt-3 bg-white/80 backdrop-blur-xl border-b border-(--rose-pastel)/30">

          {/* Category tabs */}
          <div className="flex justify-center mb-3">
            <div className="flex flex-wrap justify-center gap-1.5 rounded-2xl bg-(--rose-pastel)/25 p-1.5 backdrop-blur-sm border border-white/60 shadow-inner">
              {CATEGORIES.map((cat) => {
                const isActive = active === cat.id
                return (
                  <m.button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                    className="relative px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--gold)"
                  >
                    {isActive && (
                      <m.div
                        layoutId="cat-pill"
                        className="absolute inset-0 rounded-xl bg-white"
                        style={{ boxShadow: "0 4px 16px -4px rgba(212,175,55,0.4), 0 0 0 1.5px rgba(212,175,55,0.2)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span
                      className="relative z-10 flex items-center gap-1.5 transition-colors duration-200"
                      style={{ color: isActive ? "var(--gold-deep)" : "oklch(0.18 0.025 40 / 0.55)" }}
                    >
                      <span className={isActive ? "font-semibold" : ""}>{cat.label}</span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden sm:inline"
                        style={{
                          background: isActive ? "rgba(212,175,55,0.12)" : "rgba(0,0,0,0.06)",
                          color: isActive ? "var(--gold-deep)" : "oklch(0.18 0.025 40 / 0.4)",
                        }}
                      >
                        {categoryCounts[cat.id]}
                      </span>
                    </span>
                  </m.button>
                )
              })}
            </div>
          </div>

          {/* Search + Sort row */}
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={`Buscar en ${activeCategory.label.toLowerCase()}…`}
                className={[
                  "w-full rounded-xl border-2 bg-white py-2.5 pl-10 pr-10 text-sm text-[var(--ink)]",
                  "placeholder:text-[var(--muted-foreground)] transition-all duration-200",
                  "focus:outline-none focus:ring-0",
                  search
                    ? "border-[var(--gold-deep)]"
                    : "border-[var(--rose-pastel)] focus:border-[var(--gold-deep)]",
                ].join(" ")}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((o) => !o)}
                className={[
                  "flex items-center gap-2 rounded-xl border-2 px-3.5 py-2.5 text-sm font-medium",
                  "cursor-pointer select-none transition-all duration-150 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-[var(--gold)] whitespace-nowrap",
                  sortOrder !== "default"
                    ? "border-[var(--gold-deep)] bg-[oklch(0.60_0.130_75/8%)] text-[var(--gold-deep)]"
                    : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-[var(--gold-deep)] hover:text-[var(--ink)]",
                ].join(" ")}
                aria-expanded={sortOpen}
              >
                <ArrowUpDown className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{SORT_LABELS[sortOrder]}</span>
                <SlidersHorizontal className="h-3.5 w-3.5 sm:hidden shrink-0" />
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <m.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[160px] rounded-xl border border-[var(--rose-pastel)] bg-white shadow-xl overflow-hidden"
                  >
                    {(Object.entries(SORT_LABELS) as [SortOrder, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSort(key)}
                        className={[
                          "w-full text-left px-4 py-2.5 text-sm transition-colors",
                          sortOrder === key
                            ? "bg-[oklch(0.60_0.130_75/10%)] font-semibold text-[var(--gold-deep)]"
                            : "text-[var(--ink)] hover:bg-[var(--rose-pastel)]/30",
                        ].join(" ")}
                      >
                        {label}
                      </button>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Metadata row ── */}
        <div className="flex items-center justify-between mt-8 mb-6">
          <AnimatePresence mode="wait">
            <m.p
              key={active + search + sortOrder + "-tag"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium tracking-[0.08em] text-[var(--gold-deep)] uppercase"
            >
              {search
                ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para "${search}"`
                : activeCategory.tagline}
            </m.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <m.span
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[var(--muted-foreground)]"
            >
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </m.span>
          </AnimatePresence>
        </div>

        {/* ── Grid animado ── */}
        <AnimatePresence mode="wait">
          {visible.length === 0 ? (
            <m.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <Search className="mx-auto mb-4 h-10 w-10 text-[var(--muted-foreground)]" />
              <p className="font-display text-xl font-semibold text-[var(--ink)] mb-2">
                Sin resultados
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Intenta con otro término o{" "}
                <button
                  type="button"
                  className="text-[var(--gold-deep)] underline underline-offset-2 cursor-pointer"
                  onClick={() => handleSearch("")}
                >
                  limpia la búsqueda
                </button>
              </p>
            </m.div>
          ) : (
            <m.div
              key={active + "-grid"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            >
              {visible.map((p, i) => (
                <m.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 11) * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={p} />
                </m.div>
              ))}
            </m.div>
          )}
        </AnimatePresence>

        {/* ── Load more ── */}
        {hasMore && (
          <m.div
            className="mt-12 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Progress bar */}
            <div className="w-full max-w-xs h-1 rounded-full bg-[var(--rose-pastel)]/40 overflow-hidden">
              <m.div
                className="h-full rounded-full bg-queens-gradient-intense"
                animate={{ width: `${(visibleCount / filtered.length) * 100}%` }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Mostrando {visible.length} de {filtered.length}
            </p>
            <m.button
              type="button"
              onClick={() => setVisible((n) => n + PAGE_SIZE)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className={[
                "flex items-center gap-2 rounded-2xl px-10 py-3.5 shadow-lg",
                "text-sm font-semibold text-white bg-[var(--gold)] hover:bg-[var(--gold-deep)]",
                "transition-all duration-200 cursor-pointer",
              ].join(" ")}
            >
              <ChevronDown className="h-5 w-5" />
              Ver {Math.min(remaining, PAGE_SIZE)} más
            </m.button>
          </m.div>
        )}

      </div>
    </section>
  )
}
