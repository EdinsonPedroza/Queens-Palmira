import { Sparkles } from "lucide-react"

const KEYWORDS = [
  "Cosmética Premium",
  "Envíos a todo Palmira",
  "Productos 100% Originales",
  "Asesoría Personalizada",
  "Muestras Gratis",
  "Pagos Seguros",
]

function Row() {
  const items = [...KEYWORDS, ...KEYWORDS]
  return (
    <div className="flex whitespace-nowrap animate-marquee-reverse">
      {items.map((kw, i) => (
        <div key={i} className="flex items-center">
          <span
            className="mx-6 font-display text-sm md:text-base font-semibold uppercase tracking-[0.18em] text-white"
            style={{ textShadow: "0 1px 3px rgba(44,24,16,0.18)" }}
          >
            {kw}
          </span>
          <Sparkles
            className="h-3.5 w-3.5 shrink-0 text-[var(--gold-soft)]"
            fill="currentColor"
            strokeWidth={1}
          />
        </div>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <section
      className="relative overflow-hidden bg-queens-gradient-intense border-y border-white/25"
      aria-hidden="true"
    >
      {/* Brillo sutil en la parte superior (sheen luxury) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-black/5" />

      {/* Fila con fundido en los bordes */}
      <div
        className="relative py-3"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
        }}
      >
        <Row />
      </div>
    </section>
  )
}
