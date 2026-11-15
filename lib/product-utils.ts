import type { Product } from "./products"

/*
 * Small helpers about the two things a product of the current catalog may lack: a photo and a price. They live apart from lib/products.ts on purpose:
 * the cart, its drawer and the add-ons need them and must not pull the whole catalog in just to ask "does this product have a photo?".
 */

/** Stand-in for a product that has no photo yet: the Queens isotype. `Photo` (product-card.tsx) draws it as a soft emblem, not as a product shot. */
export const NO_PHOTO = "/images/brand/isotipo-lila.webp"

export function hasPhoto(p: Pick<Product, "image">): boolean {
  return p.image !== NO_PHOTO
}

/** A product with a price: the only kind the cart can hold. The others (price `null`) say «Consultar precio» and write to WhatsApp. */
export type PricedProduct = Product & { price: number }

export function isPriced(p: Product): p is PricedProduct {
  return p.price !== null
}

/** The message that asks the store for the price of a product that has none yet. */
export function priceRequestMessage(name: string): string {
  return `Hola Queens! Quiero consultar el precio de: ${name}.`
}
