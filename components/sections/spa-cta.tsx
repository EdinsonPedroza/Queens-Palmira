"use client"

import { useRef } from "react"
import Link from "next/link"
import { m, useInView } from "framer-motion"
import { ArrowUpRight, CalendarHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { VENUES, faceLinkProps } from "@/lib/site"
import { WA_SPA } from "@/lib/whatsapp"

const WORDS = ["Tu", "cuerpo", "te", "va", "a", "dar", "las", "gracias."]
const EASE = [0.16, 1, 0.3, 1] as const

export function SpaCTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const isMobile = useIsMobile()

  return (
    <section ref={ref} className="relative overflow-hidden bg-noir py-24 text-white md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />

      {/* Gold haze instead of the store's rose gradient */}
      {[
        { size: 420, x: "8%", y: "12%", dur: 9 },
        { size: 300, x: "72%", y: "55%", dur: 12 },
        { size: 240, x: "45%", y: "8%", dur: 8 },
      ].map((orb, i) => (
        <m.div
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: "radial-gradient(circle, oklch(0.75 0.135 85 / 0.16) 0%, transparent 70%)",
          }}
          animate={isMobile ? undefined : { x: [0, 30, -20, 0], y: [0, -24, 28, 0], scale: [1, 1.12, 0.96, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.4 }}
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <m.p
          className="mb-7 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="h-px w-10 bg-[var(--gold)]/60" />
          Reserva tu ritual
          <span className="h-px w-10 bg-[var(--gold)]/60" />
        </m.p>

        <h2
          className="font-display uppercase leading-[0.9] tracking-[-0.045em]"
          style={{ fontSize: "clamp(2.3rem, 6vw, 5rem)" }}
        >
          {WORDS.map((word, i) => (
            <m.span
              key={i}
              className={i === WORDS.length - 1 ? "mr-[0.25em] inline-block font-bold shimmer-gold" : "mr-[0.25em] inline-block font-light"}
              initial={{ opacity: 0, y: 48, rotateX: -90 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: EASE }}
              style={{ transformPerspective: 600 }}
            >
              {word}
            </m.span>
          ))}
        </h2>

        <m.p
          className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
        >
          Escríbenos y cuadramos tu cita. {VENUES.spa.address}, Palmira.
        </m.p>

        <m.div
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
        >
          <Button asChild variant="gold" size="xl" data-testid="spa-cta-book">
            <a href={WA_SPA} target="_blank" rel="noopener noreferrer">
              <CalendarHeart className="h-6 w-6" />
              Reservar por WhatsApp
            </a>
          </Button>

          <Link
            href="/cosmetics"
            {...faceLinkProps("/cosmetics")}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 underline decoration-[var(--gold)]/40 underline-offset-[6px] transition hover:text-white hover:decoration-[var(--gold)]"
          >
            ¿Buscabas la tienda?
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </m.div>
      </div>
    </section>
  )
}
