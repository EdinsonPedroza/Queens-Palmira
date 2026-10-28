import { formatCOP } from "@/lib/utils"

/* The spa's real menu and prices (sent by the client, 28 Oct 2026). Shared by the menu (spa-services.tsx) and the booking form (spa-booking.tsx), so a service is written once.
 * The menu is drawn as six photo cards (`SPA_GROUPS`); each card lists the services of its group (`group`) with their prices.
 * `photo` is the picture of the card (shown whole when it is open) and `focus` the part of it that peeks out of the closed card (an object-position).
 * The spa has only four nail photos so far, so the removal card repeats the one of the manicure card: replace them with real photos when there are some. */

export type SpaGroupId = "manicure" | "pedicure" | "softgel" | "gel" | "acrilico" | "retiro"

export interface SpaService {
  /** As it reads in the booking form and in the WhatsApp message. */
  name: string
  /** Shorter, for the row inside its card (the card's title already says "Manicure"). */
  label?: string
  /** COP. */
  price: number
  /** "Desde": the final price changes with the design. */
  from?: boolean
  group: SpaGroupId
}

export interface SpaGroup {
  id: SpaGroupId
  /** Small label on the card (the kind of service), like "Signature" on the client's reference. */
  tag: string
  title: string
  /** One line under the title when the card has a single service. */
  note?: string
  /** The question the picker window asks (only the cards with several services open one). */
  ask?: string
  photo: string
  focus: string
  /** Natural size of the photo, so it can be drawn whole (no crop) at its own proportion. */
  width: number
  height: number
}

// "Retiro acrílico" came as "20.0000" (a typo): taken as $20.000, like the other removal ($15.000).
export const SPA_SERVICES: SpaService[] = [
  { group: "manicure", name: "Manicure tradicional", label: "Tradicional", price: 25_000 },
  { group: "manicure", name: "Manicure gel evolution", label: "Gel evolution", price: 30_000 },
  { group: "manicure", name: "Manicure semipermanente", label: "Semipermanente", price: 45_000 },
  { group: "pedicure", name: "Pedicure tradicional", label: "Tradicional", price: 25_000 },
  { group: "pedicure", name: "Pedicure gel evolution", label: "Gel evolution", price: 30_000 },
  { group: "pedicure", name: "Pedicure semipermanente", label: "Semipermanente", price: 35_000 },
  { group: "softgel", name: "Manicure soft gel", price: 90_000 },
  { group: "gel", name: "Manicure gel (polygel o base rubber)", price: 90_000 },
  { group: "acrilico", name: "Manicure en acrílico", price: 100_000, from: true },
  { group: "retiro", name: "Retiro acrílico", label: "Acrílico", price: 20_000 },
  { group: "retiro", name: "Retiro semipermanente", label: "Semipermanente", price: 15_000 },
]

/** The cards of the menu, in reading order (the photos keep the proportions the three-per-row layout was built for). */
export const SPA_GROUPS: SpaGroup[] = [
  { id: "manicure", tag: "Manos", title: "Manicure", ask: "¿Qué manicure quieres?", photo: "/images/spa/nails-file.webp", width: 1400, height: 2097, focus: "45% 22%" },
  { id: "pedicure", tag: "Pies", title: "Pedicure", ask: "¿Qué pedicure quieres?", photo: "/images/spa/oil.webp", width: 1600, height: 1067, focus: "72% 40%" },
  { id: "softgel", tag: "Soft gel", title: "Manicure soft gel", photo: "/images/spa/nails-gold.webp", width: 1100, height: 1343, focus: "62% 40%" },
  { id: "gel", tag: "Gel", title: "Manicure en gel", note: "Polygel o base rubber.", photo: "/images/spa/nails-french.webp", width: 813, height: 1146, focus: "20% 70%" },
  { id: "acrilico", tag: "Acrílico", title: "Manicure en acrílico", note: "El precio varía según el diseño.", photo: "/images/spa/hero-manicura-1373.webp", width: 1373, height: 1146, focus: "80% 25%" },
  { id: "retiro", tag: "Cuidado", title: "Retiros", ask: "¿Qué retiro necesitas?", photo: "/images/spa/nails-file.webp", width: 1400, height: 2097, focus: "35% 88%" },
]

/** "$ 25.000", or "Desde $ 100.000" when the price depends on the design. */
export function priceLabel(s: SpaService): string {
  return `${s.from ? "Desde " : ""}${formatCOP(s.price)}`
}

/** The services of one card. */
export function servicesOf(group: SpaGroupId): SpaService[] {
  return SPA_SERVICES.filter((s) => s.group === group)
}
