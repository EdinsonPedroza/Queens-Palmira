"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CARD_STYLES, type CardStyle } from "@/components/product-card"
import { Catalog } from "@/components/sections/catalog"

/*
 * Vista temporal para comparar estilos de tarjeta sobre el catálogo real.
 * Cuando el cliente elija uno: dejarlo como valor por defecto de <Catalog />
 * y borrar este archivo y app/cosmetics/estilos.
 */
export function CatalogStylePreview() {
  const [style, setStyle] = useState<CardStyle>("editorial")
  const current = CARD_STYLES.find((c) => c.id === style)!

  return (
    <>
      <Catalog cardStyle={style} />

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--crema)]/95 backdrop-blur-md"
        style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
        data-testid="style-switcher"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3">
          <div role="tablist" aria-label="Estilo de tarjeta" className="flex flex-wrap justify-center gap-1.5">
            {CARD_STYLES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={style === c.id}
                onClick={() => setStyle(c.id)}
                data-testid={`style-${c.id}`}
                style={{ borderColor: style === c.id ? "var(--ink)" : "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                className={cn(
                  "cursor-pointer border px-3.5 py-1.5 text-[11.5px] uppercase tracking-[0.1em] transition-colors",
                  style === c.id ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_8%,transparent)]",
                )}
              >
                {i + 1} · {c.label}
              </button>
            ))}
          </div>
          <p className="text-center text-[12px] text-[var(--muted-foreground)]">{current.note}</p>
        </div>
      </div>
    </>
  )
}
