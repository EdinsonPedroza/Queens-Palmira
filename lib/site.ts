/*
 * Shared brand + navigation data for the three faces of the site:
 *   /          → portal: two doors, two addresses
 *   /cosmetics → Lado A, the store at Unicentro
 *   /spa       → Lado B, the spa on Carrera 25
 * The two personalities are separate venues, so each carries its own address,
 * hours and map pin. Nothing else should hardcode them.
 */

import { CATEGORIES, type ProductCategory } from "@/lib/categories"

export type Face = "portal" | "about" | "cosmetics" | "spa"

/** Contact details both venues share. */
export const BUSINESS = {
  phoneDisplay: "+57 314 867 7230",
  instagram: "@queenscosmeticss",
  instagramUrl: "https://www.instagram.com/queenscosmeticss/",
} as const

export interface Venue {
  name: string
  /** Street line, as it should read on the site. */
  address: string
  /** City / region line under the address. */
  region: string
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
  /** [lat, lon] for the Leaflet pin. */
  coords: [number, number]
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
    hours: ["Lunes a Domingo", "10:00 AM – 8:00 PM"],
    hoursShort: "Lun a Dom · 10 AM – 8 PM",
    note: "Sin cita · Llega y prueba",
    portalIntro: "Maquillaje, skincare y cuidado capilar.",
    service:
      "Maquillaje, skincare, esmaltes y línea capilar de marcas originales. Te asesoramos con calma para que encuentres justo lo que buscas.",
    serviceCta: "Ver más",
    href: "/cosmetics",
    coords: [3.5400896, -76.310776],
    gmaps: "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA",
    // The store's pin comes from the owner's real Google link, so the embed points at those exact coordinates (with a label).
    embed: "https://www.google.com/maps?q=3.5400896,-76.310776(Queens+Cosmetics)&z=17&hl=es&output=embed",
    accent: "#7a5d7d",
  },
  spa: {
    name: "Queens Spa",
    address: "Cra 25 #11-23",
    region: "Palmira, Valle del Cauca",
    hours: ["Lunes a Domingo", "Con cita previa"],
    hoursShort: "Lun a Dom · con cita",
    note: "Con cita previa",
    service:
      "Manicure y pedicure spa, esmaltado semipermanente, uñas en gel y acrílico y nail art, siempre con cita previa. Un espacio tranquilo para que tus manos y pies salgan impecables.",
    serviceCta: "Ver más",
    portalIntro: "Cuidamos cada detalle de tus manos.",
    href: "/spa",
    // Carrera 25 × Calle 11 per OpenStreetMap. A search URL is used for Google
    // Maps so it resolves the house number on Google's side, not ours.
    coords: [3.509948, -76.2984773],
    gmaps: "https://www.google.com/maps/search/?api=1&query=Carrera+25+%2311-23%2C+Palmira%2C+Valle+del+Cauca",
    // By address, like the "Cómo llegar" link: Google resolves the house number on its side (our coordinates for the spa are approximate).
    embed: "https://www.google.com/maps?q=Carrera+25+%2311-23,+Palmira,+Valle+del+Cauca&z=17&hl=es&output=embed",
    accent: "#BCA157",
  },
}

/**
 * Props for links that cross into one of the two personalities: /spa and
 * /cosmetics open in a new tab. Everything else — the portal, "Quiénes somos",
 * the legal pages, in-page anchors — stays in the current tab.
 */
export function faceLinkProps(href: string): { target?: "_blank"; rel?: string } {
  const isPersonality = /^\/(spa|cosmetics)(?:[#/?]|$)/.test(href)
  return isPersonality ? { target: "_blank", rel: "noopener noreferrer" } : {}
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
const MIN_LABEL = "$" + String(FREE_SHIPPING_MIN).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
export const ANNOUNCEMENT = {
  long: `Envíos gratis en compras mayores a ${MIN_LABEL} COP · Palmira, Valle`,
  short: `Envíos gratis en compras mayores a ${MIN_LABEL} · Palmira`,
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
  // The portal header is deliberately bare: the two doors are the hero itself.
  portal: [
    { href: "/quienes-somos", label: "Quiénes somos" },
    { href: "#ubicaciones", label: "Ubicaciones" },
  ],
  about: [
    { href: "/", label: "Inicio" },
    { href: "/cosmetics", label: "Cosmetics" },
    { href: "/spa", label: "Spa" },
    { href: "/#ubicaciones", label: "Ubicaciones" },
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
    { href: "/cosmetics", label: "Cosmetics" },
  ],
}
