import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const FAQS = [
  {
    q: "¿Sus productos son originales?",
    a: "Sí, 100% originales. Trabajamos únicamente con marcas auténticas y distribuidores autorizados. Nunca vendemos réplicas ni imitaciones.",
  },
  {
    q: "¿Hacen envíos fuera de Palmira?",
    a: "Enviamos a todo el Valle del Cauca y a nivel nacional por Servientrega o Interrapidísimo. En Palmira hacemos entregas el mismo día si el pedido se hace antes de las 3 PM.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos Nequi, Daviplata, transferencia bancaria (Bancolombia, Davivienda), efectivo en tienda y contraentrega en Palmira.",
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "Puedes cambiarlo dentro de los 7 días siguientes a la compra si no ha sido usado y conserva su empaque original. Por higiene no aceptamos devoluciones de labiales, skincare abierto ni productos íntimos.",
  },
  {
    q: "¿Ofrecen asesoría personalizada?",
    a: "¡Claro! Puedes visitarnos en Local 128 de Unicentro Palmira o escribirnos por WhatsApp. Te ayudamos con tono de base, rutina de skincare, esmaltes, línea capilar y maquillaje para cualquier ocasión.",
  },
  {
    q: "¿Tienen descuentos o promociones?",
    a: "Tenemos promociones rotativas que publicamos en @queenscosmeticss en Instagram. Además, en tu primera compra incluimos muestras gratis de nuestros productos más pedidos.",
  },
]

export function FAQ() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white to-[var(--rose-pastel)]/15">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--gold-deep)] mb-3">
            Preguntas frecuentes
          </span>
          <h2
            className="font-display font-semibold text-ink"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Preguntas{" "}
            <span className="text-queens-gradient">frecuentes</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
