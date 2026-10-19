"use client"

import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SPA_SERVICES as SERVICES } from "@/lib/spa-services"
import { spaBookingLink } from "@/lib/whatsapp"

/* Fine lines, like the store's controls and the cart's: the `* { border-color }` rule of globals.css beats the utilities (see CLAUDE.md), so the colour goes inline. */
const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"

/*
 * The menu in the store's language (flat, square, fine lines, small spaced capitals): a white card with a hairline border and one row per service, split by
 * fine lines. The gold fill that sweeps in from the left on hover is the spa's own and stays; the round arrow became a square one.
 */
export function SpaServices() {
  return (
    <section
      id="servicios"
      aria-labelledby="servicios-title"
      className="relative scroll-mt-[var(--nav-h)] bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 pb-6 pt-6 text-ink md:pb-8 md:pt-8"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Header ── */}
        <Reveal className="mb-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 md:mb-4">
          <div>
            <span className="mb-2.5 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">El menú</span>
            <h2
              id="servicios-title"
              className="font-display font-semibold text-ink"
              style={{ fontSize: "clamp(1.45rem, 3vw, 2.2rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Servicios Queens
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink/70">
            Cada servicio se reserva con cita previa. Toca el que quieras y te escribimos por WhatsApp para cuadrar el horario.
          </p>
        </Reveal>

        {/* ── Menu list ── */}
        <ul className="border bg-white" style={{ borderColor: HAIRLINE }}>
          {SERVICES.map((r, i) => (
            <Reveal as="li" key={r.name} delay={i * 60} style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}` }}>
              <a
                href={spaBookingLink(r.name)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`spa-ritual-${i + 1}`}
                className="group relative grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 px-4 py-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--face)] focus-visible:ring-inset md:grid-cols-[3.5rem_1.1fr_1.4fr_7rem_auto] md:gap-x-6 md:px-6 md:py-5"
              >
                {/* Gold fill sweeps in from the left */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-[var(--face)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
                <span className="relative text-[11px] font-bold tracking-[0.16em] text-[var(--face-deep)] transition-colors duration-300 [font-variant-numeric:lining-nums] group-hover:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">
                  <span className="block text-[13px] font-semibold uppercase leading-tight tracking-[0.08em] text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 md:text-[14.5px]">
                    {r.name}
                  </span>
                  <span className="mt-1 block text-xs text-ink/60 transition-colors duration-300 group-hover:text-ink/80 md:hidden">
                    {r.desc} · {r.duration}
                  </span>
                </span>
                <span className="relative hidden text-[13px] leading-relaxed text-ink/65 transition-colors duration-300 group-hover:text-ink/85 md:block">
                  {r.desc}
                </span>
                <span className="relative hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 group-hover:text-ink/80 md:block">
                  {r.duration}
                </span>
                <span className="relative grid h-9 w-9 place-items-center text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_25%,transparent)] transition-[background-color,color,box-shadow] duration-500 group-hover:bg-ink group-hover:text-[var(--face)] group-hover:shadow-[inset_0_0_0_1px_var(--ink)] md:h-10 md:w-10">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
                  <span className="sr-only">Reservar {r.name} por WhatsApp</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
