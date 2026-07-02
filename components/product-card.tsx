"use client"

import { createPortal } from "react-dom"
import { ShoppingBag, Check, ChevronDown, Star } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { m, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/products"
import { Badge } from "./ui/badge"
import { useCart } from "@/context/cart-context"
import { formatCOP } from "@/lib/utils"

const BADGE_COPY: Record<NonNullable<Product["badge"]>, { text: string; variant: "new" | "bestseller" | "offer" }> = {
  nuevo:      { text: "Nuevo",       variant: "new" },
  bestseller: { text: "Bestseller",  variant: "bestseller" },
  oferta:     { text: "Oferta",      variant: "offer" },
}

/* ─── Chip de tono ─────────────────────────────────────────── */
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 24 }}
      className={[
        "px-2.5 py-1 rounded-full text-[10px] font-semibold leading-none whitespace-nowrap",
        "cursor-pointer select-none transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
        selected
          ? "bg-queens-gradient-intense text-white shadow-md border border-transparent"
          : "border border-[var(--rose-pastel)] bg-white text-[var(--ink)]/55 hover:border-[oklch(0.60_0.130_75/50%)] hover:text-[var(--gold-deep)] hover:bg-[oklch(0.60_0.130_75/5%)]",
      ].join(" ")}
    >
      {label}
    </m.button>
  )
}

/* ─── Dropdown portal ──────────────────────────────────────── */
function PortalDropdown({ variants, selected, onSelect, open, onClose, triggerRef }: {
  variants: string[]
  selected: string
  onSelect: (v: string) => void
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const w = Math.max(r.width, 288)
    const l = Math.min(r.left, window.innerWidth - w - 8)
    setPos({ top: r.bottom + 6, left: Math.max(l, 8), width: w })
  }, [open, triggerRef])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node) || triggerRef.current?.contains(e.target as Node)) return
      onClose()
    }
    document.addEventListener("mousedown", close)
    window.addEventListener("scroll", onClose, { passive: true, capture: true })
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("scroll", onClose, true)
    }
  }, [open, onClose, triggerRef])

  if (!open || !pos) return null

  return createPortal(
    <m.div
      ref={panelRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
      className="rounded-2xl border border-[var(--rose-pastel)] bg-white shadow-[0_16px_48px_-8px_rgba(44,24,16,0.18),0_0_0_1px_rgba(212,175,55,0.1)] overflow-hidden"
    >
      <div className="px-4 py-2.5 bg-gradient-to-r from-[var(--rose-pastel-soft)] to-white border-b border-[var(--rose-pastel)]/40 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold-deep)]">
          Elige tu tono
        </span>
        <span className="text-[10px] text-[var(--muted-foreground)]">{variants.length} opciones</span>
      </div>
      <div className="p-3 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
        {variants.map((v) => (
          <Chip key={v} label={v} selected={selected === v} onClick={() => { onSelect(v); onClose() }} />
        ))}
      </div>
    </m.div>,
    document.body,
  )
}

/* ─── Botón de agregar ─────────────────────────────────────── */
function AddButton({ canAdd, justAdded, onClick, productName, selectedVariant }: {
  canAdd: boolean
  justAdded: boolean
  onClick: () => void
  productName: string
  selectedVariant: string
}) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      disabled={!canAdd && !justAdded}
      whileHover={canAdd && !justAdded ? { scale: 1.03, y: -1 } : {}}
      whileTap={canAdd ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 480, damping: 26 }}
      aria-label={`Agregar ${productName}${selectedVariant ? ` — ${selectedVariant}` : ""} al carrito`}
      data-testid={`add-${productName}`}
      className={[
        "relative w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold",
        "overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
        "tracking-wide transition-shadow duration-300",
        justAdded
          ? "cursor-default text-white"
          : canAdd
            ? "bg-queens-gradient-intense text-white cursor-pointer"
            : "border-2 border-dashed border-[var(--rose-pastel)] bg-transparent text-[var(--muted-foreground)] cursor-default",
      ].join(" ")}
      style={
        justAdded
          ? { background: "linear-gradient(135deg,#34d399,#059669)", boxShadow: "0 6px 20px -4px rgba(5,150,105,0.45)" }
          : canAdd
            ? { boxShadow: "0 8px 24px -6px rgba(255,105,180,0.5), 0 3px 10px -3px rgba(212,175,55,0.35)" }
            : {}
      }
    >
      {/* Shimmer sweep */}
      {canAdd && !justAdded && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.22) 50%,transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "shimmer-sweep 2.8s ease-in-out infinite",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {justAdded ? (
          <m.span key="ok" className="flex items-center gap-1.5 relative z-10"
            initial={{ opacity: 0, scale: 0.7, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}>
            <Check className="h-4 w-4" strokeWidth={3} />
            ¡Agregado!
          </m.span>
        ) : canAdd ? (
          <m.span key="add" className="flex items-center gap-1.5 relative z-10"
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
            <ShoppingBag className="h-3.5 w-3.5" />
            Agregar al carrito
          </m.span>
        ) : (
          <m.span key="pick" className="relative z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Elige un tono primero
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  )
}

/* ─── Fila de rating (estrellas) ───────────────────────────── */
function RatingRow({ rating, reviews }: { rating: number; reviews?: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-1" aria-label={`Calificación ${rating} de 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3 w-3"
            strokeWidth={0}
            fill={i < rounded ? "var(--gold)" : "var(--rose-pastel)"}
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-[var(--gold-deep)] leading-none tabular-nums">
        {rating.toFixed(1)}
      </span>
      {reviews != null && (
        <span className="text-[10px] text-[var(--muted-foreground)]/70 leading-none">
          ({reviews})
        </span>
      )}
    </div>
  )
}

/* ─── Card principal ───────────────────────────────────────── */
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded]      = useState(false)
  const [dropOpen, setDropOpen]        = useState(false)
  const [selectedVariant, setSelected] = useState<string>(
    product.variants?.length === 1 ? product.variants[0] : "",
  )
  const triggerRef = useRef<HTMLButtonElement>(null)

  const hasVariants  = (product.variants?.length ?? 0) > 0
  const manyVariants = (product.variants?.length ?? 0) > 4
  const fewVariants  = hasVariants && !manyVariants
  const canAdd       = !hasVariants || selectedVariant !== ""
  const badgeInfo    = product.badge ? BADGE_COPY[product.badge] : null

  const handleAdd = useCallback(() => {
    if (!canAdd) return
    addItem(product.id, selectedVariant || undefined)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }, [addItem, product.id, selectedVariant, canAdd])

  const handleSelect = (v: string) => {
    setSelected(v)
    setDropOpen(false)
  }

  return (
    <>
      <m.article
        className="group relative flex flex-col rounded-2xl bg-white"
        style={{ boxShadow: "0 6px 20px -8px rgba(44,24,16,0.16), 0 2px 6px -3px rgba(255,105,180,0.14), 0 0 0 1px rgba(255,182,193,0.45)" }}
        whileHover={{ y: -6, boxShadow: "0 26px 50px -12px rgba(255,105,180,0.30), 0 10px 22px -10px rgba(212,175,55,0.28), 0 0 0 1.5px rgba(212,175,55,0.35)" }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        data-testid={`product-${product.id}`}
      >
        {/* ── Imagen ── */}
        <div className="product-image-bg relative aspect-[3/4] overflow-hidden rounded-t-2xl">
          <span className="product-glow" aria-hidden />
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 20vw"
            className="object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            style={product.imageStyle}
          />

          {badgeInfo && (
            <div className="absolute left-2.5 top-2.5 z-10">
              <Badge variant={badgeInfo.variant}>{badgeInfo.text}</Badge>
            </div>
          )}

          {/* Indicador de tono seleccionado en la imagen */}
          <AnimatePresence>
            {selectedVariant && (
              <m.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-2.5 left-2.5 right-2.5 z-10"
              >
                <div className="flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm px-2.5 py-1.5 shadow-sm border border-white">
                  <span className="text-[10px] font-semibold text-[var(--ink)] truncate">
                    {selectedVariant}
                  </span>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5 gap-2.5">

          {/* Nombre + descripción */}
          <div>
            <h3 className="font-display text-[13px] font-semibold leading-snug line-clamp-2 text-[var(--ink)]">
              {product.name}
            </h3>
            <p className="mt-0.5 text-[10.5px] leading-relaxed text-[var(--muted-foreground)] line-clamp-1">
              {product.description}
            </p>
          </div>

          {/* Precio + rating */}
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-[var(--muted-foreground)]/70 line-through">
                    {formatCOP(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-[var(--rose-hot)]/12 px-1.5 py-0.5 text-[9px] font-bold text-[var(--rose-hot)] leading-none">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
              <span className="font-display text-lg font-bold text-[var(--gold-deep)] leading-none">
                {formatCOP(product.price)}
              </span>
            </div>
            {product.rating != null && (
              <RatingRow rating={product.rating} reviews={product.reviews} />
            )}
          </div>

          {hasVariants && !selectedVariant && (
            <span className="-mt-1 text-[10px] text-[var(--muted-foreground)]/70 italic">
              + elige tu tono
            </span>
          )}

          {/* ── Selector de variantes (≤4: chips inline) ── */}
          {fewVariants && (
            <div className="flex flex-wrap gap-1">
              {product.variants!.map((v) => (
                <Chip key={v} label={v} selected={selectedVariant === v} onClick={() => setSelected(v)} />
              ))}
            </div>
          )}

          {/* ── Selector de variantes (>4: dropdown portal) ── */}
          {manyVariants && (
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setDropOpen((o) => !o)}
              className={[
                "flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium",
                "cursor-pointer transition-all duration-200 focus-visible:outline-none w-full",
                selectedVariant
                  ? "border-[var(--gold-deep)] bg-[oklch(0.60_0.130_75/8%)] text-[var(--ink)]"
                  : dropOpen
                    ? "border-[oklch(0.60_0.130_75/60%)] text-[var(--ink)]"
                    : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-[oklch(0.60_0.130_75/50%)]",
              ].join(" ")}
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="truncate">
                  {selectedVariant || `Ver ${product.variants!.length} tonos disponibles`}
                </span>
              </span>
              <m.span
                animate={{ rotate: dropOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </m.span>
            </button>
          )}

          {/* Separador */}
          <div className="h-px bg-[var(--rose-pastel)]/30 -mx-0.5" />

          {/* ── Botón agregar — siempre visible ── */}
          <AddButton
            canAdd={canAdd}
            justAdded={justAdded}
            onClick={handleAdd}
            productName={product.name}
            selectedVariant={selectedVariant}
          />
        </div>
      </m.article>

      {/* Portal dropdown fuera del card */}
      {manyVariants && (
        <PortalDropdown
          variants={product.variants!}
          selected={selectedVariant}
          onSelect={handleSelect}
          open={dropOpen}
          onClose={() => setDropOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </>
  )
}
