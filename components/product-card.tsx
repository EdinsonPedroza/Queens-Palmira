"use client"

import { ShoppingBag, Check, ChevronDown, Palette } from "lucide-react"
import { useState, useRef, useEffect } from "react"
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

const INLINE_THRESHOLD = 4

function VariantChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "rounded-full px-2.5 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap",
        "cursor-pointer select-none transition-all duration-150 border",
        "active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]",
        selected
          ? "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-white shadow-sm"
          : "border-[var(--rose-pastel)] text-[var(--ink)]/60 hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

function VariantSelector({ variants, selected, onSelect }: { variants: string[]; selected: string; onSelect: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])

  if (variants.length <= INLINE_THRESHOLD) {
    return (
      <div className="flex flex-wrap gap-1 pt-1">
        {variants.map((v) => (
          <VariantChip key={v} label={v} selected={selected === v} onClick={() => onSelect(v)} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative pt-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center justify-between gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium",
          "cursor-pointer select-none transition-all duration-150 focus-visible:outline-none",
          selected
            ? "border-[var(--gold-deep)] bg-[var(--gold-deep)]/8 text-[var(--ink)]"
            : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-[var(--gold-deep)]",
        ].join(" ")}
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5 truncate">
          <Palette size={10} className="shrink-0 text-[var(--gold-deep)]" />
          <span className="truncate">{selected || "Elige un tono"}</span>
        </span>
        <ChevronDown size={12} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-40 left-0 right-0 top-[calc(100%+4px)] rounded-xl border border-[var(--rose-pastel)] bg-white shadow-2xl p-2.5"
          >
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {variants.map((v) => (
                <VariantChip key={v} label={v} selected={selected === v} onClick={() => { onSelect(v); setOpen(false) }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.length === 1 ? product.variants[0] : "",
  )

  const hasVariants = (product.variants?.length ?? 0) > 0
  const canAdd      = !hasVariants || selectedVariant !== ""
  const badgeInfo   = product.badge ? BADGE_COPY[product.badge] : null

  const handleAdd = () => {
    if (!canAdd) return
    addItem(product.id, selectedVariant || undefined)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <motion.article
      className="group relative flex flex-col rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: "0 1px 6px -1px rgba(44,24,16,0.07), 0 0 0 1px rgba(255,182,193,0.25)" }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 48px -12px rgba(212,175,55,0.24), 0 4px 16px -4px rgba(44,24,16,0.1), 0 0 0 1.5px rgba(212,175,55,0.2)",
      }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      data-testid={`product-${product.id}`}
    >
      {/* ── Imagen ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-[var(--rose-pastel-soft)] via-[var(--rose-pastel)]/15 to-[var(--rose-pastel)]/25">

        {/* Producto */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.07]"
          style={product.imageStyle}
        />

        {/* Badge */}
        {badgeInfo && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <Badge variant={badgeInfo.variant}>{badgeInfo.text}</Badge>
          </div>
        )}

        {/* Precio flotante en imagen — visible siempre en mobile, en desktop al hover */}
        <div
          className={[
            "absolute right-2.5 top-2.5 z-10 rounded-xl px-2.5 py-1.5",
            "backdrop-blur-md bg-white/80 border border-white/60 shadow-sm",
            "md:opacity-0 md:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300",
          ].join(" ")}
        >
          <span className="font-display text-xs font-bold text-[var(--gold-deep)]">
            {formatCOP(product.price)}
          </span>
        </div>

        {/* Overlay oscuro sutil al hover */}
        <div className="absolute inset-0 bg-[var(--ink)]/0 group-hover:bg-[var(--ink)]/6 transition-colors duration-500 pointer-events-none" />

        {/* ── CTA: siempre visible en mobile, slide-up en desktop ── */}
        <div
          className={[
            "absolute inset-x-0 bottom-0 z-20 transition-transform duration-300 ease-out",
            "translate-y-0 md:translate-y-full md:group-hover:translate-y-0",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={[
              "w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-wide",
              "transition-colors duration-150 focus-visible:outline-none cursor-pointer",
              justAdded
                ? "bg-emerald-500 text-white"
                : canAdd
                  ? "bg-[#2C1810]/88 text-white hover:bg-[#2C1810]"
                  : "bg-[var(--rose-pastel)]/80 text-[var(--muted-foreground)] cursor-not-allowed",
            ].join(" ")}
            style={{ backdropFilter: "blur(12px)" }}
            aria-label={`Agregar ${product.name} al carrito`}
            data-testid={`add-${product.id}`}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="ok"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-3.5 w-3.5" />
                  ¡Agregado!
                </motion.span>
              ) : canAdd ? (
                <motion.span
                  key="add"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Agregar al carrito
                </motion.span>
              ) : (
                <motion.span
                  key="pick"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Palette className="h-3.5 w-3.5" />
                  Elige un tono primero
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1.5 px-3 pt-2.5 pb-3">
        {/* Nombre */}
        <h3 className="font-display text-[13px] font-semibold leading-snug line-clamp-2 text-[var(--ink)]">
          {product.name}
        </h3>

        {/* Descripción */}
        <p className="text-[10.5px] leading-relaxed text-[var(--muted-foreground)] line-clamp-1">
          {product.description}
        </p>

        {/* Precio (desktop: siempre visible aquí; mobile: también en la imagen) */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="font-display text-base font-bold text-[var(--gold-deep)]">
            {formatCOP(product.price)}
          </span>
          {hasVariants && !selectedVariant && (
            <span className="text-[10px] text-[var(--muted-foreground)] italic">
              Elige tono
            </span>
          )}
        </div>

        {/* Variants */}
        {hasVariants && (
          <VariantSelector
            variants={product.variants!}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}
      </div>
    </motion.article>
  )
}
