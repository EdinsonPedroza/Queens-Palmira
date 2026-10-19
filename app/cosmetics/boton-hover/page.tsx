import type { Metadata } from "next"
import { ChevronDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Hover del botón — Queens Cosmetics",
  robots: { index: false, follow: false },
}

/* Página temporal (no indexada): seis animaciones al pasar el cursor por el botón "Elige un tono". Pasa el cursor por cada uno. Borrar al elegir. */
const HAIRLINE = "inset 0 0 0 1px color-mix(in oklab, var(--ink) 14%, transparent)"
const BASE = "relative flex w-full cursor-pointer items-center justify-center gap-2 px-3 py-2.5 text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--ink)]"
const EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]"

function Sample({ n, title, note, children }: { n: number; title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--face-deep)]">{n} · {title}</p>
      <div className="group w-full max-w-[230px]">{children}</div>
      <p className="max-w-[260px] text-xs leading-snug text-[var(--ink)]/75">{note}</p>
    </div>
  )
}

export default function ButtonHoverPage() {
  return (
    <main data-face="cosmetics" className="min-h-screen px-6 py-16 md:px-16">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Hover del botón &ldquo;Elige un tono&rdquo;</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">Pasa el cursor por cada botón. El 1 es el de ahora.</p>

      <div className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <Sample n={1} title="Actual" note="Contorno de tinta que aparece con un fundido de 260 ms.">
          <button type="button" className={`${BASE}`} style={{ boxShadow: HAIRLINE }}>
            <span className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[260ms] ${EASE} group-hover:opacity-100`} style={{ boxShadow: "inset 0 0 0 1px var(--ink)" }} />
            Elige un tono <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </Sample>

        <Sample n={2} title="Halo lila" note="El contorno se enciende y a su alrededor se abre un halo lila suave; el botón se eleva 1 px.">
          <button type="button" className={`${BASE} transition-[transform,box-shadow] duration-300 ${EASE} group-hover:-translate-y-px`} style={{ boxShadow: HAIRLINE }}>
            <span className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${EASE} group-hover:opacity-100`} style={{ boxShadow: "inset 0 0 0 1px var(--ink), 0 0 0 4px color-mix(in oklab, var(--lila) 28%, transparent), 0 10px 22px -12px color-mix(in oklab, var(--ciruela) 45%, transparent)" }} />
            Elige un tono <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-px" />
          </button>
        </Sample>

        <Sample n={3} title="Esquinas" note="Solo las cuatro esquinas se marcan en tinta y se alargan hacia el centro de cada lado.">
          <button type="button" className={`${BASE}`} style={{ boxShadow: HAIRLINE }}>
            {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
              <span key={c} aria-hidden className={`pointer-events-none absolute h-1.5 w-1.5 border-[var(--ink)] transition-all duration-300 ${EASE} group-hover:h-3.5 group-hover:w-3.5 ${c}`} style={{ borderColor: "var(--ink)" }} />
            ))}
            Elige un tono <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </Sample>

        <Sample n={4} title="Subrayado" note="Sin caja: una línea de tinta crece desde el centro bajo el texto y la flecha baja un poco.">
          <button type="button" className={`${BASE}`} style={{ boxShadow: HAIRLINE }}>
            <span aria-hidden className={`pointer-events-none absolute bottom-0 left-0 h-px w-full origin-center scale-x-0 bg-[var(--ink)] transition-transform duration-300 ${EASE} group-hover:scale-x-100`} />
            Elige un tono <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </Sample>

        <Sample n={5} title="Letras que respiran" note="El texto abre su espaciado de letras y el contorno aparece con un fundido; se siente como un suspiro.">
          <button type="button" className={`${BASE} transition-[letter-spacing] duration-500 ${EASE} group-hover:tracking-[0.17em]`} style={{ boxShadow: HAIRLINE }}>
            <span className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ${EASE} group-hover:opacity-100`} style={{ boxShadow: "inset 0 0 0 1px var(--ink)" }} />
            Elige un tono <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </Sample>

        <Sample n={6} title="Brillo que cruza" note="El contorno aparece y un destello de luz cruza el botón una sola vez, de izquierda a derecha.">
          <button type="button" className={`${BASE} overflow-hidden`} style={{ boxShadow: HAIRLINE }}>
            <span className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ${EASE} group-hover:opacity-100`} style={{ boxShadow: "inset 0 0 0 1px var(--ink)" }} />
            <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--lila)_45%,transparent)] to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100" />
            Elige un tono <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </Sample>
      </div>
    </main>
  )
}
