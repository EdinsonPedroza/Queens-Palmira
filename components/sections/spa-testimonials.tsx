import { Quote, Star } from "lucide-react"

/* Placeholder reviews — swap for real ones from Google / Instagram when the
 * client sends them, the same way the product catalog is still invented. */
interface Review {
  name: string
  text: string
  ritual: string
  initials: string
}

const REVIEWS: Review[] = [
  { name: "Laura V.",    initials: "LV", ritual: "Semipermanente",           text: "Me duró tres semanas perfecto, ni una astilla. Y quedaron súper bonitas." },
  { name: "Andrea M.",   initials: "AM", ritual: "Uñas en gel",              text: "Por fin unas uñas largas que no se me rompen. Me las dejaron con la forma que pedí." },
  { name: "Carolina B.", initials: "CB", ritual: "Nail art",                 text: "Me hicieron el diseño de la foto que llevé, idéntico. Todas me preguntan dónde me las hice." },
  { name: "Paula R.",    initials: "PR", ritual: "Manicure tradicional",     text: "Rápida, prolija y con cuidado en las cutículas. Ya es mi cita de cada quince días." },
  { name: "Tatiana G.",  initials: "TG", ritual: "Pedicure spa",             text: "Salí con los pies nuevos. El masaje de pies es lo mejor del servicio." },
  { name: "Mónica S.",   initials: "MS", ritual: "Uñas acrílicas",           text: "El acrílico quedó natural y firme. Y el retiro fue sin dañarme la uña." },
  { name: "Sara L.",     initials: "SL", ritual: "Retiro y mantenimiento",   text: "Llegué con las uñas maltratadas y me las recuperaron. Me explicaron cómo cuidarlas." },
  { name: "Daniela F.",  initials: "DF", ritual: "Manicure semipermanente",  text: "Ambiente tranquilísimo y una atención de verdad personalizada. Volveré siempre." },
]

/* 53.33s keeps the pace the rows always had: they used to cover 1.5 sets every 40s, now 2 sets. */
const ROW_STYLE = { width: "max-content", animationDuration: "53.33s" } as const

/* The card is the store's (testimonials.tsx): same border, shadow and gradient avatar; the spa keeps its quote mark and the service each review is about. */
function Card({ review }: { review: Review }) {
  return (
    <div className="mx-3 flex w-[330px] shrink-0 flex-col gap-3 rounded-2xl border border-[var(--face-light)]/40 bg-white p-6 shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--face)_20%,transparent)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-queens-gradient font-display font-bold text-[var(--ink)]">
            {review.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--ink)]">{review.name}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[var(--face)] text-[var(--face)]" />
              ))}
            </div>
          </div>
        </div>
        <Quote aria-hidden className="h-5 w-5 shrink-0 text-[var(--face)]/30" />
      </div>
      <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{review.text}</p>
      <p className="mt-auto text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--face-deep)]">{review.ritual}</p>
    </div>
  )
}

export function SpaTestimonials() {
  const firstHalf = REVIEWS.slice(0, 4)
  const secondHalf = REVIEWS.slice(4)

  return (
    <section
      id="testimonios-spa"
      aria-labelledby="testimonios-spa-title"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden bg-white py-4 text-ink md:py-5"
    >
      {/* Left-aligned, one colour, no eyebrow: the same header as the store's reviews */}
      <div className="mb-3 px-6 md:mb-4 md:px-10">
        <h2
          id="testimonios-spa-title"
          className="font-display font-semibold text-ink"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
        >
          Lo que dicen nuestras reinas
        </h2>
      </div>

      {/* Each row is repeated an EVEN number of times: the marquee slides by half its own width, so the
          loop only closes without a jump if that half is a whole number of copies. Four also keeps a
          wide screen covered for the whole slide. */}
      <div className="relative flex flex-col gap-6">
        <div className="flex animate-marquee" style={ROW_STYLE}>
          {[...firstHalf, ...firstHalf, ...firstHalf, ...firstHalf].map((r, i) => (
            <Card key={`s1-${i}`} review={r} />
          ))}
        </div>
        <div className="flex animate-marquee-reverse" style={ROW_STYLE}>
          {[...secondHalf, ...secondHalf, ...secondHalf, ...secondHalf].map((r, i) => (
            <Card key={`s2-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
