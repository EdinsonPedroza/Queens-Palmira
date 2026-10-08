/*
 * Shared brand + navigation data for the three faces of the site:
 *   /          → portal: two doors, two addresses
 *   /cosmetics → Lado A, the store at Unicentro
 *   /spa       → Lado B, the spa on Carrera 25
 * The two personalities are separate venues, so each carries its own address,
 * hours and map pin. Nothing else should hardcode them.
 */

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
  tagline: string
  /** The short line the portal hero reveals when this side is hovered, and the button that goes with it. */
  service: string
  serviceCta: string
  href: string
  /** [lat, lon] for the Leaflet pin. */
  coords: [number, number]
  gmaps: string
  /** Pin + dot color, so the two venues stay told apart on a shared map. */
  accent: string
}

export const VENUES: Record<"cosmetics" | "spa", Venue> = {
  cosmetics: {
    name: "Queens Cosmetics",
    address: "Local 128, Unicentro Palmira",
    region: "Palmira, Valle del Cauca",
    hours: ["Lunes a Domingo", "10:00 AM – 8:00 PM"],
    hoursShort: "Lun a Dom · 10 AM – 8 PM",
    note: "Sin cita · Llega y prueba",
    tagline: "Maquillaje, skincare y cuidado capilar.",
    service:
      "Maquillaje, skincare, esmaltes y línea capilar de marcas originales. Te asesoramos con calma para que encuentres justo lo que buscas.",
    serviceCta: "Ver más",
    href: "/cosmetics",
    coords: [3.5400896, -76.310776],
    gmaps: "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA",
    accent: "#FF69B4",
  },
  spa: {
    name: "Queens Spa",
    address: "Cra 25 #11-23",
    region: "Palmira, Valle del Cauca",
    hours: ["Lunes a Domingo", "Con cita previa"],
    hoursShort: "Lun a Dom · con cita",
    note: "Con cita previa",
    tagline: "Faciales, masajes y rituales para desconectarte.",
    service:
      "Limpiezas faciales, masajes y rituales de cuidado, siempre con cita previa. Un espacio tranquilo para que te tomes un respiro.",
    serviceCta: "Ver más",
    href: "/spa",
    // Carrera 25 × Calle 11 per OpenStreetMap. A search URL is used for Google
    // Maps so it resolves the house number on Google's side, not ours.
    coords: [3.509948, -76.2984773],
    gmaps: "https://www.google.com/maps/search/?api=1&query=Carrera+25+%2311-23%2C+Palmira%2C+Valle+del+Cauca",
    accent: "#D4AF37",
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
  cosmetics: [
    { href: "#catalogo", label: "Catálogo" },
    { href: "#catalogo-digital", label: "Cat. Virtual" },
    { href: "#por-que", label: "Por qué Queens" },
    { href: "#galeria", label: "Galería" },
    { href: "#ubicacion", label: "Ubicación" },
    { href: "/spa", label: "Spa" },
  ],
  spa: [
    { href: "#rituales", label: "Rituales" },
    { href: "#galeria-spa", label: "Galería" },
    { href: "#testimonios-spa", label: "Experiencias" },
    { href: "#faq-spa", label: "Preguntas" },
    { href: "#ubicacion", label: "Ubicación" },
    { href: "/cosmetics", label: "Cosmetics" },
  ],
}
