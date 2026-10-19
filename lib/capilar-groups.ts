import type { Product } from "./products"

/* Subcategorías de Línea Capilar (75 productos). Hoy solo las usa la vista previa temporal /cosmetics/capilar:
 * si el cliente las aprueba, lo mejor es un campo `group` explícito en cada producto de `lib/products.ts`
 * y borrar este deducido por nombre. Gana la primera regla que coincida. */
export type CapilarGroupId = "shampoo" | "tratamientos" | "tintes" | "decoloracion" | "peinado" | "accesorios"

export const CAPILAR_GROUPS: { id: CapilarGroupId; label: string; tagline: string }[] = [
  { id: "shampoo",      label: "Shampoo y acondicionador", tagline: "La limpieza de todos los días" },
  { id: "tratamientos", label: "Tratamientos",             tagline: "Mascarillas, ampolletas y anticaída" },
  { id: "tintes",       label: "Tintes",                   tagline: "Color con cobertura y brillo" },
  { id: "decoloracion", label: "Decolorantes y oxidantes", tagline: "Para aclarar y revelar" },
  { id: "peinado",      label: "Peinado",                  tagline: "Fijación, rizos y brillo" },
  { id: "accesorios",   label: "Accesorios y extensiones", tagline: "Cepillos, rulos y kanekalon" },
]

const RULES: { id: CapilarGroupId; re: RegExp }[] = [
  { id: "tintes",       re: /tinte|cubre canas|^color 1/i },
  { id: "decoloracion", re: /decolor|oxigenada|oxy cream|^recamier deco/i },
  { id: "peinado",      re: /laca|crema para peinar|espuma|encrespador|termoprotector/i },
  { id: "accesorios",   re: /cepillo|kanekalon|ganchos|ligas|rulos/i },
  { id: "shampoo",      re: /shampoo|acondicionador/i },
]

export function capilarGroup(p: Product): CapilarGroupId {
  const byName = RULES.find((r) => r.re.test(p.name))
  if (byName) return byName.id
  // "Salon In Liss Control", "Versatil Cebolla"… don't say "shampoo" in the name, but their description does ("Shampoo y acondicionador …")
  return /^shampoo/i.test(p.description) ? "shampoo" : "tratamientos"
}
