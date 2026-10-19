"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { m, AnimatePresence, useReducedMotion } from "framer-motion"
import { Check, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { WhatsAppIcon } from "./whatsapp-icon"
import { CartAddOns } from "./cart-add-ons"
import { useCart } from "@/context/cart-context"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { cn, formatCOP } from "@/lib/utils"
import { buildOrderMessage, waLink } from "@/lib/whatsapp"
import { arrivingNow, burst, cartOpener } from "@/lib/cart-fx"
import { FREE_SHIPPING_MIN } from "@/lib/site"

/* The strong ease-out of the site's UI motion (the drawer's own curve is cubic-bezier(0.16, 1, 0.3, 1), see ui/dialog.tsx). */
const OUT = [0.23, 1, 0.32, 1] as const
const IN_OUT = [0.77, 0, 0.175, 1] as const
/* Fine lines: the `* { border-color }` rule of globals.css beats the utilities (see CLAUDE.md), so the colour goes inline. */
const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
const HAIRLINE_STRONG = "color-mix(in oklab, var(--ink) 20%, transparent)"

export function CartSidebar() {
  const { items, count, total, isOpen, lastAdded, closeCart, addItem, setQty, removeItem, clear } =
    useCart()
  const reduce = useReducedMotion()

  /* What was just added is celebrated once: while the cart stays open after an add, its row is "fresh" (flash, arrival, rolling numbers).
   * Closing the cart marks that add as seen, so opening it later from the header shows a calm list. */
  const [seen, setSeen] = useState(0)
  useEffect(() => {
    // Marks the last add as seen once the cart closes: it follows the cart closing, which only an effect can observe.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isOpen && lastAdded) setSeen(lastAdded.tick)
  }, [isOpen, lastAdded])
  const fresh = lastAdded !== null && lastAdded.tick > seen

  /* Bring the row that was just added into view (a long list would hide it below the fold), so the photo has a thumbnail to land on. */
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen || !fresh || !lastAdded) return
    const id = requestAnimationFrame(() => {
      const list = listRef.current
      const row = list?.querySelector<HTMLElement>(`[data-cart-row="${CSS.escape(lastAdded.key)}"]`)
      if (!list || !row) return
      const l = list.getBoundingClientRect()
      const r = row.getBoundingClientRect()
      if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom + 8
      else if (r.top < l.top) list.scrollTop -= l.top - r.top + 8
    })
    return () => cancelAnimationFrame(id)
  }, [isOpen, fresh, lastAdded])

  /* The free-shipping bar shows the total from BEFORE the add and then fills up to the new one a beat after the cart has opened. */
  const [barTotal, setBarTotal] = useState(total)
  useEffect(() => {
    // While the cart is closed the bar simply follows the total, so that on the next add it starts from the total BEFORE it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isOpen) { setBarTotal(total); return }
    const t = setTimeout(() => setBarTotal(total), arrivingNow() ? 300 : 0)   // the bar waits a beat ONLY just after an add opened the cart; pressing + answers at once
    return () => clearTimeout(t)
  }, [isOpen, total, fresh])
  const shippingDone = barTotal >= FREE_SHIPPING_MIN
  const remaining = Math.max(0, FREE_SHIPPING_MIN - barTotal)
  const barRef = useRef<HTMLDivElement>(null)
  const wasDone = useRef(shippingDone)
  useEffect(() => {
    // Crossing the line while the cart is open is the one moment worth a burst: it goes off at the bar's end when the fill gets there.
    let t: ReturnType<typeof setTimeout> | undefined
    if (shippingDone && !wasDone.current && isOpen) {
      t = setTimeout(() => {
        const r = barRef.current?.getBoundingClientRect()
        if (r) burst(r.right - 10, r.top + r.height / 2)
      }, 650)
    }
    wasDone.current = shippingDone
    return () => clearTimeout(t)
  }, [shippingDone, isOpen])

  const onCheckout = () => {
    const msg = buildOrderMessage(
      items.map((i) => ({ product: i.product, variant: i.variant, qty: i.qty })),
    )
    window.open(waLink(msg), "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <DialogContent
        side="right"
        className="flex flex-col"
        closeClassName="left-3 right-auto top-3.5 rounded-none hover:bg-ink/8"
        onCloseAutoFocus={(e) => {
          // After an add the cart opened from a card: the keyboard goes back to that card's button, not to the page's top.
          const el = cartOpener.el
          cartOpener.el = null
          if (el?.isConnected) { e.preventDefault(); el.focus({ preventScroll: true }) }
        }}
      >
        {/* Flat and square, laid out like the client's reference: the close button on the left, the title centred, the little "Vaciar" on the right */}
        <div className="relative shrink-0 border-b px-14 py-4" style={{ borderColor: HAIRLINE }}>
          <DialogTitle className="flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase leading-none tracking-[0.14em] text-ink">
            {/* The photo of a just-added product lands here (lib/cart-fx.ts) */}
            <span data-cart-drawer-icon="" className="inline-flex"><ShoppingBag className="h-5 w-5" /></span>
            <span>Tu carrito <span className="[font-variant-numeric:lining-nums]">({count})</span></span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {items.length === 0 ? "Tu carrito está vacío" : `${count} producto${count > 1 ? "s" : ""} en tu carrito`}
          </DialogDescription>
          {/* Same action as the link at the bottom of the list, but in reach without scrolling. It sits on the opposite side from the close button. */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              data-testid="clear-cart-top"
              // A square outlined button with the bin (it was a thin underlined word at 70 % that hardly showed): it fills with ink on hover
              style={{ borderColor: HAIRLINE_STRONG }}
              className="absolute right-4 top-1/2 flex h-8 -translate-y-1/2 cursor-pointer items-center gap-1.5 border bg-white px-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-(--crema) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.97]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Vaciar
            </button>
          )}
        </div>

        {items.length === 0 ? (
          // The empty cart wears the same flat, square design as the full one (client request): a boxed bag, the title in spaced capitals, the near-black square button
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 pb-16 text-center">
            <span className="grid h-16 w-16 place-items-center border text-ink/70" style={{ borderColor: HAIRLINE_STRONG }} aria-hidden>
              <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink">Aún no has elegido nada</h3>
              <p className="mx-auto mt-2 max-w-[17rem] text-[12.5px] leading-snug text-ink/60">
                Explora nuestro catálogo y encuentra tu próximo ritual de belleza.
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              data-testid="keep-shopping"
              className="flex h-11 cursor-pointer items-center justify-center bg-ink px-8 text-[12.5px] font-medium uppercase tracking-[0.14em] text-(--crema) transition-colors duration-200 hover:bg-(--ciruela) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.99]"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            {/* "Te faltan $X para el envío gratis": a bordered card with a thin line; the line and the number animate on an add, once the cart has opened */}
            <div className="mx-5 -mt-1 shrink-0 border bg-white px-4 py-3.5" style={{ borderColor: HAIRLINE }} data-testid="free-shipping">
              <p className="text-[13px] leading-tight text-ink" aria-live="polite">
                {shippingDone ? (
                  <span
                    key="done"
                    className={cn("flex items-center gap-2 font-semibold", fresh && "motion-safe:animate-[cart-text-in_250ms_cubic-bezier(0.23,1,0.32,1)_backwards]")}
                  >
                    <span
                      className={cn("grid h-4 w-4 place-items-center bg-(--face) text-ink", fresh && "motion-safe:animate-[cart-check-pop_400ms_cubic-bezier(0.34,1.56,0.64,1)_100ms_backwards]")}
                    >
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>
                    ¡Tienes envío gratis!
                  </span>
                ) : (
                  <span>
                    Te faltan{" "}
                    <strong
                      key={remaining}
                      className={cn("inline-block font-bold", fresh && "motion-safe:animate-[cart-num-in_250ms_cubic-bezier(0.23,1,0.32,1)_backwards]")}
                    >
                      {formatCOP(remaining)}
                    </strong>{" "}
                    para el envío gratis
                  </span>
                )}
              </p>
              <div ref={barRef} className="relative mt-3 h-[3px] overflow-hidden bg-(--face)/25">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-(--face)"
                  style={{
                    clipPath: `inset(0 ${100 - Math.min(100, (barTotal / FREE_SHIPPING_MIN) * 100)}% 0 0)`,
                    transition: reduce ? "none" : "clip-path 700ms cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
                {shippingDone && !reduce && fresh && (
                  <m.span
                    key="sheen"
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1/4 bg-white/60 blur-[2px]"
                    initial={{ transform: "translateX(-120%)" }}
                    animate={{ transform: "translateX(420%)" }}
                    transition={{ duration: 0.9, ease: IN_OUT, delay: 0.65 }}
                  />
                )}
              </div>
            </div>

            {/* overflow-x-hidden: a row that slides in (or out) from the right pokes out of the list for a moment, and that made the site's lila horizontal scrollbar appear as a purple line */}
            <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-2 pt-5">
              <AnimatePresence>
              {items.map(({ product, variant, qty, key }) => {
                const mine = fresh && lastAdded.key === key       // the row that was just added to
                const arrives = mine && lastAdded.isNew && !reduce // a brand-new line slides in from the edge once the drawer is nearly settled
                return (
                <m.div
                  key={key}
                  data-cart-row={key}
                  initial={false}
                  animate={{ opacity: 1, transform: "translateX(0px)" }}
                  exit={{ opacity: 0, transform: "translateX(24px)", height: 0, paddingBottom: 0, transition: { duration: 0.2, ease: OUT } }}
                  // The entrance is a CSS animation (see globals.css): Framer's own one blinked the row for a frame when it ended. Framer keeps the exit.
                  className={cn("overflow-hidden pb-5", arrives && "motion-safe:animate-[cart-row-in_400ms_cubic-bezier(0.23,1,0.32,1)_160ms_backwards]")}
                >
                <div className="relative flex gap-3.5">
                  {/* A wash of the accent that fades out: "this is the one you just added" */}
                  {mine && (
                    <span
                      key={lastAdded.tick}
                      aria-hidden
                      className="pointer-events-none absolute -inset-2 bg-(--face) opacity-0 [animation:cart-row-wash_900ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:[--wash-from:0.18]"
                    />
                  )}
                  <div data-cart-thumb="" className="relative h-[94px] w-[94px] shrink-0 overflow-hidden bg-(--face-light)/25">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="94px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="relative flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="line-clamp-2 text-[12.5px] font-medium uppercase leading-snug tracking-[0.04em] text-ink">
                          {product.name}
                        </h4>
                        {variant && (
                          <p className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-ink/55">{variant}</p>
                        )}
                      </div>
                      <div className="shrink-0 text-right text-[12.5px] font-medium text-ink [font-variant-numeric:lining-nums]">
                        {formatCOP(product.price * qty)}
                        {qty > 1 && <p className="mt-0.5 text-[10.5px] font-normal text-ink/55">{formatCOP(product.price)} c/u</p>}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="inline-flex items-center border" style={{ borderColor: HAIRLINE_STRONG }}>
                        <button
                          type="button"
                          onClick={() => setQty(key, qty - 1)}
                          className="grid h-6 w-6 cursor-pointer place-items-center transition-colors hover:bg-ink/8 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span
                          key={qty}
                          className={cn("inline-block w-6 text-center text-[11.5px] [font-variant-numeric:lining-nums]", mine && "motion-safe:animate-[cart-num-in_220ms_cubic-bezier(0.23,1,0.32,1)_backwards]")}
                        >
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(product.id, variant)}
                          className="grid h-6 w-6 cursor-pointer place-items-center transition-colors hover:bg-ink/8 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="grid h-6 w-6 cursor-pointer place-items-center text-ink/45 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                </m.div>
                )
              })}
              </AnimatePresence>
              <button
                type="button"
                onClick={clear}
                data-testid="clear-cart-bottom"
                className="mx-auto block cursor-pointer pb-2 text-[11px] uppercase tracking-[0.14em] text-ink/60 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
              >
                Vaciar carrito
              </button>
            </div>

            {/* Between the list and the total: it stays in reach however long the list is; it starts folded and unfolds by itself a moment after the cart opens */}
            <CartAddOns items={items} onAdd={(p) => addItem(p.id, p.variants?.[0])} />

            <div className="shrink-0 border-t bg-white px-5 pb-4 pt-3.5" style={{ borderColor: HAIRLINE }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-[0.14em] text-ink">Total</span>
                <span
                  key={total}
                  className={cn("inline-block text-[17px] font-semibold text-ink [font-variant-numeric:lining-nums]", fresh && "motion-safe:animate-[cart-num-in_280ms_cubic-bezier(0.23,1,0.32,1)_backwards]")}
                >
                  {formatCOP(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                data-testid="checkout-whatsapp"
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 bg-ink text-[12.5px] font-medium uppercase tracking-[0.14em] text-(--crema) transition-colors duration-200 hover:bg-(--ciruela) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Enviar pedido
              </button>
              <p className="mt-2.5 text-center text-[11px] text-ink/60">
                Confirmamos disponibilidad y método de pago por WhatsApp
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
