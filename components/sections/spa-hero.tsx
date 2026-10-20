"use client"

import { m, type Variants } from "framer-motion"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { VENUES } from "@/lib/site"
import { WA_SPA } from "@/lib/whatsapp"

/* Lado B's front door, built like the store's (cosmetics-hero.tsx) and told apart by its gold: the header is its own bar and the hero starts below it; a photo
 * (the manicure the client delivered, `ACTUALIZACION/Manicura francesa en un spa de lujo.png`, 1373×1146) fills the left of the hero with a thin gold line inside
 * its edge, and the copy, left-aligned, sits in the crema on the right: eyebrow, title in two lines, two lines of text, the near-black "Reservar cita" button
 * (it turns gold on hover) and a text link, with the address and hours at the foot. Under `lg` the photo becomes a band on top that fades into the crema and the
 * copy goes below it, as on the store.
 *
 * The photo is the cover, so it skips next/image's optimizer (which recompresses to q85): it ships as two hand-made WebP files, the full-size one and a 900 px one
 * for phones. `sizes` is the width it is DRAWN at: ~55 % of the window from lg up, the whole window below. The hard edge on desktop is on purpose: the right
 * side of the photo is a black glove, and fading it into the crema would read as smoke (the client already turned down photos with "humo"). */

const EASE = [0.16, 1, 0.3, 1] as const

const rise: Variants = {
  hidden: { y: "112%" },
  show: (i: number = 0) => ({ y: "0%", transition: { duration: 1, delay: 0.15 + i * 0.1, ease: EASE } }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: 0.5 + i * 0.1, ease: EASE } }),
}

/* Scale only, no opacity: the photo is the LCP element and must paint right away. */
const settle: Variants = {
  hidden: { scale: 1.04 },
  show: { scale: 1, transition: { duration: 1.6, ease: EASE } },
}

export function SpaHero() {
  return (
    <m.section
      id="hero"
      aria-labelledby="spa-hero-title"
      initial="hidden"
      animate="show"
      /* Starts below the strip + header (--header-h). lg+: fills the rest of the screen. */
      className="relative flex min-h-[calc(100svh_-_var(--header-h))] flex-col overflow-hidden bg-white lg:block lg:h-[calc(100svh_-_var(--header-h))] lg:min-h-[540px] lg:max-h-[56.25vw]"
    >
      {/* ── Photo ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[52svh] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] md:h-[56svh] lg:bottom-0 lg:right-auto lg:h-auto lg:w-[55%] lg:[mask-image:none]"
      >
        <m.div variants={settle} className="absolute inset-0 origin-[50%_50%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/spa/hero-manicura-1373.webp"
            srcSet="/images/spa/hero-manicura-900.webp 900w, /images/spa/hero-manicura-1373.webp 1373w"
            sizes="(min-width: 1024px) 55vw, 100vw"
            width={1373}
            height={1146}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[48%_50%]"
          />
        </m.div>
        {/* A thin gold line inside the photo's edge, like a mat (box-shadow, not a border: see the border-colour note in CLAUDE.md) */}
        <div
          className="pointer-events-none absolute inset-3 hidden lg:block"
          style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--face) 90%, transparent)" }}
        />
      </div>

      {/* ── Copy ── */}
      <div className="relative z-20 mt-[47svh] px-6 pb-24 pt-2 md:mt-[52svh] md:px-10 lg:absolute lg:inset-y-0 lg:left-[55%] lg:right-0 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:px-[4.5vw] lg:pb-0 lg:pt-0">
        <m.p
          variants={fadeUp}
          custom={-1}
          className="mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ink/80 lg:mb-[1vw] lg:text-[clamp(9px,0.85vw,13px)]"
        >
          Queens Spa
        </m.p>
        <h1
          id="spa-hero-title"
          className="font-display text-[clamp(2.7rem,12.5vw,3.6rem)] uppercase leading-[0.88] tracking-[-0.025em] text-ink md:text-[clamp(3.4rem,9vw,5.2rem)] lg:whitespace-nowrap lg:text-[clamp(2.1rem,4.5vw,5.4rem)]"
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <m.span variants={rise} custom={0} className="block font-bold">
              La otra cara
            </m.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <m.span variants={rise} custom={1} className="block font-bold">
              de la reina.
            </m.span>
          </span>
        </h1>

        <m.p
          variants={fadeUp}
          custom={0}
          className="mt-4 max-w-md text-[1rem] leading-relaxed text-ink/85 md:max-w-xl md:text-[1.05rem] lg:mt-[1.2vw] lg:max-w-none lg:text-[clamp(0.95rem,1.22vw,1.375rem)] lg:leading-[1.5]"
        >
          Un spa de uñas para consentir tus manos y pies. <br className="hidden lg:block" />
          Casa aparte de la tienda, en la Cra 25.
        </m.p>

        <m.div
          variants={fadeUp}
          custom={1}
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-[1.9vw] lg:flex-nowrap lg:gap-x-[1.8vw]"
        >
          <a
            href={WA_SPA}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="spa-hero-cta-book"
            className="inline-flex items-center gap-[1.4em] whitespace-nowrap bg-[var(--ink)] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--face)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ink) lg:px-[2.2vw] lg:py-[1.15vw] lg:text-[clamp(10px,0.95vw,14px)]"
          >
            Reservar cita
            <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
          </a>
          <span aria-hidden className="hidden h-[3vw] w-px bg-ink/25 lg:block" />
          <a
            href="#servicios"
            className="inline-flex items-center gap-[1.2em] whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-70 lg:text-[clamp(10px,0.95vw,14px)]"
          >
            Ver servicios
            <ArrowDown className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
          </a>
        </m.div>

        {/* Address and hours, side by side under the buttons (lg+). Not at the foot of the hero like the store's: the floating WhatsApp bubble sits there. */}
        <m.div
          variants={fadeUp}
          custom={2}
          className="mt-12 hidden flex-row flex-wrap items-center gap-x-[2.4vw] gap-y-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-ink/90 lg:mt-[3.4vw] lg:flex lg:text-[clamp(9px,0.72vw,11px)]"
        >
          <span>{VENUES.spa.address} · Palmira</span>
          <span>{VENUES.spa.hoursShort}</span>
        </m.div>
      </div>

      {/* Scroll cue: on the seam between the photo and the copy (lg+), centred on phones */}
      <m.a
        href="#servicios"
        aria-label="Ver los servicios"
        variants={fadeUp}
        custom={4}
        className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 md:bottom-7 lg:left-[55%]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--face)]/70 bg-white/70 text-[var(--face-deep)] shadow-[0_0_24px_color-mix(in_oklab,var(--face)_25%,transparent)] backdrop-blur transition hover:scale-110">
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </span>
      </m.a>
    </m.section>
  )
}
