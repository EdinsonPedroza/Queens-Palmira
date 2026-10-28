/*
 * Shared brand + navigation data for the three faces of the site:
 *   /     → the store at Unicentro: the home. Its hero has the two doors, the catalog (this same page) and the spa
 *   /spa  → the spa in Alameda (Calle 69C), inside the same domain (queenscosmeticscol.com)
 * The two personalities are separate venues, so each carries its own address,
 * hours and map pin. Nothing else should hardcode them.
 */

import { CATEGORIES, type ProductCategory } from "@/lib/categories"

export type Face = "about" | "cosmetics" | "spa"

/** Contact details both venues share. Each venue has its own WhatsApp number (see `VENUES.<venue>.phone`). */
export const BUSINESS = {
  instagram: "@queenscosmeticss",
  instagramUrl: "https://www.instagram.com/queenscosmeticss/",
} as const

/**
 * Who sells, as Colombian law asks every online shop to say it (Ley 1480 de 2011, art. 50: name or razón social, NIT, an address for legal notices, phone and
 * e-mail) and as the data policy must name its "responsable" (Decreto 1074 de 2015). `holder`, `nit` and `email` are still missing (the client has not sent them):
 * while they are empty /terminos and /privacidad leave them out. Fill them in here and both pages pick them up.
 */
export const LEGAL: { holder: string; nit: string; email: string; updated: string; sic: string } = {
  /** Razón social of the company, or the owner's full name if Queens is registered as a persona natural. */
  holder: "",
  nit: "",
  email: "",
  /** The day the current terms and privacy policy took effect (both pages show it). */
  updated: "28 de octubre de 2026",
  /** The consumer-protection authority: every online shop must link to it visibly (Ley 1480 de 2011, art. 50, parágrafo). */
  sic: "https://www.sic.gov.co",
}

export interface Venue {
  name: string
  /** Street line, as it should read on the site. */
  address: string
  /** City / region line under the address. */
  region: string
  /** The venue's own WhatsApp number as it reads on the site, and the same digits (country code first) for wa.me links. */
  phone: string
  whatsapp: string
  hours: string[]
  hoursShort: string
  /** The booking rule that differentiates the two venues. */
  note: string
  /** The short line the portal hero reveals when this side is hovered, and the button that goes with it. */
  service: string
  serviceCta: string
  /** The short line under the title on the portal, always on screen. `service` is the longer one that appears on hover. */
  portalIntro: string
  href: string
  gmaps: string
  /** The Google Maps view (free embed, no API key) shown in the location section. */
  embed: string
  /** Pin + dot color, so the two venues stay told apart on a shared map. */
  accent: string
}

export const VENUES: Record<"cosmetics" | "spa", Venue> = {
  cosmetics: {
    name: "Queens Cosmetics",
    address: "Local 1-28, Unicentro Palmira",
    region: "Palmira, Valle del Cauca",
    phone: "+57 314 867 7230",
    whatsapp: "573148677230",
    hours: ["Lunes a Domingo", "10:00 AM – 8:00 PM"],
    hoursShort: "Lun a Dom · 10 AM – 8 PM",
    note: "Sin cita · Llega y prueba",
    portalIntro: "Maquillaje, skincare y cuidado capilar.",
    service:
      "Maquillaje, skincare, esmaltes y línea capilar de marcas originales. Te asesoramos con calma para que encuentres justo lo que buscas.",
    serviceCta: "Ver más",
    href: "/",
    gmaps: "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA",
    // The store's pin comes from the owner's real Google link, so the embed points at those exact coordinates (with a label).
    embed: "https://www.google.com/maps?q=3.5400896,-76.310776(Queens+Cosmetics)&z=17&hl=es&output=embed",
    accent: "#7a5d7d",
  },
  spa: {
    name: "Queens Spa",
    address: "Calle 69C #26-62, Alameda",
    region: "Palmira, Valle del Cauca",
    phone: "+57 310 387 9484",
    whatsapp: "573103879484",
    hours: ["Lunes a Domingo", "Con cita previa"],
    hoursShort: "Lun a Dom · con cita",
    note: "Con cita previa",
    service:
      "Manicure y pedicure, esmaltado semipermanente, uñas en gel y acrílico, siempre con cita previa. Un espacio tranquilo para que tus manos y pies salgan impecables.",
    serviceCta: "Ver más",
    portalIntro: "Cuidamos cada detalle de tus manos.",
    href: "/spa",
    // A search URL, so Google resolves the house number on its side: we have no exact coordinates for the spa (and so no `geo` in the JSON-LD).
    gmaps: "https://www.google.com/maps/search/?api=1&query=Calle+69C+%2326-62%2C+Alameda%2C+Palmira%2C+Valle+del+Cauca",
    // By address, like the "Cómo llegar" link.
    embed: "https://www.google.com/maps?q=Calle+69C+%2326-62,+Alameda,+Palmira,+Valle+del+Cauca&z=17&hl=es&output=embed",
    accent: "#BCA157",
  },
}

/**
 * Props for links between the store and the spa. They used to open in a new tab (two separate faces behind a portal); now the spa is just a section
 * of the same site (`/spa`), so every internal link stays in the current tab. Kept as a function so the callers do not change.
 */
export function faceLinkProps(href: string): { target?: "_blank"; rel?: string } {
  void href
  return {}
}

export interface NavLink {
  href: string
  label: string
  /** A product category: the link scrolls to the catalog and opens that category (see CATEGORY_EVENT). */
  category?: ProductCategory
}

/** Fired by the navbar's category links; the catalog listens and switches tab. detail = the category id. */
export const CATEGORY_EVENT = "queens:category"
/** Fired by the catalog whenever its open category changes (and once on mount); the navbar marks that link. */
export const CATEGORY_ACTIVE_EVENT = "queens:category-active"
/** The catalog's search + sort row: where the category links scroll to, so the products are right below. */
export const CATALOG_FILTERS_ID = "catalogo-filtros"
/** Fired by the navbar's search box with the text typed (detail: string); the catalog filters across ALL categories. */
export const SEARCH_EVENT = "queens:search"
/** Fired by the catalog whenever its search text changes (cleared on a category change, "Limpiar", ...); the navbar mirrors it. */
export const SEARCH_ACTIVE_EVENT = "queens:search-active"

/** The strip above the store's header. Two lengths: the long one from sm up, the short one on phones. */
/** Free shipping from this purchase total, in COP: the strip's text and the cart's progress bar both come from it. */
export const FREE_SHIPPING_MIN = 150_000
export const FREE_SHIPPING_LABEL = "$" + String(FREE_SHIPPING_MIN).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
// "desde", not "mayores a": the cart grants it at exactly the minimum (>=), and a promotion must say what it really does (Ley 1480 de 2011, art. 33)
export const ANNOUNCEMENT = {
  long: `Envíos gratis en compras desde ${FREE_SHIPPING_LABEL} COP · Palmira, Valle`,
  short: `Envíos gratis en compras desde ${FREE_SHIPPING_LABEL} · Palmira`,
}

/** The same strip on the spa: it has no shipping, so it says how the spa works (by appointment) and where it is. */
export const ANNOUNCEMENT_SPA = {
  long: `Atendemos con cita previa · Lun a Dom · ${VENUES.spa.address}, Palmira`,
  short: `Con cita previa · ${VENUES.spa.address} · Palmira`,
}

/** And on "Quiénes somos": the two houses. */
export const ANNOUNCEMENT_ABOUT = {
  long: `Dos casas en Palmira · Tienda: ${VENUES.cosmetics.address} · Spa: ${VENUES.spa.address}`,
  short: "Dos casas en Palmira · Tienda y spa",
}

export const NAV_LINKS: Record<Face, NavLink[]> = {
  about: [
    { href: "/", label: "Inicio" },
    { href: "/#catalogo", label: "Catálogo" },
    { href: "/spa", label: "Spa" },
    { href: "/#ubicacion", label: "Ubicación" },
  ],
  // The store's header: its product categories, then Galería and Ubicación (client request), then the other face. Nine links
  // do not fit side by side below xl, so the navbar swaps to the hamburger menu under 1280 px on this face.
  cosmetics: [
    ...CATEGORIES.map((c) => ({ href: "#catalogo", label: c.label, category: c.id })),
    { href: "#galeria", label: "Conócenos" },
    { href: "#ubicacion", label: "Ubicación" },
    { href: "/spa", label: "Spa" },
  ],
  spa: [
    { href: "#servicios", label: "Servicios" },
    { href: "#agendar", label: "Agendar" },
    { href: "#testimonios-spa", label: "Experiencias" },
    { href: "#faq-spa", label: "Preguntas" },
    { href: "#ubicacion", label: "Ubicación" },
    { href: "/", label: "Cosmetics" },
  ],
}
