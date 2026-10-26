/* Placeholder menu of a nail spa — replace with the real services, durations and (if wanted) prices. Shared by the menu (spa-services.tsx) and the booking
 * form (spa-booking.tsx), so a service is written once.
 * `photo` is the picture of the service in the menu (shown whole when its panel is open) and `focus` the part of it that peeks out of the closed panel (an object-position).
 * The spa has only four nail photos so far, so "Retiro y mantenimiento" repeats the one of "Manicure tradicional" and "Pedicure spa" uses a hands-and-oil photo:
 * replace them with the real photo of each service when there is one. */
export interface SpaService {
  name: string
  desc: string
  duration: string
  /** small label on the card (the kind of service), like "Signature" on the client's reference */
  tag: string
  photo: string
  focus: string
  /** natural size of the photo, so it can be drawn whole (no crop) at its own proportion */
  width: number
  height: number
}

export const SPA_SERVICES: SpaService[] = [
  { name: "Manicure tradicional", tag: "Manicure", desc: "Limado, cutículas e hidratación, con esmaltado clásico.", duration: "40 min", photo: "/images/spa/nails-file.webp", width: 1400, height: 2097, focus: "45% 22%" },
  { name: "Manicure semipermanente", tag: "Manicure", desc: "Esmaltado en gel que dura hasta tres semanas sin levantarse.", duration: "60 min", photo: "/images/spa/nails-gold.webp", width: 1100, height: 1343, focus: "62% 40%" },
  { name: "Pedicure spa", tag: "Pedicure", desc: "Exfoliación, masaje y esmaltado para pies suaves y cuidados.", duration: "75 min", photo: "/images/spa/oil.webp", width: 1600, height: 1067, focus: "72% 40%" },
  { name: "Uñas en gel o acrílico", tag: "Uñas", desc: "Extensión y forma a tu medida, natural o con diseño.", duration: "120 min", photo: "/images/spa/nails-french.webp", width: 813, height: 1146, focus: "20% 70%" },
  { name: "Nail art y diseños", tag: "Diseño", desc: "Francés, efecto espejo, piedras y todo lo que imagines.", duration: "desde 30 min", photo: "/images/spa/hero-manicura-1373.webp", width: 1373, height: 1146, focus: "80% 25%" },
  { name: "Retiro y mantenimiento", tag: "Cuidado", desc: "Retiramos con cuidado y te dejamos las uñas sanas.", duration: "45 min", photo: "/images/spa/nails-file.webp", width: 1400, height: 2097, focus: "35% 88%" },
]
