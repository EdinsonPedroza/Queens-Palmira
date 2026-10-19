import { Star } from "lucide-react"

interface Review {
  name: string
  text: string
  rating: number
  initials: string
}

const REVIEWS: Review[] = [
  { name: "Valentina R.",  initials: "VR", rating: 5, text: "Mi base favorita la conseguí aquí. Me asesoraron perfecto con el tono y ahora es mi base holy grail." },
  { name: "Camila M.",     initials: "CM", rating: 5, text: "El labial matte dura TODO el día. Compré 3 tonos más. La atención es divina, se sienten como amigas." },
  { name: "Sofía P.",      initials: "SP", rating: 5, text: "La paleta Smoky Night es INSANA. Pigmentada, sin fall out. Definitivamente volveré por más." },
  { name: "Daniela L.",    initials: "DL", rating: 5, text: "El serum de vitamina C me cambió la piel en dos semanas. Ahora todo mi skincare lo compro aquí." },
  { name: "Isabella G.",   initials: "IG", rating: 5, text: "Queens Essence es mi nueva fragancia signature. Todos me preguntan qué me eché." },
  { name: "Mariana T.",    initials: "MT", rating: 5, text: "El espejo LED es una joyita. Llegó al día siguiente. Super recomendado." },
  { name: "Juliana S.",    initials: "JS", rating: 5, text: "Me encantaron las muestras que me regalaron en mi primera compra. Detalles así enamoran." },
  { name: "Natalia C.",    initials: "NC", rating: 5, text: "El set de brochas vale cada peso. Son sedosas y duran. Servicio 10/10." },
]

/* 53.33s keeps the pace the rows always had: they used to cover 1.5 sets every 40s, now 2 sets. */
const ROW_STYLE = { width: "max-content", animationDuration: "53.33s" } as const

function Card({ review }: { review: Review }) {
  return (
    <div className="mx-3 flex w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-[var(--face-light)]/40 bg-white p-6 shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--face)_20%,transparent)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-queens-gradient font-display font-bold text-[var(--ink)]">
          {review.initials}
        </div>
        <div>
          <p className="font-medium text-sm text-[var(--ink)]">{review.name}</p>
          <div className="flex gap-0.5">
            {[...Array(review.rating)].map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-[var(--face)] text-[var(--face)]"
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
        {review.text}
      </p>
    </div>
  )
}

export function Testimonials() {
  const firstHalf = REVIEWS.slice(0, 4)
  const secondHalf = REVIEWS.slice(4)

  return (
    <section id="testimonios" className="relative scroll-mt-20 py-4 md:py-5 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10 mb-3 md:mb-4">
        <div className="text-left">
          <h2
            className="font-display font-semibold text-ink"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Lo que dicen nuestras clientes
          </h2>
        </div>
      </div>

      {/* Each row is repeated an EVEN number of times: the marquee slides by half its own width, so the
          loop only closes without a jump if that half is a whole number of copies. Four also keeps a
          wide screen covered for the whole slide. */}
      <div className="flex flex-col gap-6">
        <div className="flex animate-marquee" style={ROW_STYLE}>
          {[...firstHalf, ...firstHalf, ...firstHalf, ...firstHalf].map((r, i) => (
            <Card key={`r1-${i}`} review={r} />
          ))}
        </div>
        <div
          className="flex animate-marquee-reverse"
          style={ROW_STYLE}
        >
          {[...secondHalf, ...secondHalf, ...secondHalf, ...secondHalf].map((r, i) => (
            <Card key={`r2-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
