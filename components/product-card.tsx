"use client"

import { Plus, Check, ChevronDown, Palette } from "lucide-react"
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

// ≤4 variants → inline pills always visible
// >4 variants → collapsed dropdown with chip panel inside
const INLINE_THRESHOLD = 4

function VariantChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "rounded-full border-2 px-3 py-1 text-xs font-medium leading-none whitespace-nowrap",
        "cursor-pointer select-none transition-all duration-150",
        "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        selected
          ? "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-white shadow-md scale-[1.05]"
          : "border-[var(--rose-pastel)] text-(--ink)/70 hover:border-gold-deep hover:text-gold-deep hover:scale-[1.05] hover:shadow-sm",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: string[]
  selected: string
  onSelect: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  const isInline = variants.length <= INLINE_THRESHOLD

  if (isInline) {
    return (
      <div className="mt-2 space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-deep)] flex items-center gap-1">
          <Palette size={10} /> Tono
        </p>
        <div className="flex flex-wrap gap-1.5">
          {variants.map((v) => (
            <VariantChip key={v} label={v} selected={selected === v} onClick={() => onSelect(v)} />
          ))}
        </div>
      </div>
    )
  }

  // Dropdown mode for many variants
  return (
    <div className="mt-2 relative" ref={ref}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-deep)] flex items-center gap-1 mb-1.5">
        <Palette size={10} /> Tono
      </p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center justify-between gap-2 rounded-xl border-2 px-3 py-2 text-xs font-medium",
          "cursor-pointer select-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          selected
            ? "border-[var(--gold-deep)] bg-[var(--gold-deep)]/8 text-[var(--ink)]"
            : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-gold-deep hover:text-gold-deep",
        ].join(" ")}
        aria-expanded={open}
        aria-label="Seleccionar tono"
      >
        <span className="truncate">{selected || "Elige un tono…"}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 left-0 right-0 top-[calc(100%+4px)] rounded-xl border border-[var(--rose-pastel)] bg-white shadow-xl p-3">
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            {variants.map((v) => (
              <VariantChip
                key={v}
                label={v}
                selected={selected === v}
                onClick={() => { onSelect(v); setOpen(false) }}
              />
            ))}
          </div>
        </div>
      )}
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
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[var(--rose-pastel)]/40"
      data-testid={`product-${product.id}`}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(212,175,55,0.2), 0 0 0 1px rgba(212,175,55,0.12)" }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{ cursor: "default" }}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-(--rose-pastel)/10">
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            style={product.imageStyle}
            loading="lazy"
          />
        </div>
        {badgeInfo && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant={badgeInfo.variant}>{badgeInfo.text}</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-semibold leading-tight line-clamp-2 text-[var(--ink)]">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-2">
          {product.description}
        </p>

        {/* Variant selector */}
        {hasVariants && (
          <VariantSelector
            variants={product.variants!}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        {/* Price + Add button */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="font-display text-xl font-bold text-[var(--gold-deep)]">
            {formatCOP(product.price)}
          </div>
          <motion.button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            whileHover={canAdd ? { scale: 1.15 } : {}}
            whileTap={canAdd ? { scale: 0.88 } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className={[
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md",
              canAdd
                ? "bg-queens-gradient-intense cursor-pointer"
                : "cursor-not-allowed bg-[var(--rose-pastel)] opacity-50",
            ].join(" ")}
            aria-label={`Agregar ${product.name} al carrito`}
            data-testid={`add-${product.id}`}
          >
            {/* Ripple al agregar */}
            <AnimatePresence>
              {justAdded && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-white/30"
                  initial={{ scale: 0.6, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="plus"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Plus className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Hint when variant required but not chosen */}
        {hasVariants && !selectedVariant && (
          <p className="mt-1 text-[10px] text-center text-[var(--muted-foreground)]">
            Selecciona un tono para agregar
          </p>
        )}
      </div>
    </motion.article>
  )
}
