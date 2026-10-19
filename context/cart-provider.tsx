"use client"

import { useEffect, useMemo, useReducer, useState, type ReactNode } from "react"
import { PRODUCTS } from "@/lib/products"
import { CartContext, type CartContextValue, type CartLineExpanded } from "./cart-context"

/*
 * The cart's state. It lives here, apart from the context and its hooks, because it
 * pulls in the whole product catalog: only /cosmetics mounts it, so the portal, the
 * spa and the rest never download the catalog.
 */

const STORAGE_KEY = "queens-cart-v2"

// Unique key for a cart line: productId alone OR productId--variant
function itemKey(productId: string, variant?: string): string {
  return variant ? `${productId}--${variant}` : productId
}

interface CartItem {
  productId: string
  variant?: string
  qty: number
}

interface CartState {
  items: CartItem[]
  last: { key: string; isNew: boolean; tick: number } | null
}

type CartAction =
  | { type: "add";     productId: string; variant?: string }
  | { type: "remove";  key: string }
  | { type: "set-qty"; key: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, items: action.items }

    case "add": {
      const key = itemKey(action.productId, action.variant)
      const existing = state.items.find(
        (i) => itemKey(i.productId, i.variant) === key,
      )
      const last = { key, isNew: !existing, tick: (state.last?.tick ?? 0) + 1 }
      if (existing) {
        return {
          last,
          items: state.items.map((i) =>
            itemKey(i.productId, i.variant) === key
              ? { ...i, qty: i.qty + 1 }
              : i,
          ),
        }
      }
      return {
        last,
        items: [
          ...state.items,
          { productId: action.productId, variant: action.variant, qty: 1 },
        ],
      }
    }

    case "remove":
      return { ...state, items: state.items.filter((i) => itemKey(i.productId, i.variant) !== action.key) }

    case "set-qty": {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => itemKey(i.productId, i.variant) !== action.key) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          itemKey(i.productId, i.variant) === action.key ? { ...i, qty: action.qty } : i,
        ),
      }
    }

    case "clear":
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], last: null })
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) {
          dispatch({ type: "hydrate", items: parsed })
        }
      }
    } catch {
      /* ignore */
    }
    // Reading localStorage is only possible after mount, so this one cascading
    // render is unavoidable — it is what gates the persist effect below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      /* ignore */
    }
  }, [state.items, hydrated])

  // No scroll lock here: the cart is a Radix Dialog, which already locks the page
  // while it is open. A second, hand-rolled lock used to live in this provider and
  // it undid the intro screen's own lock on every mount.

  const value = useMemo<CartContextValue>(() => {
    const expanded: CartLineExpanded[] = state.items
      .flatMap((ci) => {
        const product = PRODUCTS.find((p) => p.id === ci.productId)
        if (!product) return []
        const line: CartLineExpanded = {
          product,
          qty: ci.qty,
          key: itemKey(ci.productId, ci.variant),
          ...(ci.variant !== undefined && { variant: ci.variant }),
        }
        return [line]
      })

    const count = expanded.reduce((s, i) => s + i.qty, 0)
    const total = expanded.reduce((s, i) => s + i.product.price * i.qty, 0)

    return {
      items: expanded,
      count,
      total,
      isOpen,
      lastAdded: state.last,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (productId, variant) => {
        dispatch({ type: "add", productId, variant })
      },
      removeItem: (key) => dispatch({ type: "remove", key }),
      setQty: (key, qty) => dispatch({ type: "set-qty", key, qty }),
      clear: () => dispatch({ type: "clear" }),
    }
  }, [state, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
