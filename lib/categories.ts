/*
 * The six product categories. Kept apart from lib/products.ts on purpose: the navbar needs the labels on every
 * page, and importing products.ts would pull the whole 171-product catalog into pages that have no cart.
 */

export type ProductCategory =
  | "labiales"
  | "rostro"
  | "ojos"
  | "skincare"
  | "unas"
  | "capilar"

export const CATEGORIES: { id: ProductCategory; label: string; tagline: string }[] = [
  { id: "labiales",  label: "Labiales",       tagline: "Besos de seda y color" },
  { id: "rostro",    label: "Rostro",         tagline: "La base de tu belleza" },
  { id: "ojos",      label: "Ojos",           tagline: "Miradas que hipnotizan" },
  { id: "skincare",  label: "Skin Care",      tagline: "Tu ritual de reina" },
  { id: "unas",      label: "Uñas",           tagline: "Detalles que enamoran" },
  { id: "capilar",   label: "Línea Capilar",  tagline: "Cabello de reina" },
]
