"use client"

import { m, AnimatePresence, useAnimationControls, useReducedMotion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useCart } from "@/context/cart-context"
import { formatCOP } from "@/lib/utils"

const OUT = [0.23, 1, 0.32, 1] as const

/* A number that "rolls" like an odometer: the old value leaves upward while the new one rises into its place. Without motion, a fade. */
function Roll({ value, children }: { value: string | number; children?: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <span className="relative inline-flex overflow-hidden" style={{ height: "1.25em" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={value}
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(100%)" }}
          animate={{ opacity: 1, transform: "translateY(0%)" }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-100%)" }}
          transition={{ duration: 0.3, ease: OUT }}
          className="inline-block"
          style={{ lineHeight: 1.25 }}
        >
          {children ?? value}
        </m.span>
      </AnimatePresence>
    </span>
  )
}

export function CartFloat() {
  const { count, total, isOpen, openCart } = useCart()
  const reduce = useReducedMotion()
  const controls = useAnimationControls()

  /* While the cart is open it covers this chip (and, after an add, it is the cart that celebrates). So the chip keeps showing the old
   * numbers and takes the new ones the moment the cart closes: that is when the roll, the gold flash and the bounce are seen. */
  const [shown, setShown] = useState({ count, total })
  const [flash, setFlash] = useState(0)
  const prev = useRef(shown)
  // Derived while rendering (React's "adjust state when a prop changes" pattern) instead of in an effect: the chip takes the cart's numbers in
  // the same pass in which the cart closes, with no extra commit.
  if (!isOpen && (shown.count !== count || shown.total !== total)) setShown({ count, total })

  const bounce = useCallback(() => {
    controls.start({
      scale:  [1, 1.32, 0.86, 1.12, 0.97, 1],
      rotate: [0, -6,   4,   -2,   1,   0],
      transition: {
        duration: 0.55,
        times:    [0, 0.16, 0.38, 0.6, 0.78, 1],
        ease: "easeOut",
      },
    })
  }, [controls])

  useEffect(() => {
    if (shown.count > prev.current.count) {
      setFlash((n) => n + 1)
      if (prev.current.count > 0) bounce()
    }
    prev.current = shown
  }, [shown, bounce])

  return (
    <AnimatePresence>
      {shown.count > 0 && (
        <m.div
          className="fixed bottom-24 right-5 z-50"
          initial={{ scale: 0, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 440, damping: 26 }}
        >
          {/* The chip and its little "Ver carrito" tab move together (bounce, hover, press), so the tab always stays glued on top */}
          <m.div animate={controls} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="flex flex-col items-start">
          {/* The tab: a pointer for the click only (the button below carries the accessible name) */}
          <span
            aria-hidden
            onClick={openCart}
            className="-mb-px ml-3 cursor-pointer bg-[color-mix(in_oklab,var(--ink)_72%,transparent)] px-2.5 pb-1 pt-1.5 text-[9.5px] font-bold uppercase leading-none tracking-[0.2em] text-[var(--face)] backdrop-blur-xl"
            style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--crema) 16%, transparent)", clipPath: "inset(-1px -1px 1px -1px)" }}
          >
            Ver carrito
          </span>
          <m.button
            type="button"
            onClick={openCart}
            aria-label={`Ver carrito — ${shown.count} productos`}
            data-testid="cart-float"
            // "Vidrio" in the ink colours (client's pick): square, the near-black of the announcement strip but translucent over a blur
            className="relative flex cursor-pointer items-center gap-3 bg-[color-mix(in_oklab,var(--ink)_72%,transparent)] px-4 py-3 text-[var(--crema)] backdrop-blur-xl [font-variant-numeric:lining-nums]"
            style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--crema) 16%, transparent), 0 18px 34px -14px rgba(30,15,34,0.55)" }}
          >
            {/* A flash of light that blooms behind the bag when something was added (pale gold, brief, once) */}
            {flash > 0 && !reduce && (
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <m.span
                  key={flash}
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(circle at 24% 50%, color-mix(in oklab, var(--dorado-soft) 88%, white) 0%, transparent 60%)" }}
                  initial={{ opacity: 0.95, transform: "scale(0.4)" }}
                  animate={{ opacity: 0, transform: "scale(1.8)" }}
                  transition={{ duration: 0.7, ease: OUT }}
                />
              </span>
            )}

            {/* The bag and its count in parentheses, like the header's */}
            <span className="relative flex items-center gap-1.5">
              <ShoppingBag className="h-5 w-5 text-[var(--crema)]" />
              <span className="flex items-center text-[15px] font-semibold leading-none">
                (<Roll value={shown.count} />)
              </span>
            </span>

            <span aria-hidden className="relative h-6 w-px bg-[var(--crema)]/25" />

            <span className="relative text-[15px] font-semibold leading-none">
              <Roll value={shown.total}>{formatCOP(shown.total)}</Roll>
            </span>
          </m.button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
