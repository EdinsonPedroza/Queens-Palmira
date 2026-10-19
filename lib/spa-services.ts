/* Placeholder menu of a nail spa — replace with the real services, durations and (if wanted) prices. Shared by the menu (spa-services.tsx) and the booking
 * form (spa-booking.tsx), so a service is written once. */
export interface SpaService {
  name: string
  desc: string
  duration: string
}

export const SPA_SERVICES: SpaService[] = [
  { name: "Manicure tradicional", desc: "Limado, cutículas e hidratación, con esmaltado clásico.", duration: "40 min" },
  { name: "Manicure semipermanente", desc: "Esmaltado en gel que dura hasta tres semanas sin levantarse.", duration: "60 min" },
  { name: "Pedicure spa", desc: "Exfoliación, masaje y esmaltado para pies suaves y cuidados.", duration: "75 min" },
  { name: "Uñas en gel o acrílico", desc: "Extensión y forma a tu medida, natural o con diseño.", duration: "120 min" },
  { name: "Nail art y diseños", desc: "Francés, efecto espejo, piedras y todo lo que imagines.", duration: "desde 30 min" },
  { name: "Retiro y mantenimiento", desc: "Retiramos con cuidado y te dejamos las uñas sanas.", duration: "45 min" },
]
