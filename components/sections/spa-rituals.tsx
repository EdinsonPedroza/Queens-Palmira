"use client"

import { m, type Variants } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { spaBookingLink } from "@/lib/whatsapp"

/* Placeholder menu — replace with the real spa services, durations and (if wanted) prices. */
const RITUALS = [
  { name: "Limpieza facial profunda", desc: "Extracción, exfoliación y mascarilla según tu tipo de piel.", duration: "60 min" },
  { name: "Facial glow hidratante", desc: "Ácido hialurónico y masaje facial para una piel luminosa.", duration: "50 min" },
  { name: "Masaje relajante", desc: "Aceites esenciales y presión suave para soltar la tensión.", duration: "60 min" },
  { name: "Diseño y laminado de cejas", desc: "Cejas a tu medida con henna o laminado de larga duración.", duration: "45 min" },
  { name: "Lifting de pestañas", desc: "Curvatura natural que te dura hasta seis semanas.", duration: "60 min" },
  { name: "Manicure & pedicure spa", desc: "Exfoliación, hidratación y esmaltado semipermanente.", duration: "90 min" },
]

const EASE = [0.16, 1, 0.3, 1] as const

const rise: Variants = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({ y: "0%", transition: { duration: 0.95, delay: i * 0.1, ease: EASE } }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: EASE } }),
}

export function SpaRituals() {
  return (
    <section
      id="rituales"
      aria-labelledby="rituales-title"
      className="relative scroll-mt-6 overflow-hidden bg-noir py-24 text-white md:scroll-mt-0 md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.135 85 / 0.14) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Header ── */}
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid items-end gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16"
        >
          <div>
            <m.p
              variants={fadeUp}
              className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]"
            >
              <span className="h-px w-10 bg-[var(--gold)]/60" />
              El menú
            </m.p>
            <h2
              id="rituales-title"
              className="font-display uppercase leading-[0.88] tracking-[-0.045em]"
              style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
            >
              <span className="block overflow-hidden pb-[0.04em]">
                <m.span variants={rise} custom={0} className="block font-light">
                  Rituales
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <m.span variants={rise} custom={1} className="block font-bold shimmer-gold">
                  Queens.
                </m.span>
              </span>
            </h2>
          </div>

          <m.div variants={fadeUp} custom={2} className="md:pb-3">
            <p className="max-w-md text-base leading-relaxed text-white/65 md:text-lg">
              Cada ritual se reserva con cita previa. Toca el que quieras y te escribimos por WhatsApp para cuadrar
              el horario.
            </p>
          </m.div>
        </m.div>

        {/* ── Menu list ── */}
        <ul className="mt-14 border-b border-white/10 md:mt-20">
          {RITUALS.map((r, i) => (
            <m.li
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              className="border-t border-white/10"
            >
              <a
                href={spaBookingLink(r.name)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`spa-ritual-${i + 1}`}
                className="group relative grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 py-5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] md:grid-cols-[5rem_1.15fr_1fr_6rem_auto] md:gap-x-6 md:py-7"
              >
                {/* Gold fill sweeps in from the left */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-[var(--gold)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="relative pl-1 font-display text-sm font-semibold text-[var(--gold)] transition-colors duration-300 group-hover:text-noir md:pl-3 md:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative">
                  <span className="block font-display text-xl font-semibold uppercase leading-tight tracking-tight transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-noir md:text-[2.1rem]">
                    {r.name}
                  </span>
                  <span className="mt-1 block text-xs text-white/50 transition-colors duration-300 group-hover:text-noir/70 md:hidden">
                    {r.desc} · {r.duration}
                  </span>
                </span>
                <span className="relative hidden text-sm leading-relaxed text-white/55 transition-colors duration-300 group-hover:text-noir/75 md:block">
                  {r.desc}
                </span>
                <span className="relative hidden text-xs font-semibold uppercase tracking-[0.2em] text-white/45 transition-colors duration-300 group-hover:text-noir/70 md:block">
                  {r.duration}
                </span>
                <span className="relative mr-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition duration-500 group-hover:rotate-45 group-hover:border-noir group-hover:bg-noir group-hover:text-[var(--gold)] md:mr-3 md:h-12 md:w-12">
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="sr-only">Reservar {r.name} por WhatsApp</span>
                </span>
              </a>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
