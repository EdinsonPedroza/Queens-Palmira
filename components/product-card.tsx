"use client"

import { createPortal } from "react-dom"
import { ShoppingBag, Check, Palette, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/products"
import { Badge } from "./ui/badge"
import { useCart } from "@/context/cart-context"
import { formatCOP } from "@/lib/utils"

const BADGE_COPY: Record<NonNullable<Product["badge"]>, { text: string; variant: "new" | "bestseller" | "offer" }> = {
  nuevo:      { text: "Nuevo",       variant: "new" },
  bestseller: { text: "Bestseller",  variant: "bestseller" },
  oferta:     { text: "Oferta",      variant: "offer" },
}

/* ─── Chip de variante ───────────────────────────────────── */
function VariantChip({ label, selected, onClick, size = "md" }: {
  label: string; selected: boolean; onClick: () => void; size?: "sm" | "md"
}) {
  const sz = size === "sm"
    ? "px-2 py-0.5 text-[10px] rounded-full"
    : "px-3 py-1 text-xs rounded-full"
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        sz,
        "border font-medium leading-none whitespace-nowrap cursor-pointer select-none",
        "transition-all duration-150 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
        selected
          ? "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-white shadow-md"
          : "border-[var(--rose-pastel)] text-[var(--ink)]/65 hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)] hover:bg-[var(--gold-deep)]/5",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

/* ─── Dropdown via portal (nunca se corta) ───────────────── */
interface DropdownCoords { top: number; left: number; width: number }

function PortalVariantDropdown({ variants, selected, onSelect, open, onClose, triggerRef }: {
  variants: string[]
  selected: string
  onSelect: (v: string) => void
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const [coords, setCoords] = useState<DropdownCoords | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Calcula posición al abrir */
  useEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const dropW = Math.max(r.width, 280)
    const left = Math.min(r.left, window.innerWidth - dropW - 8)
    setCoords({ top: r.bottom + 6, left: Math.max(left, 8), width: dropW })
  }, [open, triggerRef])

  /* Cierra al hacer click afuera o scroll */
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (
        panelRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) return
      onClose()
    }
    const closeOnScroll = () => onClose()
    document.addEventListener("mousedown", close)
    window.addEventListener("scroll", closeOnScroll, { passive: true, capture: true })
    return () => {
      document.removeEventListener("mousedown", close)
      window.removeEventListener("scroll", closeOnScroll, true)
    }
  }, [open, onClose, triggerRef])

  if (!open || !coords) return null

  return createPortal(
    <div
      ref={panelRef}
      style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width, zIndex: 9999 }}
      className="rounded-2xl border border-[var(--rose-pastel)] bg-white shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--rose-pastel)]/40 bg-[var(--rose-pastel-soft)]">
        <Palette className="h-3.5 w-3.5 text-[var(--gold-deep)]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)]">
          Elige tu tono
        </span>
        <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">
          {variants.length} opciones
        </span>
      </div>
      {/* Chips */}
      <div className="p-3 flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
        {variants.map((v) => (
          <VariantChip
            key={v}
            label={v}
            selected={selected === v}
            onClick={() => { onSelect(v); onClose() }}
          />
        ))}
      </div>
      {/* Hint */}
      {!selected && (
        <p className="px-4 pb-3 text-[10px] text-[var(--muted-foreground)]">
          Toca un tono para seleccionarlo
        </p>
      )}
    </div>,
    document.body,
  )
}

/* ─── Card ───────────────────────────────────────────────── */
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
  const badgeInfo    = product.badge ? BADGE_COPY[product.badge] : null

  const handleAdd = useCallback(() => {
    const canAdd = !hasVariants || selectedVariant !== ""
    if (!canAdd) return
    addItem(product.id, selectedVariant || undefined)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }, [addItem, product.id, selectedVariant, hasVariants])

  const handleCTA = () => {
    if (manyVariants && !selectedVariant) { setDropOpen(true); return }
    handleAdd()
  }

  const canAddDirect = !hasVariants || selectedVariant !== ""

  return (
    <>
      <motion.article
        className="group relative flex flex-col rounded-2xl bg-white"
        style={{ boxShadow: "0 1px 6px -1px rgba(44,24,16,0.07), 0 0 0 1px rgba(255,182,193,0.25)" }}
        whileHover={{
          y: -5,
          boxShadow: "0 20px 48px -12px rgba(212,175,55,0.24), 0 4px 16px -4px rgba(44,24,16,0.1), 0 0 0 1.5px rgba(212,175,55,0.2)",
        }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        data-testid={`product-${product.id}`}
      >
        {/* ── Imagen (único elemento con overflow-hidden) ── */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-gradient-to-b from-[var(--rose-pastel-soft)] via-[var(--rose-pastel)]/15 to-[var(--rose-pastel)]/25">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
            style={product.imageStyle}
          />

          {badgeInfo && (
            <div className="absolute left-2.5 top-2.5 z-10">
              <Badge variant={badgeInfo.variant}>{badgeInfo.text}</Badge>
            </div>
          )}

          <div className="absolute inset-0 bg-[var(--ink)]/0 group-hover:bg-[var(--ink)]/5 transition-colors duration-500 pointer-events-none" />

          {/* Precio flotante (hover desktop) */}
          <div className="absolute right-2.5 top-2.5 z-10 hidden md:block rounded-xl px-2.5 py-1.5 backdrop-blur-md bg-white/80 border border-white/60 shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="font-display text-xs font-bold text-[var(--gold-deep)]">
              {formatCOP(product.price)}
            </span>
          </div>

          {/* CTA slide-up */}
          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              type="button"
              onClick={handleCTA}
              className={[
                "w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-wide cursor-pointer",
                "transition-colors duration-150 focus-visible:outline-none",
                justAdded
                  ? "bg-emerald-500 text-white"
                  : canAddDirect
                    ? "bg-[#2C1810]/88 text-white hover:bg-[#2C1810]"
                    : "bg-[#2C1810]/88 text-white hover:bg-[#2C1810]",
              ].join(" ")}
              style={{ backdropFilter: "blur(12px)" }}
              aria-label={`${manyVariants && !selectedVariant ? "Ver tonos de " : "Agregar "}${product.name}`}
              data-testid={`add-${product.id}`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span key="ok" className="flex items-center gap-1.5"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <Check className="h-3.5 w-3.5" /> ¡Agregado!
                  </motion.span>
                ) : manyVariants && !selectedVariant ? (
                  <motion.span key="pick" className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Palette className="h-3.5 w-3.5" /> Ver tonos ({product.variants!.length})
                  </motion.span>
                ) : (
                  <motion.span key="add" className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ShoppingBag className="h-3.5 w-3.5" /> Agregar al carrito
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col gap-1.5 px-3 pt-2.5 pb-3">
          <h3 className="font-display text-[13px] font-semibold leading-snug line-clamp-2 text-[var(--ink)]">
            {product.name}
          </h3>
          <p className="text-[10.5px] leading-relaxed text-[var(--muted-foreground)] line-clamp-1">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-0.5 gap-2">
            <span className="font-display text-base font-bold text-[var(--gold-deep)]">
              {formatCOP(product.price)}
            </span>
            {hasVariants && selectedVariant && (
              <span className="text-[10px] font-medium text-[var(--gold-deep)] truncate max-w-[50%]">
                {selectedVariant}
              </span>
            )}
          </div>

          {/* Chips inline (≤4 variantes) */}
          {fewVariants && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {product.variants!.map((v) => (
                <VariantChip key={v} label={v} selected={selectedVariant === v}
                  onClick={() => setSelected(v)} size="sm" />
              ))}
            </div>
          )}

          {/* Trigger dropdown (>4 variantes) */}
          {manyVariants && (
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setDropOpen((o) => !o)}
              className={[
                "mt-1 w-full flex items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-medium",
                "cursor-pointer transition-all duration-150 focus-visible:outline-none",
                dropOpen || selectedVariant
                  ? "border-[var(--gold-deep)] bg-[var(--gold-deep)]/8 text-[var(--gold-deep)]"
                  : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]",
              ].join(" ")}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Palette className="h-3 w-3 shrink-0" />
                <span className="truncate">
                  {selectedVariant ? selectedVariant : `Ver ${product.variants!.length} tonos`}
                </span>
              </span>
              <ChevronDown className={`h-3 w-3 shrink-0 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
            </button>
          )}

          {/* Hint sin variante */}
          {fewVariants && !selectedVariant && (
            <p className="text-[10px] text-center text-[var(--muted-foreground)]/70">
              Elige un tono para agregar
            </p>
          )}
        </div>
      </motion.article>

      {/* Portal dropdown — fuera del DOM del card */}
      {manyVariants && (
        <PortalVariantDropdown
          variants={product.variants!}
          selected={selectedVariant}
          onSelect={setSelected}
          open={dropOpen}
          onClose={() => setDropOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </>
  )
}
