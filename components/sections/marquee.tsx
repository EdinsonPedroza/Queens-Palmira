const KEYWORDS = [
  "Cosmética Premium",
  "Envíos a todo Palmira",
  "Productos 100% Originales",
  "Asesoría Personalizada",
  "Muestras Gratis",
  "Pagos Seguros",
]

/** Separador geométrico: pequeño diamante dorado (CSS, sin iconos) */
function Diamond() {
  return (
    <span
      aria-hidden
      className="mx-6 h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px] bg-[var(--gold-soft)]"
      style={{ boxShadow: "0 0 6px rgba(255,244,214,0.6)" }}
    />
  )
}

function Row() {
  const items = [...KEYWORDS, ...KEYWORDS]
  return (
    <div className="flex items-center whitespace-nowrap animate-marquee-reverse">
      {items.map((kw, i) => (
        <div key={i} className="flex items-center">
          <span
            className="font-display text-sm md:text-base font-medium uppercase tracking-[0.22em] text-white"
            style={{ textShadow: "0 1px 3px rgba(44,24,16,0.18)" }}
          >
            {kw}
          </span>
          <Diamond />
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
