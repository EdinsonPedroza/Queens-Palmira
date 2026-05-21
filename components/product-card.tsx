"use client"

import { ShoppingBag, Check, Palette, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/products"
import { Badge } from "./ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "./ui/dialog"
import { useCart } from "@/context/cart-context"
import { formatCOP } from "@/lib/utils"

const BADGE_COPY: Record<NonNullable<Product["badge"]>, { text: string; variant: "new" | "bestseller" | "offer" }> = {
  nuevo:      { text: "Nuevo",       variant: "new" },
  bestseller: { text: "Bestseller",  variant: "bestseller" },
  oferta:     { text: "Oferta",      variant: "offer" },
}

/* ─── Chip individual ─────────────────────────────────────── */
function VariantChip({
  label,
  selected,
  onClick,
  size = "md",
}: {
  label: string
  selected: boolean
  onClick: () => void
  size?: "sm" | "md" | "lg"
}) {
  const base = "cursor-pointer select-none transition-all duration-150 border font-medium leading-none whitespace-nowrap active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
  const sizes = {
    sm: "rounded-full px-2 py-0.5 text-[10px]",
    md: "rounded-full px-3 py-1 text-xs",
    lg: "rounded-xl px-4 py-2 text-sm",
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        base,
        sizes[size],
        selected
          ? "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-white shadow-md"
          : "border-[var(--rose-pastel)] text-[var(--ink)]/65 hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)] hover:bg-[var(--gold-deep)]/5",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

/* ─── Modal de selección de tonos ────────────────────────── */
function VariantPickerDialog({
  product,
  selected,
  onSelect,
  open,
  onOpenChange,
  onAdd,
  justAdded,
}: {
  product: Product
  selected: string
  onSelect: (v: string) => void
  open: boolean
  onOpenChange: (o: boolean) => void
  onAdd: () => void
  justAdded: boolean
}) {
  const canAdd = selected !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        side="bottom"
        className="flex flex-col max-h-[88svh] md:max-h-[80vh] p-0"
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="h-1 w-10 rounded-full bg-[var(--rose-pastel)]" />
        </div>

        {/* Header — producto */}
        <div className="flex items-center gap-4 px-5 pt-4 pb-4 border-b border-[var(--rose-pastel)]/30">
          {/* Miniatura */}
          <div className="shrink-0 h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-b from-[var(--rose-pastel-soft)] to-[var(--rose-pastel)]/20 flex items-center justify-center p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
              style={product.imageStyle}
            />
          </div>

          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base font-semibold leading-snug line-clamp-2 text-[var(--ink)]">
              {product.name}
            </DialogTitle>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-1">
              {product.description}
            </p>
            <p className="mt-1 font-display text-base font-bold text-[var(--gold-deep)]">
              {formatCOP(product.price)}
            </p>
          </div>

          <DialogClose className="shrink-0 rounded-full p-2 text-[var(--ink)]/40 hover:bg-[var(--rose-pastel)]/40 hover:text-[var(--ink)] transition-colors">
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        {/* Selector de tonos */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-[var(--gold-deep)]" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-deep)]">
              Elige tu tono
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              — {product.variants!.length} opciones disponibles
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.variants!.map((v) => (
              <VariantChip
                key={v}
                label={v}
                selected={selected === v}
                onClick={() => onSelect(v)}
                size="lg"
              />
            ))}
          </div>

          {selected && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-sm text-[var(--ink)]/70"
            >
              Tono seleccionado:{" "}
              <span className="font-semibold text-[var(--gold-deep)]">{selected}</span>
            </motion.p>
          )}
        </div>

        {/* CTA sticky */}
        <div className="px-5 pb-6 pt-3 border-t border-[var(--rose-pastel)]/30">
          <motion.button
            type="button"
            onClick={() => { onAdd(); if (canAdd) onOpenChange(false) }}
            disabled={!canAdd}
            whileHover={canAdd ? { scale: 1.02 } : {}}
            whileTap={canAdd ? { scale: 0.97 } : {}}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className={[
              "w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-semibold",
              "transition-colors duration-150 focus-visible:outline-none",
              justAdded
                ? "bg-emerald-500 text-white cursor-default"
                : canAdd
                  ? "bg-[var(--ink)] text-white hover:bg-[var(--ink)]/90 cursor-pointer"
                  : "bg-[var(--rose-pastel)]/60 text-[var(--muted-foreground)] cursor-not-allowed",
            ].join(" ")}
            data-testid={`add-${product.id}`}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span key="ok" className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Check className="h-4 w-4" />
                  ¡Agregado al carrito!
                </motion.span>
              ) : canAdd ? (
                <motion.span key="add" className="flex items-center gap-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ShoppingBag className="h-4 w-4" />
                  Agregar al carrito
                </motion.span>
              ) : (
                <motion.span key="pick" className="flex items-center gap-2"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Palette className="h-4 w-4" />
                  Selecciona un tono primero
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {!canAdd && (
            <p className="mt-2 text-center text-[10px] text-[var(--muted-foreground)]">
              Toca un tono para activar el botón
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Card principal ─────────────────────────────────────── */
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded]       = useState(false)
  const [pickerOpen, setPickerOpen]     = useState(false)
  const [selectedVariant, setSelected]  = useState<string>(
    product.variants?.length === 1 ? product.variants[0] : "",
  )

  const hasVariants    = (product.variants?.length ?? 0) > 0
  const manyVariants   = (product.variants?.length ?? 0) > 4
  const fewVariants    = hasVariants && !manyVariants
  const canAddDirect   = !hasVariants || (fewVariants && selectedVariant !== "")
  const badgeInfo      = product.badge ? BADGE_COPY[product.badge] : null

  const handleAdd = () => {
    addItem(product.id, selectedVariant || undefined)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  const handleCTAClick = () => {
    if (manyVariants) { setPickerOpen(true); return }
    if (!hasVariants || canAddDirect) { handleAdd(); return }
  }

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
        {/* ── Imagen ── (único bloque con overflow-hidden) */}
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

          {/* Precio flotante hover */}
          <div className="absolute right-2.5 top-2.5 z-10 rounded-xl px-2.5 py-1.5 backdrop-blur-md bg-white/80 border border-white/60 shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 md:block hidden">
            <span className="font-display text-xs font-bold text-[var(--gold-deep)]">
              {formatCOP(product.price)}
            </span>
          </div>

          <div className="absolute inset-0 bg-[var(--ink)]/0 group-hover:bg-[var(--ink)]/6 transition-colors duration-500 pointer-events-none" />

          {/* CTA slide-up */}
          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              type="button"
              onClick={handleCTAClick}
              className={[
                "w-full flex items-center justify-center gap-2 py-3 text-[11px] font-semibold tracking-wide",
                "transition-colors duration-150 focus-visible:outline-none cursor-pointer",
                justAdded
                  ? "bg-emerald-500 text-white"
                  : "bg-[#2C1810]/88 text-white hover:bg-[#2C1810]",
              ].join(" ")}
              style={{ backdropFilter: "blur(12px)" }}
              aria-label={`${manyVariants ? "Ver tonos de " : "Agregar "}${product.name}`}
              data-testid={`add-${product.id}`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span key="ok" className="flex items-center gap-1.5"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <Check className="h-3.5 w-3.5" /> ¡Agregado!
                  </motion.span>
                ) : manyVariants ? (
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

          {/* Precio + info de variantes */}
          <div className="flex items-center justify-between mt-0.5 gap-2">
            <span className="font-display text-base font-bold text-[var(--gold-deep)]">
              {formatCOP(product.price)}
            </span>
            {hasVariants && (
              <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">
                {manyVariants
                  ? `${product.variants!.length} tonos`
                  : selectedVariant
                    ? <span className="text-[var(--gold-deep)] font-medium">{selectedVariant}</span>
                    : "Elige tono"}
              </span>
            )}
          </div>

          {/* Chips inline para pocos variantes (≤4) */}
          {fewVariants && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {product.variants!.map((v) => (
                <VariantChip
                  key={v}
                  label={v}
                  selected={selectedVariant === v}
                  onClick={() => setSelected(v)}
                  size="sm"
                />
              ))}
            </div>
          )}

          {/* Trigger para muchos variantes */}
          {manyVariants && (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className={[
                "mt-1 w-full flex items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] font-medium",
                "cursor-pointer transition-all duration-150 focus-visible:outline-none",
                selectedVariant
                  ? "border-[var(--gold-deep)] bg-[var(--gold-deep)]/8 text-[var(--gold-deep)]"
                  : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]",
              ].join(" ")}
            >
              <Palette className="h-3 w-3" />
              {selectedVariant ? `Tono: ${selectedVariant}` : `Elige entre ${product.variants!.length} tonos`}
            </button>
          )}

          {/* Hint cuando hay pocos variantes pero no se ha elegido */}
          {fewVariants && !selectedVariant && (
            <p className="text-[10px] text-center text-[var(--muted-foreground)]/70">
              Elige un tono para agregar
            </p>
          )}
        </div>
      </motion.article>

      {/* Dialog de variantes — fuera del card, sin overflow-hidden */}
      {manyVariants && (
        <VariantPickerDialog
          product={product}
          selected={selectedVariant}
          onSelect={setSelected}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          onAdd={handleAdd}
          justAdded={justAdded}
        />
      )}
    </>
  )
}
