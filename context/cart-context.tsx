"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react"
import type { Product } from "@/lib/products"
import { PRODUCTS } from "@/lib/products"

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
      return { items: action.items }

    case "add": {
      const key = itemKey(action.productId, action.variant)
      const existing = state.items.find(
        (i) => itemKey(i.productId, i.variant) === key,
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            itemKey(i.productId, i.variant) === key
              ? { ...i, qty: i.qty + 1 }
              : i,
          ),
        }
      }
      return {
        items: [
          ...state.items,
          { productId: action.productId, variant: action.variant, qty: 1 },
        ],
      }
    }

    case "remove":
      return { items: state.items.filter((i) => itemKey(i.productId, i.variant) !== action.key) }

    case "set-qty": {
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => itemKey(i.productId, i.variant) !== action.key) }
      }
      return {
        items: state.items.map((i) =>
          itemKey(i.productId, i.variant) === action.key ? { ...i, qty: action.qty } : i,
        ),
      }
    }

    case "clear":
      return { items: [] }

    default:
      return state
  }
}

export interface CartLineExpanded {
  product: Product
  variant?: string
  qty: number
  key: string
}

interface CartContextValue {
  items: CartLineExpanded[]
  count: number
  total: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (productId: string, variant?: string) => void
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })
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

  // Lock body scroll when cart open
  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

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
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
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

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used inside CartProvider")
  return ctx
}
