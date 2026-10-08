import { cn } from "@/lib/utils"

const GLAM_KEYWORDS = [
  "Cosmética Premium",
  "Envíos a todo Palmira",
  "Productos 100% Originales",
  "Asesoría Personalizada",
  "Muestras Gratis",
  "Pagos Seguros",
]

const SPA_KEYWORDS = [
  "Queens Spa",
  "Faciales",
  "Masajes Relajantes",
  "Cejas & Pestañas",
  "Manicure Spa",
  "Rituales de Calma",
]

/** Separador geométrico: pequeño diamante (CSS, sin iconos) */
function Diamond({ className }: { className?: string }) {
  return <span aria-hidden className={cn("mx-6 h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px]", className)} />
}

function Band({
  keywords,
  reverse,
  className,
  textClassName,
  diamondClassName,
}: {
  keywords: string[]
  reverse?: boolean
  className: string
  textClassName: string
  diamondClassName: string
}) {
  const items = [...keywords, ...keywords, ...keywords, ...keywords]
  return (
    <div className={cn("absolute left-[-10%] w-[120%] py-3 md:py-4", className)}>
      <div className={cn("flex w-max items-center whitespace-nowrap", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        {items.map((kw, i) => (
          <div key={i} className="flex items-center">
            <span className={cn("font-display text-sm md:text-lg font-semibold uppercase tracking-[0.22em]", textClassName)}>
              {kw}
            </span>
            <Diamond className={diamondClassName} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * On the store: two tapes crossing in an X — the two personalities running in
 * opposite directions. On the spa page the rose tape would fight the noir, so
 * only the gold one runs.
 */
export function Marquee({ face = "cosmetics" }: { face?: "cosmetics" | "spa" }) {
  if (face === "spa") {
    return (
      <section className="relative h-24 overflow-hidden bg-noir md:h-28" aria-hidden="true">
        <Band
          keywords={SPA_KEYWORDS}
          className="top-1/2 -translate-y-1/2 border-y border-[var(--gold)]/20 bg-noir-soft"
          textClassName="text-[var(--gold-soft)]"
          diamondClassName="bg-[var(--gold)]/70"
        />
      </section>
    )
  }

  return (
    <section className="relative h-32 overflow-hidden bg-white md:h-44" aria-hidden="true">
      <Band
        keywords={SPA_KEYWORDS}
        className="top-1/2 -translate-y-1/2 rotate-3 md:rotate-[2.2deg] bg-noir shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
        textClassName="text-[var(--gold-soft)]"
        diamondClassName="bg-white/70"
      />
      <Band
        keywords={GLAM_KEYWORDS}
        reverse
        className="top-1/2 -translate-y-1/2 -rotate-3 md:rotate-[-2.2deg] bg-queens-gradient-intense shadow-[0_10px_30px_-12px_rgba(255,105,180,0.6)]"
        textClassName="text-white [text-shadow:0_1px_3px_rgba(44,24,16,0.18)]"
        diamondClassName="bg-[var(--gold-soft)] shadow-[0_0_6px_rgba(255,244,214,0.6)]"
      />
    </section>
  )
}
