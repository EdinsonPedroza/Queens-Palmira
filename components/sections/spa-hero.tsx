"use client"

import Image from "next/image"
import Link from "next/link"
import { m, type Variants } from "framer-motion"
import { ArrowDown, ArrowLeft, CalendarHeart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingSparkles } from "@/components/floating-sparkles"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { VENUES } from "@/lib/site"
import { WA_SPA } from "@/lib/whatsapp"

/* Lado B's own front door: the noir half of the portal, given a full screen. */

const EASE = [0.16, 1, 0.3, 1] as const

const rise: Variants = {
  hidden: { y: "112%" },
  show: (i: number = 0) => ({ y: "0%", transition: { duration: 1, delay: 0.15 + i * 0.1, ease: EASE } }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: 0.5 + i * 0.1, ease: EASE } }),
}

export function SpaHero() {
  const isMobile = useIsMobile()

  return (
    <m.section
      id="hero"
      aria-labelledby="spa-hero-title"
      initial="hidden"
      animate="show"
      className="relative flex h-[100svh] min-h-[620px] flex-col justify-center overflow-hidden bg-noir text-white"
    >
      {/* ── Backdrop ── */}
      <m.div
        aria-hidden
        className="absolute inset-y-0 right-0 w-full md:w-[62%]"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <Image
          src="/images/spa/massage-bw.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 62vw"
          className="object-cover object-[60%_50%] grayscale contrast-[1.12] brightness-[0.72]"
        />
      </m.div>
      {/* Melt the photo into the noir from the left and the bottom */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,var(--noir)_12%,oklch(0.13_0.008_40/0.82)_52%,oklch(0.13_0.008_40/0.45)_100%)] md:bg-[linear-gradient(90deg,var(--noir)_32%,oklch(0.13_0.008_40/0.74)_58%,oklch(0.13_0.008_40/0.25)_100%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,var(--noir)_0%,transparent_42%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-12%] h-[40rem] w-[40rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.135 85 / 0.16) 0%, transparent 70%)" }}
      />
      {/* Hollow "SPA" bleeding off the edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[5vw] bottom-[-2vh] select-none font-display font-bold uppercase leading-none tracking-[-0.06em] text-outline-gold"
        style={{ fontSize: "clamp(10rem, 32vw, 30rem)" }}
      >
        Spa
      </div>
      {!isMobile && <FloatingSparkles count={16} tone="gold" />}

      {/* ── Copy ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 md:px-10 md:pt-28">
        <m.div variants={fadeUp} custom={-3} className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/50 transition hover:text-[var(--gold)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Queens
          </Link>
        </m.div>

        <m.p
          variants={fadeUp}
          custom={-2}
          className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]"
        >
          <span className="h-px w-10 bg-[var(--gold)]/60" />
          Lado B · Queens Spa
        </m.p>

        <h1
          id="spa-hero-title"
          className="max-w-4xl font-display uppercase leading-[0.86] tracking-[-0.045em]"
          style={{ fontSize: "clamp(2.9rem, 9vw, 8rem)" }}
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <m.span variants={rise} custom={0} className="block font-light">
              La otra cara
            </m.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <m.span variants={rise} custom={1} className="block font-bold shimmer-gold">
              de la reina.
            </m.span>
          </span>
        </h1>

        <m.p variants={fadeUp} custom={0} className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
          Un spa para bajar el ritmo y consentir tu piel. Casa aparte de la tienda, en la Cra 25.
        </m.p>

        <m.div variants={fadeUp} custom={1} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild variant="gold" size="lg" data-testid="spa-hero-cta-book">
            <a href={WA_SPA} target="_blank" rel="noopener noreferrer">
              <CalendarHeart className="h-5 w-5" />
              Reservar cita
            </a>
          </Button>
          <a
            href="#rituales"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 underline decoration-[var(--gold)]/50 underline-offset-[6px] transition hover:text-white hover:decoration-[var(--gold)]"
          >
            Ver rituales
            <ArrowDown className="h-4 w-4" />
          </a>
        </m.div>

        <m.div
          variants={fadeUp}
          custom={2}
          className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40 md:mt-16"
        >
          <span>{VENUES.spa.address} · Palmira</span>
          <span className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-[var(--gold)]" />
            Con cita previa · Lun a Dom
          </span>
        </m.div>
      </div>

      {/* Scroll cue */}
      <m.a
        href="#rituales"
        aria-label="Ver los rituales"
        variants={fadeUp}
        custom={4}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 md:bottom-7"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/70 bg-noir/60 text-[var(--gold)] shadow-[0_0_24px_rgba(212,175,55,0.25)] backdrop-blur transition hover:scale-110">
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </span>
      </m.a>
    </m.section>
  )
}
