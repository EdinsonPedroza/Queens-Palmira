"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, Plus } from "lucide-react"
import { ProductCard, CARD_GRID } from "@/components/product-card"
import { getProductsByCategory, type Product } from "@/lib/products"
import { cn } from "@/lib/utils"

/*
 * Vista temporal: diseños del "Ver más" del catálogo, sobre Línea Capilar (75 productos). Cuando el cliente elija, se pasa a catalog.tsx y se
 * borran este archivo y app/cosmetics/ver-mas-boton. Las "fichas" ocupan una casilla más de la rejilla, con el mismo tamaño y el mismo pie que una tarjeta.
 */
type VariantId = "actual" | "seda" | "collage" | "tinta" | "lila" | "borde"
const STEP = 15
const START = 14

const VARIANTS: { id: VariantId; label: string; note: string }[] = [
  { id: "actual", label: "Botón chico", note: "El de ahora, ya achicado: un botón bajo la rejilla." },
  { id: "seda", label: "Ficha seda", note: "Una casilla más con el fondo de seda de las tarjetas, un +N grande y el mismo botón de contorno de abajo." },
  { id: "collage", label: "Ficha collage", note: "Una casilla con las fotos de los siguientes productos en mosaico: se ve qué viene." },
  { id: "tinta", label: "Ficha tinta", note: "Casilla sólida en tinta con letras crema: la que más se nota entre las fotos." },
  { id: "lila", label: "Ficha lila", note: "Casilla en lila suave con un círculo + y el número de productos que faltan." },
  { id: "borde", label: "Ficha contorno", note: "Casilla casi invisible: solo un contorno fino y un + que se llena al pasar el cursor. La más discreta." },
]

function MoreTile({ variant, left, next, onMore }: { variant: Exclude<VariantId, "actual">; left: number; next: Product[]; onMore: () => void }) {
  const n = Math.min(left, STEP)
  return (
    <article className="group relative flex h-full flex-col" data-testid={`more-tile-${variant}`}>
      <button
        type="button"
        onClick={onMore}
        aria-label={`Ver ${n} productos más`}
        className="relative aspect-square w-full cursor-pointer overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--face)"
      >
        {variant === "seda" && (
          <>
            <Image src="/images/backgrounds/seda.webp" alt="" aria-hidden fill sizes="260px" quality={85} className="object-cover" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="font-display text-[clamp(3rem,6vw,4.5rem)] font-bold leading-none text-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110">+{left}</span>
            </span>
          </>
        )}
        {variant === "collage" && (
          <span className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-[color-mix(in_oklab,var(--ink)_10%,var(--crema))]">
            {next.slice(0, 4).map((p) => (
              <span key={p.id} className="relative bg-[color-mix(in_oklab,var(--face-light)_30%,var(--crema))]">
                <Image src={p.image} alt="" aria-hidden fill sizes="130px" className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
              </span>
            ))}
            <span className="absolute inset-0 grid place-items-center">
              <span className="rounded-full bg-[var(--crema)] px-4 py-2 font-display text-xl font-bold text-[var(--ink)] shadow-md">+{left}</span>
            </span>
          </span>
        )}
        {variant === "tinta" && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[var(--ink)] text-[var(--crema)] transition-colors duration-300 group-hover:bg-[var(--face-deep)]">
            <span className="font-display text-[clamp(3rem,6vw,4.5rem)] font-bold leading-none">+{left}</span>
            <span className="text-[11px] uppercase tracking-[0.22em]">productos</span>
          </span>
        )}
        {variant === "lila" && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--lila-soft)]">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--ink)] text-[var(--crema)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110">
              <Plus className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink)]">{left} productos más</span>
          </span>
        )}
        {variant === "borde" && (
          <span className="absolute inset-0 flex items-center justify-center" style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--ink) 18%, transparent)" }}>
            <span className="grid h-14 w-14 place-items-center rounded-full text-[var(--ink)] transition-colors duration-300 group-hover:bg-[var(--ink)] group-hover:text-[var(--crema)]" style={{ boxShadow: "inset 0 0 0 1px var(--ink)" }}>
              <Plus className="h-6 w-6" strokeWidth={1.5} />
            </span>
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-2.5 pt-3">
        <div>
          <h3 className="text-[12.5px] font-bold uppercase leading-snug tracking-[0.03em] text-[var(--ink)]">Más productos</h3>
          <p className="mt-1 text-[12px] leading-snug text-[var(--ink)]/80">Hay {left} más en esta categoría.</p>
        </div>
        <div className="mt-auto pt-1">
          <button
            type="button"
            onClick={onMore}
            className="w-full cursor-pointer px-3 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--crema)]"
            style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--ink) 14%, transparent)" }}
          >
            Ver {n} más
          </button>
        </div>
      </div>
    </article>
  )
}

export function MoreButtonPreview() {
  const all = getProductsByCategory("capilar")
  const [variant, setVariant] = useState<VariantId>("seda")
  const [shown, setShown] = useState(START)
  const left = all.length - shown
  const more = () => setShown((s) => s + STEP)
  const note = VARIANTS.find((v) => v.id === variant)!.note

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-6 md:px-10">
      <div className={`grid ${CARD_GRID.editorial}`}>
        {all.slice(0, shown).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {variant !== "actual" && left > 0 && <MoreTile variant={variant} left={left} next={all.slice(shown, shown + 4)} onMore={more} />}
      </div>
      {variant === "actual" && left > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-xs text-[var(--muted-foreground)]">Mostrando {shown} de {all.length}</p>
          <button
            type="button"
            onClick={more}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[var(--face)] px-6 py-2 text-xs font-semibold text-white shadow-md transition-colors duration-200 hover:bg-[var(--face-deep)]"
          >
            <ChevronDown className="h-4 w-4" />
            Ver {Math.min(left, STEP)} más
          </button>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--face-light)] bg-[var(--crema)]/95 px-4 py-3 backdrop-blur-md" data-testid="more-button-switcher">
        <p className="mx-auto mb-2 max-w-3xl text-center text-xs text-[var(--ink)]/80">{note}</p>
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v.id)}
              aria-pressed={variant === v.id}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors",
                variant === v.id ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)] hover:bg-[var(--face-light)]/40",
              )}
              style={{ boxShadow: variant === v.id ? "none" : "inset 0 0 0 1px color-mix(in oklab, var(--ink) 25%, transparent)" }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
