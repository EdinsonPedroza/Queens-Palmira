import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { VENUES } from "@/lib/site"

const FAQS = [
  {
    q: "¿Necesito cita para los rituales del spa?",
    a: "Sí. Todos los rituales se atienden con cita previa para que tengas la cabina y el tiempo completo para ti. Escríbenos por WhatsApp y cuadramos el horario que te sirva.",
  },
  {
    q: "¿Dónde queda el spa?",
    a: `En ${VENUES.spa.address}, Palmira. Es una casa aparte de la tienda de cosméticos, que sigue en el Local 128 de Unicentro.`,
  },
  {
    q: "¿Cuánto dura cada ritual?",
    a: "Entre 45 y 90 minutos según el servicio. Cada ritual tiene su duración al lado del nombre en el menú. Te recomendamos llegar 10 minutos antes de tu cita.",
  },
  {
    q: "¿Qué pasa si no puedo asistir?",
    a: "Avísanos por WhatsApp con al menos 3 horas de anticipación y reprogramamos tu cita sin ningún costo.",
  },
  {
    q: "¿Puedo hacerme un facial si estoy embarazada?",
    a: "Varios de nuestros rituales son seguros durante el embarazo, pero adaptamos los productos y evitamos ciertos activos y masajes. Cuéntanos al reservar y te armamos la opción adecuada.",
  },
  {
    q: "¿Puedo combinar un ritual con compras en la tienda?",
    a: "¡Claro! En cabina te recomendamos la rutina para mantener el resultado en casa, y puedes pasar por la tienda en Unicentro a recoger los productos o pedírnoslos por WhatsApp.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Nequi, Daviplata, transferencia bancaria (Bancolombia, Davivienda), tarjeta y efectivo en el local.",
  },
]

export function SpaFAQ() {
  return (
    <section
      id="faq-spa"
      aria-labelledby="faq-spa-title"
      className="relative scroll-mt-6 overflow-hidden bg-noir-soft py-24 text-white md:scroll-mt-0 md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />

      <div className="relative mx-auto max-w-3xl px-6 md:px-10">
        <div className="mb-14 text-center md:mb-16">
          <p className="mb-5 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]">
            <span className="h-px w-10 bg-[var(--gold)]/60" />
            Antes de venir
            <span className="h-px w-10 bg-[var(--gold)]/60" />
          </p>
          <h2
            id="faq-spa-title"
            className="font-display uppercase leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 4rem)" }}
          >
            <span className="font-light">Lo que </span>
            <span className="font-bold shimmer-gold">preguntan.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`spa-item-${i}`} className="border-b border-white/10">
              <AccordionTrigger className="text-white hover:text-[var(--gold)]">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-white/60">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
