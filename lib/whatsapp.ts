import type { Product } from "./products"
import { formatCOP } from "./utils"

export const WHATSAPP_NUMBER = "573148677230"

export interface CartLineItem {
  product: Product
  variant?: string
  qty: number
}

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WA_DEFAULT = waLink(
  "Hola Queens! Me gustaría recibir información sobre sus productos.",
)

export const WA_VISIT = waLink(
  "Hola Queens! Quiero visitar la tienda en Unicentro Palmira, tienen disponibilidad?",
)

export const WA_ADVICE = waLink(
  "Hola Queens! Me gustaría una asesoría personalizada de productos.",
)

export function buildOrderMessage(items: CartLineItem[]): string {
  if (items.length === 0) {
    return "Hola Queens! Quiero información sobre sus productos."
  }

  const lines = items.map(({ product, variant, qty }) => {
    const variantStr = variant ? ` (${variant})` : ""
    return `• ${qty}x ${product.name}${variantStr} — ${formatCOP(product.price * qty)}`
  })

  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  return [
    "Hola Queens! Quiero pedir:",
    "",
    ...lines,
    "",
    `*Total: ${formatCOP(total)}*`,
    "",
    "Gracias!",
  ].join("\n")
}
