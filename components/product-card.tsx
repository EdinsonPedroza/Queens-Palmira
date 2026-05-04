"use client"

import Image from "next/image"
import { Plus, Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/products"
import { Badge } from "./ui/badge"
import { useCart } from "@/context/cart-context"
import { formatCOP } from "@/lib/utils"

const BADGE_COPY: Record<NonNullable<Product["badge"]>, { text: string; variant: "new" | "bestseller" | "offer" }> = {
  nuevo:      { text: "Nuevo",       variant: "new" },
  bestseller: { text: "Bestseller",  variant: "bestseller" },
  oferta:     { text: "Oferta",      variant: "offer" },
}

// Products with many variants use a <select>, few variants use pill buttons
const PILL_THRESHOLD = 7

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.length === 1 ? product.variants[0] : "",
  )

  const hasVariants = (product.variants?.length ?? 0) > 0
  const usePills    = hasVariants && (product.variants!.length <= PILL_THRESHOLD)
  const useSelect   = hasVariants && (product.variants!.length > PILL_THRESHOLD)
  const canAdd      = !hasVariants || selectedVariant !== ""

  const handleAdd = () => {
    if (!canAdd) return
    addItem(product.id, selectedVariant || undefined)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  const badgeInfo = product.badge ? BADGE_COPY[product.badge] : null

  return (
    <article
      className="group product-card-lift relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[var(--rose-pastel)]/40"
      data-testid={`product-${product.id}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--rose-pastel)]/15">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {badgeInfo && (
          <div className="absolute left-3 top-3">
            <Badge variant={badgeInfo.variant}>{badgeInfo.text}</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-semibold leading-tight line-clamp-2 text-[var(--ink)]">
          {product.name}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
          {product.description}
        </p>

        {/* Variant selector — pills */}
        {usePills && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.variants!.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={[
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none transition-all",
                  selectedVariant === v
                    ? "border-[var(--gold-deep)] bg-[var(--gold-deep)] text-white"
                    : "border-[var(--rose-pastel)] text-[var(--muted-foreground)] hover:border-[var(--gold-deep)] hover:text-[var(--gold-deep)]",
                ].join(" ")}
                aria-pressed={selectedVariant === v}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        {/* Variant selector — dropdown for many options */}
        {useSelect && (
          <div className="relative mt-1">
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[var(--rose-pastel)] bg-white py-1.5 pl-3 pr-8 text-xs text-[var(--ink)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-deep)]"
              aria-label="Seleccionar tono"
            >
              <option value="">Elige un tono…</option>
              {product.variants!.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          </div>
        )}

        {/* Price + Add button */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="font-display text-xl font-bold text-[var(--gold-deep)]">
            {formatCOP(product.price)}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={[
              "group/btn relative flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-all",
              canAdd
                ? "bg-queens-gradient-intense hover:scale-110 hover:shadow-lg"
                : "cursor-not-allowed bg-[var(--rose-pastel)] opacity-60",
            ].join(" ")}
            aria-label={`Agregar ${product.name} al carrito`}
            data-testid={`add-${product.id}`}
          >
            {justAdded ? (
              <Check className="h-5 w-5 animate-fade-up" />
            ) : (
              <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
            )}
          </button>
        </div>

        {/* Hint when variant required but not chosen */}
        {hasVariants && !selectedVariant && (
          <p className="text-[10px] text-center text-[var(--muted-foreground)] -mt-1">
            Elige un tono para agregar
          </p>
        )}
      </div>
    </article>
  )
}
