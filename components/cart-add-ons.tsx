"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { m, AnimatePresence } from "framer-motion"
import { ChevronDown, Plus } from "lucide-react"
import { getAddOns } from "@/lib/add-ons"
import { cn, formatCOP } from "@/lib/utils"
import type { Product } from "@/lib/products"

const OUT = [0.23, 1, 0.32, 1] as const
/** How many suggestions the row holds. */
const SHOWN = 6
/** How long after the cart opens the strip unfolds on its own. */
const OPEN_AFTER_MS = 1190
const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"

/*
 * "¿Un último antojo?": a collapsible strip between the list and the total (it stays in reach however long the list is). It starts FOLDED every time the
 * cart opens (the drawer's content unmounts when it closes, so this state starts again) and unfolds by itself after OPEN_AFTER_MS; its header folds or unfolds it by hand. Inside, a row
 * of small, cheap products that complement what is in the cart: one tap adds one unit (no tone to choose; see lib/add-ons.ts), it joins the list above
 * like any other add and is replaced by the next suggestion. `-mb-4` cancels the 16 px `gap-4` that the drawer (DialogContent) puts between its children, which left a wide empty band between the cards and the line above the total. The panel opens and closes by animating the grid row from 0fr to 1fr (no height measuring).
 */
export function CartAddOns({ items, onAdd }: { items: { product: Product }[]; onAdd: (product: Product) => void }) {
  const [open, setOpen] = useState(false)
  const touched = useRef(false)   // the client already folded or unfolded it by hand: the automatic opening gives way
  // The suggestions are kept STABLE: adding one only takes that one out of the row and puts the next suggestion at the END; the others do not
  // re-rank or move (re-ranking the whole row on every add made it blink). It is recalculated only when the set of products in the cart changes.
  const cartKey = items.map((i) => i.product.id).sort().join("|")
  const [picks, setPicks] = useState(() => getAddOns(items, SHOWN))
  const [seenKey, setSeenKey] = useState(cartKey)
  if (cartKey !== seenKey) {
    setSeenKey(cartKey)
    const have = new Set(items.map((i) => i.product.id))
    const kept = picks.filter((p) => !have.has(p.id))
    const fill = kept.length < SHOWN ? getAddOns(items, SHOWN * 2).filter((p) => !kept.some((k) => k.id === p.id)) : []
    setPicks([...kept, ...fill].slice(0, SHOWN))
  }
  const has = picks.length > 0

  // It does not show at once: the cart opens, its own motion plays (the photo landing, the new row) and, a moment later, the strip unfolds by itself.
  useEffect(() => {
    if (!has) return
    const t = setTimeout(() => { if (!touched.current) setOpen(true) }, OPEN_AFTER_MS)
    return () => clearTimeout(t)
  }, [has])

  if (picks.length === 0) return null

  return (
    <section aria-labelledby="add-ons-title" className="-mb-4 shrink-0 border-t bg-white" style={{ borderColor: HAIRLINE }} data-testid="cart-add-ons">
      <button
        type="button"
        onClick={() => { touched.current = true; setOpen((o) => !o) }}
        aria-expanded={open}
        aria-controls="add-ons-panel"
        data-testid="add-ons-toggle"
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-2.5 text-left transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink"
      >
        <span>
          <span id="add-ons-title" className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">¿Un último antojo?</span>
          <span className="mt-0.5 block text-[10.5px] text-ink/60">Detalles pequeños para completar tu compra.</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none", !open && "rotate-180")} />
      </button>

      <div
        id="add-ons-panel"
        role="region"
        aria-labelledby="add-ons-title"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <ul className="flex overflow-x-auto px-5 pb-2 pt-0 [scrollbar-width:none]">
            <AnimatePresence initial={false}>
              {picks.map((p) => (
                <m.li
                  key={p.id}
                  // Enters with a CSS animation (Framer's blinked the new suggestion for a frame when it ended; see globals.css); Framer only closes the gap on exit: first the card fades out (100 ms), THEN the space closes (200 ms), so no sliver of the card (its "+" in the hover colour showed as a thin purple bar at the edge) is left while the space narrows
                  exit={{ opacity: 0, width: 0, paddingRight: 0, transition: { opacity: { duration: 0.1, ease: OUT }, width: { duration: 0.2, ease: OUT, delay: 0.1 }, paddingRight: { duration: 0.2, ease: OUT, delay: 0.1 } } }}
                  style={{ width: 74, paddingRight: 6 }}
                  className="shrink-0 overflow-hidden motion-safe:animate-[cart-pop-in_250ms_cubic-bezier(0.23,1,0.32,1)_backwards]"
                >
                  {/* The card keeps its own fixed width: when the item leaves, only the SPACE closes (the card is clipped and fades) and it does not squeeze,
                      re-wrap its text or move its "+" (it did, when the card followed the shrinking <li>) */}
                  <div className="w-[68px]">
                  <div className="relative aspect-square overflow-hidden bg-(--face-light)/25">
                    <Image src={p.image} alt={p.name} fill sizes="68px" className="object-contain p-1.5" />
                    <button
                      type="button"
                      onClick={() => onAdd(p)}
                      aria-label={`Agregar ${p.name} al carrito`}
                      data-testid={`add-on-${p.id}`}
                      className="absolute bottom-0 right-0 grid h-5 w-5 cursor-pointer place-items-center bg-ink text-(--crema) transition-colors hover:bg-(--ciruela) focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-(--face) active:scale-95"
                    >
                      <Plus className="h-2.5 w-2.5" strokeWidth={2.25} />
                    </button>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[9.5px] font-medium uppercase leading-snug tracking-[0.03em] text-ink">{p.name}</p>
                  <p className="mt-0.5 text-[10.5px] text-ink/70 [font-variant-numeric:lining-nums]">{formatCOP(p.price)}</p>
                  </div>
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </section>
  )
}
