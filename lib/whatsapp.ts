import type { Product } from "./products"
import { VENUES } from "./site"
import { formatCOP } from "./utils"

export interface CartLineItem {
  product: Product
  variant?: string
  qty: number
}

/** A wa.me link with the message already written. The store and the spa each have their own WhatsApp number (`VENUES`): the store's is the default. */
export function waLink(message: string, venue: "cosmetics" | "spa" = "cosmetics"): string {
  return `https://wa.me/${VENUES[venue].whatsapp}?text=${encodeURIComponent(message)}`
}

export const WA_DEFAULT = waLink(
  "Hola Queens! Me gustaría recibir información sobre sus productos.",
)

export const WA_VISIT = waLink(
  "Hola Queens! Quiero visitar la tienda en Unicentro Palmira, tienen disponibilidad?",
)

export const WA_NEWS = waLink(
  "Hola Queens! Quiero recibir novedades, lanzamientos y ofertas.",
)

export const WA_ADVICE = waLink(
  "Hola Queens! Me gustaría una asesoría personalizada de productos.",
)

export const WA_SPA = waLink(
  "Hola Queens Spa! Quiero reservar una cita, ¿qué horarios tienen disponibles?",
  "spa",
)

/** The spa's floating button and footer: a general question, not a booking. */
export const WA_SPA_INFO = waLink(
  "Hola Queens Spa! Me gustaría recibir información sobre sus servicios.",
  "spa",
)

/** The legal pages' channel for requests, complaints and data requests (peticiones, quejas, reclamos, habeas data): one per venue. */
export const WA_REQUEST = waLink(
  "Hola Queens! Quiero hacer una solicitud.",
)
export const WA_REQUEST_SPA = waLink(
  "Hola Queens Spa! Quiero hacer una solicitud.",
  "spa",
)

export interface BookingRequest {
  name: string
  phone?: string
  service: string
  /** Already written out, e.g. "$ 25.000" or "desde $ 100.000". */
  price?: string
  /** Already written out for a person, e.g. "lunes, 20 de octubre". */
  date: string
  time?: string
  notes?: string
}

/** The message the spa's booking form sends: everything the spa needs to answer with a time, in one go. */
export function buildBookingMessage(r: BookingRequest): string {
  const lines = [
    "Hola Queens Spa! Quiero agendar una cita:",
    "",
    `• Nombre: ${r.name}`,
    ...(r.phone ? [`• Teléfono: ${r.phone}`] : []),
    `• Servicio: ${r.service}${r.price ? ` (${r.price})` : ""}`,
    `• Fecha: ${r.date}`,
  ]
  if (r.time) lines.push(`• Hora preferida: ${r.time}`)
  if (r.notes) lines.push(`• Detalles: ${r.notes}`)
  lines.push("", "¿Tienen disponibilidad?")
  return lines.join("\n")
}

export function spaBookingLink(service: string): string {
  return waLink(`Hola Queens Spa! Quiero reservar: ${service}. ¿Qué horarios tienen disponibles?`, "spa")
}

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
