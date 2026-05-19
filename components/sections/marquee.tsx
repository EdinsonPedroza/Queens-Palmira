import { Sparkles } from "lucide-react"

const KEYWORDS = [
  "Cosmética Premium",
  "Envíos a todo Palmira",
  "Productos 100% Originales",
  "Asesoría Personalizada",
  "Muestras Gratis",
  "Pagos Seguros",
]

export function Marquee() {
  const items = [...KEYWORDS, ...KEYWORDS]
  return (
    <section
      className="relative overflow-hidden bg-queens-gradient-intense py-2 border-y border-white/30"
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((kw, i) => (
          <div
            key={i}
            className="mx-6 flex items-center gap-2 text-white font-display text-sm md:text-base font-bold tracking-wide"
          >
            <span>{kw}</span>
            <Sparkles className="h-3 w-3 text-white/80" />
          </div>
        ))}
      </div>
    </section>
  )
}
