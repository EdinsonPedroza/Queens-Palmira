"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Catalog } from "@/components/sections/catalog"
import { LayoutCover, LayoutMenu, LayoutMosaic, LayoutRails, LayoutShowcase } from "@/components/sections/catalog-layouts"

/*
 * Vista temporal para comparar DISEÑOS del catálogo (cómo se organiza). Cuando el cliente elija uno,
 * se pasa a catalog.tsx y se borran este archivo, catalog-layouts.tsx y app/cosmetics/disenos.
 */
type LayoutId = "actual" | "carriles" | "mosaico" | "carta" | "vitrina" | "portada"

const LAYOUTS: { id: LayoutId; label: string; note: string }[] = [
  { id: "actual",   label: "Actual",   note: "Como está hoy: barra de categorías, buscador y orden, y una rejilla de fichas." },
  { id: "carriles", label: "Carriles", note: "Todas las categorías a la vista, una bajo otra, cada una en un carril que se desliza. Franjas que alternan crema y lila suave." },
  { id: "mosaico",  label: "Mosaico",  note: "Rejilla tipo bento: cada siete fichas hay una grande en bloque sólido (lila, luego tinta) que marca el ritmo." },
  { id: "carta",    label: "Carta",    note: "Como la carta de un restaurante: filas con miniatura, línea punteada y precio. Compacta; título gigante en lila." },
  { id: "vitrina",  label: "Vitrina",  note: "Un producto a la vez, grande, en arco, con todos los tonos a la vista y una tira de miniaturas para cambiar." },
  { id: "portada",  label: "Portada",  note: "Cada categoría abre con una losa lila: nombre enorme, pestañas en crema y tres productos asomando. Debajo, rejilla sobre crema." },
]

export function CatalogLayoutPreview() {
  const [layout, setLayout] = useState<LayoutId>("actual")
  const current = LAYOUTS.find((l) => l.id === layout)!

  return (
    <>
      {layout === "actual"   && <Catalog />}
      {layout === "carriles" && <LayoutRails />}
      {layout === "mosaico"  && <LayoutMosaic />}
      {layout === "carta"    && <LayoutMenu />}
      {layout === "vitrina"  && <LayoutShowcase />}
      {layout === "portada"  && <LayoutCover />}

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--crema)]/95 backdrop-blur-md"
        style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
        data-testid="layout-switcher"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3">
          <div role="tablist" aria-label="Diseño del catálogo" className="flex flex-wrap justify-center gap-1.5">
            {LAYOUTS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                role="tab"
                aria-selected={layout === l.id}
                onClick={() => setLayout(l.id)}
                data-testid={`layout-${l.id}`}
                style={{ borderColor: layout === l.id ? "var(--ink)" : "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                className={cn(
                  "cursor-pointer border px-3.5 py-1.5 text-[11.5px] uppercase tracking-[0.1em] transition-colors",
                  layout === l.id ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_8%,transparent)]",
                )}
              >
                {i} · {l.label}
              </button>
            ))}
          </div>
          <p className="text-center text-[12px] text-[var(--muted-foreground)]">{current.note}</p>
        </div>
      </div>
    </>
  )
}
