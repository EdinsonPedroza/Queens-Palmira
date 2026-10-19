import type { Product, ProductCategory } from "./products"
import { CAPILAR_GROUPS, capilarGroup } from "./capilar-groups"

/*
 * Subcategories of every product category: the "Índice" the catalog shows to the left of the grid (client request: first Línea Capilar, then "haz lo mismo
 * con los demás"). Deduced from the product name (and its description when the name is not enough); the first rule that matches wins. The rules were
 * written against the real catalog and every product lands in exactly one group (see the counts in CLAUDE.md). If a new product does not fit a rule, it falls
 * in the last, general group of its category. For a definitive version, a `group` field on each product in lib/products.ts would replace these rules.
 */
export interface Subcategory {
  id: string
  label: string
  tagline: string
}

export const SUBCATEGORIES: Partial<Record<ProductCategory, Subcategory[]>> = {
  labiales: [
    { id: "liquidos", label: "Líquidos y tintas", tagline: "Color intenso que no se corre" },
    { id: "barra",    label: "En barra",          tagline: "El clásico de siempre" },
    { id: "gloss",    label: "Gloss y brillos",   tagline: "Labios jugosos y brillantes" },
  ],
  rostro: [
    { id: "bases",       label: "Bases",                  tagline: "La piel perfecta, a tu medida" },
    { id: "correctores", label: "Correctores",            tagline: "Adiós ojeras e imperfecciones" },
    { id: "polvos",      label: "Polvos",                 tagline: "Acabado sedoso que dura" },
    { id: "rubor",       label: "Rubor",                  tagline: "Mejillas con vida" },
    { id: "contorno",    label: "Contorno e iluminador",  tagline: "Luz y definición" },
    { id: "accesorios",  label: "Fijador y accesorios",   tagline: "Para aplicar y fijar" },
  ],
  ojos: [
    { id: "pestaninas", label: "Pestañinas",           tagline: "Volumen y curvatura" },
    { id: "sombras",    label: "Sombras y brochas",    tagline: "Mil miradas en una paleta" },
    { id: "delineador", label: "Delineadores",         tagline: "Trazos precisos" },
    { id: "cejas",      label: "Cejas",                tagline: "Cejas definidas y peinadas" },
    { id: "postizas",   label: "Pestañas y pegantes",  tagline: "Pestañas de impacto" },
  ],
  skincare: [
    { id: "facial",   label: "Cuidado facial",      tagline: "Tu ritual de reina" },
    { id: "solar",    label: "Solar y bronceado",   tagline: "Protege y broncea" },
    { id: "cuerpo",   label: "Cuerpo y depilación", tagline: "Piel suave de pies a cabeza" },
    { id: "barberia", label: "Barbería",            tagline: "Para el cuidado de él" },
  ],
  unas: [
    { id: "esmaltes",   label: "Esmaltes",    tagline: "Color en tus manos" },
    { id: "removedores", label: "Removedores", tagline: "Para empezar de cero" },
    { id: "cuticula",   label: "Cutículas",   tagline: "Uñas sanas y cuidadas" },
  ],
  capilar: CAPILAR_GROUPS,
}

/** Rules per category, in order. The last group of the list is the fallback. */
const RULES: Partial<Record<ProductCategory, { id: string; re: RegExp; on?: "name" | "all" }[]>> = {
  labiales: [
    { id: "gloss", re: /gloss|brillo/i, on: "all" },
    { id: "barra", re: /barra/i, on: "all" },
  ],
  rostro: [
    { id: "contorno",   re: /ilumin|highlighter|hadas|contorno|bronzer/i },
    { id: "rubor",      re: /rubor|blush/i },
    { id: "polvos",     re: /^polvo/i },
    { id: "accesorios", re: /fijador|blender|brocha|kit/i },
    { id: "bases",      re: /^base/i },
    { id: "correctores", re: /^corrector/i },
  ],
  ojos: [
    { id: "pestaninas", re: /pesta[ñn]ina/i },
    { id: "postizas",   re: /pesta[ñn]as|pestana|pegante/i },
    { id: "delineador", re: /delineador|retr[áa]ctil/i },
    { id: "cejas",      re: /cejas|henna|pomada|perfilador/i },
  ],
  skincare: [
    { id: "barberia", re: /barber/i },
    { id: "solar",    re: /solar|bronceador/i },
    { id: "cuerpo",   re: /antistr|depilatoria/i },
  ],
  unas: [
    { id: "cuticula",    re: /cut[ií]cula/i },
    { id: "removedores", re: /removedor/i },
  ],
}

/** The subcategory id of a product, or undefined when its category has none. */
export function subcategoryOf(p: Product): string | undefined {
  if (p.category === "capilar") return capilarGroup(p)
  const defs = SUBCATEGORIES[p.category]
  if (!defs) return undefined
  const hit = RULES[p.category]?.find((r) => r.re.test(r.on === "all" ? `${p.name} ${p.description}` : p.name))
  if (hit) return hit.id
  // Fallback: the groups that have no rule of their own are the default ones (líquidos, facial, esmaltes, sombras, …)
  const withRule = new Set(RULES[p.category]?.map((r) => r.id))
  return defs.find((d) => !withRule.has(d.id))?.id ?? defs[defs.length - 1].id
}
