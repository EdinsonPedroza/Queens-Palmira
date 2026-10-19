"use client"

import { createContext, useContext } from "react"
import type { Product } from "@/lib/products"

/*
 * The cart's context and hooks, and nothing else. Keep this file free of runtime
 * imports from the catalog (`lib/products` is type-only here): the navbar imports
 * it on every page, and the state itself lives in `cart-provider.tsx`, which only
 * /cosmetics mounts.
 */

export interface CartLineExpanded {
  product: Product
  variant?: string
  qty: number
  key: string
}

export interface CartContextValue {
  items: CartLineExpanded[]
  count: number
  total: number
  isOpen: boolean
  /** The line that was just added (tick grows with every add); the cart uses it to flash and animate that row. */
  lastAdded: { key: string; isNew: boolean; tick: number } | null
  openCart: () => void
  closeCart: () => void
  addItem: (productId: string, variant?: string) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

/** For the pieces that only exist on the store page. Throws outside `CartProvider`. */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}

/** For shared chrome that renders on every page (the navbar): null where there is no cart. */
export function useOptionalCart() {
  return useContext(CartContext)
}
