import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { VENUES } from "@/lib/site"

const FAQS = [
  {
    q: "¿Necesito cita para hacerme las uñas?",
    a: "Sí. Atendemos con cita previa para que tengas tu puesto y el tiempo completo para ti. Escríbenos por WhatsApp y cuadramos el horario que te sirva.",
  },
  {
    q: "¿Dónde queda el spa?",
    a: `En ${VENUES.spa.address}, Palmira. Es una casa aparte de la tienda de cosméticos, que sigue en el Local 1-28 de Unicentro.`,
  },
  {
    q: "¿Cuánto dura cada servicio?",
    a: "Entre 40 y 120 minutos según el servicio; el nail art puede sumar tiempo. Cada servicio tiene su duración al lado del nombre en el menú. Te recomendamos llegar 10 minutos antes de tu cita.",
  },
  {
    q: "¿Cuánto dura el esmaltado semipermanente?",
    a: "Entre dos y tres semanas, según cómo cuides tus manos. Al terminar te damos recomendaciones para que dure más.",
  },
  {
    q: "¿Puedo llevar un diseño que vi en una foto?",
    a: "¡Claro! Llévalo o envíanoslo por WhatsApp y te decimos cómo lo hacemos y cuánto tiempo toma.",
  },
  {
    q: "¿Retiran las uñas que me hice en otro lugar?",
    a: "Sí, hacemos el retiro con cuidado para no maltratar tu uña. Cuéntanos qué tienes puesto cuando reserves.",
  },
  {
    q: "¿Qué pasa si no puedo asistir?",
    a: "Avísanos por WhatsApp con al menos 3 horas de anticipación y reprogramamos tu cita sin ningún costo.",
  },
  {
    q: "¿Puedo combinar mi cita con compras en la tienda?",
    a: "¡Claro! Puedes pasar por la tienda en Unicentro por esmaltes y cuidado para mantener tus uñas en casa, o pedírnoslos por WhatsApp.",
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
      className="relative scroll-mt-[var(--nav-h)] bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 py-4 text-ink md:py-5"
    >
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        {/* The store's FAQ header: spaced-capitals eyebrow and a one-colour title */}
        <div className="mb-3 text-center md:mb-4">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">
            Antes de venir
          </span>
          <h2
            id="faq-spa-title"
            className="font-display font-semibold text-ink"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Lo que preguntan.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`spa-item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
