"use client"

import { useRef } from "react"
import Link from "next/link"
import { useInView } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps } from "@/lib/site"
import { WA_SPA } from "@/lib/whatsapp"

const WORDS = ["Tus", "manos", "te", "van", "a", "dar", "las", "gracias."]

/*
 * The closing slab, flat like the store's blocks ("una losa del acento con texto casi negro"): solid gold, a one-colour title in the store's weight, and two square buttons of the same size: WhatsApp in its GREEN (#25D366, ink text) and "¿Buscabas la tienda?" as an ink-outlined button that fills crema on hover (it used to be a bare text link and did not look like a button). What stays from before: the soft light that drifts over the gold and the title's words flipping up one by one
 * (now a CSS animation: Framer's entrance sent each word back to its start for a frame when it ended).
 */
export function SpaCTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative overflow-hidden bg-[var(--face)] py-12 text-ink md:py-16">
      {/* Soft crema glows over the gold slab. They drift forever, so they are CSS loops (see
          "AMBIENT LOOPS" in globals.css) with their own pace and start; on phones they hold still. */}
      {[
        { size: 420, x: "8%", y: "12%", dur: 9 },
        { size: 300, x: "72%", y: "55%", dur: 12 },
        { size: 240, x: "45%", y: "8%", dur: 8 },
      ].map((orb, i) => (
        <div
          key={i}
          aria-hidden
          className="ambient-drift ambient-desktop pointer-events-none absolute rounded-full blur-3xl"
          style={
            {
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: "radial-gradient(circle, color-mix(in oklab, var(--crema) 30%, transparent) 0%, transparent 70%)",
              "--drift-y1": "-24px",
              "--drift-y2": "28px",
              "--drift-s1": 1.12,
              "--drift-s2": 0.96,
              "--amb-dur": `${orb.dur}s`,
              "--amb-delay": `${i * 1.4}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal as="p" className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-ink/75">
          Reserva tu cita
        </Reveal>

        <h2
          className="font-display font-semibold"
          style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
        >
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={cn(
                "mr-[0.25em] inline-block",
                inView ? "motion-safe:animate-[flip-in_600ms_cubic-bezier(0.16,1,0.3,1)_backwards]" : "opacity-0",
              )}
              style={{ animationDelay: `${150 + i * 70}ms` }}
            >
              {word}
            </span>
          ))}
        </h2>

        <Reveal as="p" delay={450} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink/75 md:text-lg">
          Escríbenos y cuadramos tu cita. <span className="whitespace-nowrap">{VENUES.spa.address}, Palmira.</span>
        </Reveal>

        <Reveal className="mt-8 flex flex-col items-center justify-center gap-x-8 gap-y-5 sm:flex-row" delay={600}>
          <a
            href={WA_SPA}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="spa-cta-book"
            className="inline-flex items-center gap-3 whitespace-nowrap bg-[#25D366] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink)] shadow-[0_14px_26px_-16px_color-mix(in_oklab,var(--ink)_60%,transparent)] transition-colors duration-200 hover:bg-[#1FBF5B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Reservar por WhatsApp
          </a>

          <Link
            href="/"
            {...faceLinkProps("/")}
            className="group inline-flex items-center gap-[1.2em] whitespace-nowrap px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-200 hover:bg-[var(--crema)]"
            style={{ boxShadow: "inset 0 0 0 1.5px var(--ink)" }}
          >
            ¿Buscabas la tienda?
            <ArrowUpRight className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
