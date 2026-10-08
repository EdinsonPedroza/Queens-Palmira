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
  { name: "Laura V.",    initials: "LV", ritual: "Limpieza facial profunda", text: "Salí con la piel como nueva. Me explicaron cada paso y no me dolió nada." },
  { name: "Andrea M.",   initials: "AM", ritual: "Masaje relajante",         text: "Llegué con la espalda destruida del trabajo y salí flotando. Ya es mi plan de cada mes." },
  { name: "Carolina B.", initials: "CB", ritual: "Laminado de cejas",        text: "Me diseñaron las cejas perfectas para mi cara. Dos meses después todavía se ven impecables." },
  { name: "Paula R.",    initials: "PR", ritual: "Lifting de pestañas",      text: "Dejé el rizador para siempre. Me levanto y ya tengo mirada." },
  { name: "Tatiana G.",  initials: "TG", ritual: "Facial glow hidratante",   text: "El brillo de la piel me duró semanas. El masaje facial es lo mejor del ritual." },
  { name: "Mónica S.",   initials: "MS", ritual: "Manicure & pedicure spa",  text: "La exfoliación de pies es gloria pura. Y el semipermanente no se me levantó ni un poco." },
  { name: "Sara L.",     initials: "SL", ritual: "Masaje con piedras",       text: "El calor de las piedras me soltó una tensión que llevaba meses cargando." },
  { name: "Daniela F.",  initials: "DF", ritual: "Limpieza facial profunda", text: "Ambiente tranquilísimo, nada que ver con el ruido del centro comercial afuera." },
]

function Card({ review }: { review: Review }) {
  return (
    <div className="mx-3 flex w-[330px] shrink-0 flex-col gap-4 rounded-2xl border border-white/10 bg-noir p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 font-display font-bold text-[var(--gold)]">
            {review.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{review.name}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[var(--gold)] text-[var(--gold)]" />
              ))}
            </div>
          </div>
        </div>
        <Quote aria-hidden className="h-5 w-5 shrink-0 text-white/15" />
      </div>
      <p className="text-sm leading-relaxed text-white/65">{review.text}</p>
      <p className="mt-auto text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]/70">
        {review.ritual}
      </p>
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
      className="relative scroll-mt-6 overflow-hidden bg-noir py-24 text-white md:scroll-mt-0 md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />

      <div className="relative mx-auto mb-14 max-w-7xl px-6 text-center md:mb-20 md:px-10">
        <p className="mb-5 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]">
          <span className="h-px w-10 bg-[var(--gold)]/60" />
          Experiencias
          <span className="h-px w-10 bg-[var(--gold)]/60" />
        </p>
        <h2
          id="testimonios-spa-title"
          className="font-display uppercase leading-[0.9] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
        >
          <span className="font-light">Salen </span>
          <span className="font-bold shimmer-gold">distintas.</span>
        </h2>
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {[...firstHalf, ...firstHalf, ...firstHalf].map((r, i) => (
            <Card key={`s1-${i}`} review={r} />
          ))}
        </div>
        <div className="flex animate-marquee-reverse" style={{ width: "max-content" }}>
          {[...secondHalf, ...secondHalf, ...secondHalf].map((r, i) => (
            <Card key={`s2-${i}`} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
