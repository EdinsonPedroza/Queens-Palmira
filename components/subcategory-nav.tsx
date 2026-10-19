"use client"

import { cn } from "@/lib/utils"

export interface SubcategoryItem {
  id: string
  label: string
  count: number
}

/* Fine lines, like the cart drawer's: the `* { border-color }` rule of globals.css beats the utilities (see CLAUDE.md), so the colour goes inline. */
const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
const HAIRLINE_STRONG = "color-mix(in oklab, var(--ink) 20%, transparent)"

/*
 * Subcategory index of a category ("Índice", the client's pick), dressed like the cart drawer (client: "lo quiero más inspirado en el diseño del carrito"):
 * flat and square, a white card with a fine border, rows split by fine lines, the labels in small spaced capitals and the count in parentheses (like
 * "Tu carrito (3)"), the open one filled in ciruela (the brand's dark plum, #462649; the client wanted it over the near-black --ink) with crema text and a thin lila bar on its left edge (the cart's lila line). On desktop it is a card
 * to the left of the grid that stays put while you scroll the products; on phones it is a row of square chips that sticks under the header. It sticks
 * because the section and <main> use overflow-clip (overflow-hidden would cancel `sticky`).
 */
export function SubcategoryNav({ items, value, onChange }: { items: SubcategoryItem[]; value: string | null; onChange: (id: string) => void }) {
  return (
    <nav
      aria-label="Subcategorías"
      className="sticky top-[calc(var(--nav-h)+0.5rem)] z-10 -mx-6 mb-5 bg-[var(--crema)]/95 px-6 py-2 backdrop-blur-sm md:-mx-10 md:px-10 lg:static lg:mx-0 lg:mb-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
    >
      <div
        className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] lg:border lg:bg-white"
        style={{ borderColor: HAIRLINE }}
      >
        <ul className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible">
          {items.map((it, i) => {
            const on = value === it.id
            return (
              <li key={it.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(it.id)}
                  aria-pressed={on}
                  data-testid={`subcategory-${it.id}`}
                  // Phones: a bordered square chip. Desktop: a row of the card, split from the next by a fine line (inline, see HAIRLINE above).
                  style={{
                    borderColor: on ? "var(--ciruela)" : HAIRLINE_STRONG,
                    boxShadow: i < items.length - 1 ? `inset 0 -1px 0 0 ${on ? "transparent" : HAIRLINE}` : undefined,
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer items-start justify-between gap-3 border px-3.5 py-2.5 text-left text-[11px] uppercase leading-snug tracking-[0.12em] whitespace-nowrap transition-colors duration-200 lg:whitespace-normal lg:border-0 lg:py-3.5",
                    "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink",
                    on
                      ? "bg-(--ciruela) font-semibold text-(--crema) before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-(--face)"
                      : "bg-white text-ink hover:bg-ink/6",
                  )}
                >
                  <span className="min-w-0">{it.label}</span>
                  <span className={cn("shrink-0 font-normal [font-variant-numeric:lining-nums]", on ? "text-(--crema)/70" : "text-ink/50")}>({it.count})</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
