import { PRODUCTS, type Product, type ProductCategory } from "./products"
import { capilarGroup } from "./capilar-groups"

/*
 * "¿Un último antojo?": small, cheap things that go with what is already in the cart, offered at the bottom of the cart drawer.
 *
 * Only products that can be added with ONE tap are offered (no tone to choose), under ADD_ON_MAX_PRICE. Professional hair colour and
 * barber products are left out: they are not an impulse buy. The ranking is a plain affinity table (what goes with what), then the cheapest first.
 */
export const ADD_ON_MAX_PRICE = 16000

/** For each category in the cart, how well each category pairs with it (higher = better). */
const AFFINITY: Record<ProductCategory, Partial<Record<ProductCategory, number>>> = {
  labiales: { ojos: 3, rostro: 2, unas: 1, skincare: 1 },
  rostro:   { ojos: 3, labiales: 2, skincare: 1 },
  ojos:     { labiales: 3, rostro: 2 },
  skincare: { rostro: 2, labiales: 1, unas: 1, skincare: 1 },
  unas:     { unas: 3, skincare: 1 },
  capilar:  { capilar: 3, skincare: 1 },
}

const NOT_AN_IMPULSE = /barber|afeitar|talco|depilatoria|decolor|oxigenada|oxy cream|recamier deco/i

function isAddOn(p: Product): boolean {
  if (p.price > ADD_ON_MAX_PRICE || (p.variants?.length ?? 0) > 1) return false
  if (NOT_AN_IMPULSE.test(p.name)) return false
  if (p.category === "capilar") {
    const g = capilarGroup(p)
    if (g === "tintes" || g === "decoloracion") return false
  }
  return true
}

/** Up to `limit` suggestions for a cart, never repeating a product already in it and never more than two from one category. */
export function getAddOns(inCart: { product: Product }[], limit = 6): Product[] {
  if (inCart.length === 0) return []
  const have = new Set(inCart.map((i) => i.product.id))
  const cats = inCart.map((i) => i.product.category)
  const scored = PRODUCTS.filter((p) => isAddOn(p) && !have.has(p.id))
    .map((p) => ({ p, score: cats.reduce((s, c) => s + (AFFINITY[c][p.category] ?? 0), 0) }))
    // best pairing first, then the cheapest
    .sort((a, b) => b.score - a.score || a.p.price - b.p.price)

  const out: Product[] = []
  const perCategory: Partial<Record<ProductCategory, number>> = {}
  for (const { p } of scored) {
    if ((perCategory[p.category] ?? 0) >= 2) continue
    perCategory[p.category] = (perCategory[p.category] ?? 0) + 1
    out.push(p)
    if (out.length === limit) break
  }
  return out
}
