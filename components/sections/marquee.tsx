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
  "Manicure",
  "Pedicure Spa",
  "Semipermanente",
  "Uñas en Gel",
  "Nail Art",
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
 * On the store: two tapes crossing in an X running in opposite directions —
 * lila (cosmetics) and near-black plum (the footer's colour; it replaced the gold
 * tape, which clashed with the pink catalog). On the spa page it is a thin near-black strip with gold letters (the colours of the strip above the header).
 */
export function Marquee({ face = "cosmetics" }: { face?: "cosmetics" | "spa" }) {
  if (face === "spa") {
    // A thin strip in the colours of the announcement strip above the header (near-black, gold letters, crema diamonds): the store's calm, not a loud gold band.
    // Same loop as always (the words repeat an even number of times so the half-width slide closes without a jump).
    const items = [...SPA_KEYWORDS, ...SPA_KEYWORDS, ...SPA_KEYWORDS, ...SPA_KEYWORDS]
    return (
      <section className="relative flex h-11 items-center overflow-hidden bg-[var(--ink)]" aria-hidden="true">
        <div className="flex w-max items-center whitespace-nowrap animate-marquee">
          {items.map((kw, i) => (
            <div key={i} className="flex items-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--face)] md:text-xs">{kw}</span>
              <Diamond className="bg-[var(--crema)]" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-32 overflow-hidden bg-white md:h-44" aria-hidden="true">
      <Band
        keywords={SPA_KEYWORDS}
        className="top-1/2 -translate-y-1/2 rotate-3 md:rotate-[2.2deg] bg-[var(--ink)] shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--ink)_55%,transparent)]"
        textClassName="text-[var(--crema)]"
        diamondClassName="bg-[var(--face)]"
      />
      <Band
        keywords={GLAM_KEYWORDS}
        reverse
        className="top-1/2 -translate-y-1/2 -rotate-3 md:rotate-[-2.2deg] bg-[var(--face)] shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--face)_60%,transparent)]"
        textClassName="text-ink"
        diamondClassName="bg-ink/60"
      />
    </section>
  )
}
