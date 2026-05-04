"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, BookOpen, X, ZoomIn } from "lucide-react"

const TOTAL_PAGES = 83

function pageUrl(n: number) {
  return `/images/catalog_pages/page_${String(n).padStart(3, "0")}.png`
}

export function DigitalCatalog() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)

  function prev() { setCurrent((p) => Math.max(1, p - 1)) }
  function next() { setCurrent((p) => Math.min(TOTAL_PAGES, p + 1)) }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev()
    if (e.key === "ArrowRight") next()
    if (e.key === "Escape") setOpen(false)
  }

  return (
    <>
      {/* ── Section strip ── */}
      <section
        id="catalogo-digital"
        className="relative py-20 md:py-28 bg-gradient-to-b from-white to-[var(--rose-pastel)]/10 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, oklch(0.92 0.04 0) / 0.3, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6 md:px-10 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--gold-deep)] mb-3">
            Catálogo virtual
          </span>
          <h2
            className="font-display font-semibold text-[var(--ink)] mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Explora{" "}
            <span className="text-queens-gradient">todo nuestro catálogo</span>
          </h2>
          <p className="text-[var(--muted-foreground)] text-base md:text-lg mb-10 max-w-xl mx-auto">
            Revisa todos nuestros productos, marcas y precios actualizados en
            nuestro catálogo digital. ¡Pídelo directo por WhatsApp!
          </p>

          {/* Preview strip — first 5 pages */}
          <div className="flex gap-3 justify-center mb-10 overflow-x-auto pb-2">
            {[1, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => { setCurrent(n); setOpen(true) }}
                className="group relative flex-shrink-0 w-28 md:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[var(--rose-pastel)]"
                aria-label={`Ver página ${n}`}
              >
                <Image
                  src={pageUrl(n)}
                  alt={`Catálogo Queens página ${n}`}
                  fill
                  sizes="(max-width: 768px) 112px, 144px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <ZoomIn className="text-white" size={20} />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => { setCurrent(1); setOpen(true) }}
            data-testid="open-digital-catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--gold)] text-white font-semibold tracking-wide shadow-lg hover:bg-[var(--gold-deep)] transition-colors duration-200"
          >
            <BookOpen size={18} />
            Ver catálogo completo
          </button>
        </div>
      </section>

      {/* ── Full-screen viewer ── */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de catálogo Queens Cosmetics"
          className="fixed inset-0 z-[200] flex flex-col bg-[var(--ink)]/95 backdrop-blur-sm"
          onKeyDown={handleKey}
          tabIndex={-1}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[var(--gold)]" />
              <span className="font-display text-white text-sm font-semibold tracking-wider">
                QUEENS — Catálogo Virtual
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-xs tabular-nums">
                {current} / {TOTAL_PAGES}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Cerrar catálogo"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Page viewer */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-center justify-center p-4 overflow-auto"
          >
            <div className="relative max-h-full max-w-sm md:max-w-md lg:max-w-lg w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
              <Image
                key={current}
                src={pageUrl(current)}
                alt={`Catálogo Queens página ${current}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 py-4 shrink-0 border-t border-white/10">
            <button
              onClick={prev}
              disabled={current === 1}
              className="flex items-center gap-1 px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            {/* Page jump */}
            <input
              type="number"
              min={1}
              max={TOTAL_PAGES}
              value={current}
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (v >= 1 && v <= TOTAL_PAGES) setCurrent(v)
              }}
              className="w-14 text-center bg-white/10 text-white text-sm rounded-lg py-1.5 px-2 border border-white/20 focus:outline-none focus:border-[var(--gold)]"
              aria-label="Ir a página"
            />

            <button
              onClick={next}
              disabled={current === TOTAL_PAGES}
              className="flex items-center gap-1 px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Página siguiente"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
