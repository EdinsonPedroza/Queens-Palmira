"use client"

import { m, AnimatePresence, useAnimationControls } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { useEffect, useRef } from "react"
import { useCart } from "@/context/cart-context"

export function CartFloat() {
  const { count, total, openCart } = useCart()
  const controls = useAnimationControls()
  const prevCount = useRef(count)

  useEffect(() => {
    if (count > prevCount.current) {
      controls.start({
        scale:  [1, 1.32, 0.86, 1.12, 0.97, 1],
        rotate: [0, -6,   4,   -2,   1,   0],
        transition: {
          duration: 0.55,
          times:    [0, 0.16, 0.38, 0.6, 0.78, 1],
          ease: "easeOut",
        },
      })
    }
    prevCount.current = count
  }, [count, controls])

  return (
    <AnimatePresence>
      {count > 0 && (
        <m.div
          className="fixed bottom-24 right-5 z-50"
          initial={{ scale: 0, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 440, damping: 26 }}
        >
          <m.button
            type="button"
            onClick={openCart}
            animate={controls}
            whileHover={{ scale: 1.07, y: -3 }}
            whileTap={{ scale: 0.93 }}
            aria-label={`Ver carrito — ${count} productos`}
            data-testid="cart-float"
            className="relative flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--rose-hot) 0%, var(--gold-deep) 100%)",
              boxShadow: "0 8px 32px -8px rgba(255,105,180,0.65), 0 4px 16px -4px rgba(212,175,55,0.45), 0 0 0 1.5px rgba(255,255,255,0.2)",
            }}
          >
            {/* Shimmer continuo */}
            <span
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.18) 50%,transparent 60%)",
                backgroundSize: "200% 100%",
                animation: "shimmer-sweep 3s ease-in-out infinite",
              }}
            />

            {/* Icono + badge */}
            <span className="relative shrink-0">
              <ShoppingBag className="h-5 w-5 text-white" />
              <m.span
                key={count}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 700, damping: 18 }}
                className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black"
                style={{ color: "var(--rose-hot)" }}
              >
                {count}
              </m.span>
            </span>

            {/* Textos */}
            <span className="relative flex flex-col items-start leading-none gap-0.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/75">
                Mi carrito
              </span>
              <m.span
                key={total}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-black text-white"
              >
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                }).format(total)}
              </m.span>
            </span>
          </m.button>
        </m.div>
      )}
    </AnimatePresence>
  )
}
