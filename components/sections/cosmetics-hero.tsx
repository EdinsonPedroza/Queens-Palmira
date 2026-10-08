"use client"

import Image from "next/image"
import Link from "next/link"
import { m, type Variants } from "framer-motion"
import { ArrowDown, ArrowLeft, ArrowUpRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VENUES } from "@/lib/site"
import { WA_VISIT } from "@/lib/whatsapp"

/* Lado A's own front door: the rose half of the portal, given a full screen. */

const EASE = [0.16, 1, 0.3, 1] as const

const COLLAGE = [
  {
    src: "/images/products/Brillo Labial Essence Juicy Bomb.webp",
    width: 861,
    height: 780,
    className: "right-[4%] top-[20%] w-[34vw] md:right-[8%] md:top-[18%] md:w-[18vw] md:max-w-[300px]",
    rotate: -13,
    floatDelay: "0s",
  },
  {
    src: "/images/products/Esmalte Vogue Efecto Gel.webp",
    width: 959,
    height: 1000,
    className: "right-[30%] top-[12%] w-[13vw] md:right-[28%] md:top-[14%] md:w-[8vw] md:max-w-[140px]",
    rotate: 14,
    floatDelay: "1.4s",
  },
  {
    src: "/images/products/Maybelline Superstay Matte Ink.webp",
    width: 579,
    height: 1000,
    className: "hidden md:block right-[6%] bottom-[14%] w-[8vw] max-w-[135px]",
    rotate: 9,
    floatDelay: "2.6s",
  },
]

const rise: Variants = {
  hidden: { y: "112%" },
  show: (i: number = 0) => ({ y: "0%", transition: { duration: 1, delay: 0.15 + i * 0.1, ease: EASE } }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.85, delay: 0.5 + i * 0.1, ease: EASE } }),
}

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 16, delay: 0.35 + i * 0.12 },
  }),
}

export function CosmeticsHero() {
  return (
    <m.section
      id="hero"
      aria-labelledby="cosmetics-hero-title"
      initial="hidden"
      animate="show"
      className="relative flex h-[100svh] min-h-[620px] flex-col justify-center overflow-hidden bg-white"
    >
      {/* ── Backdrop ── */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 85% 20%, oklch(0.94 0.035 15 / 0.95) 0%, transparent 70%)," +
            "radial-gradient(45% 45% at 55% 90%, oklch(0.94 0.035 15 / 0.6) 0%, transparent 70%)," +
            "radial-gradient(32% 32% at 68% 48%, oklch(0.85 0.090 85 / 0.2) 0%, transparent 70%)",
        }}
      />
      {/* Giant wordmark, same as the portal's left half */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex select-none justify-center font-display font-bold uppercase leading-[0.75] tracking-[-0.06em] text-[oklch(0.84_0.065_15/0.32)]"
        style={{ fontSize: "22.5vw", transform: "translateY(16%)" }}
      >
        Queens
      </div>

      {COLLAGE.map((p, i) => (
        <m.div key={p.src} variants={popIn} custom={i} aria-hidden className={cn("absolute z-10", p.className)}>
          <div style={{ rotate: `${p.rotate}deg` }}>
            <div className="animate-float" style={{ animationDelay: p.floatDelay }}>
              <Image
                src={p.src}
                alt=""
                width={p.width}
                height={p.height}
                priority={i === 0}
                sizes="(max-width: 768px) 35vw, 18vw"
                className="h-auto w-full drop-shadow-[0_26px_28px_rgba(255,105,180,0.28)]"
              />
            </div>
          </div>
        </m.div>
      ))}

      {/* ── Copy ── */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-24 md:px-10 md:pt-28">
        <m.div variants={fadeUp} custom={-3} className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-ink/45 transition hover:text-[var(--gold-deep)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Queens
          </Link>
        </m.div>

        <m.p
          variants={fadeUp}
          custom={-2}
          className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold-deep)]"
        >
          <span className="h-px w-10 bg-[var(--gold-deep)]/60" />
          Lado A · Queens Cosmetics
        </m.p>

        <h1
          id="cosmetics-hero-title"
          className="max-w-4xl font-display uppercase leading-[0.86] tracking-[-0.045em] text-ink"
          style={{ fontSize: "clamp(2.9rem, 9vw, 8rem)" }}
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <m.span variants={rise} custom={0} className="block font-light">
              La belleza
            </m.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <m.span variants={rise} custom={1} className="block font-bold text-queens-gradient">
              que mereces.
            </m.span>
          </span>
        </h1>

        <m.p variants={fadeUp} custom={0} className="mt-6 max-w-md text-base leading-relaxed text-ink/65 md:text-lg">
          Maquillaje, skincare, esmaltes y línea capilar. Marcas originales, asesoría de verdad y envíos en Palmira.
        </m.p>

        <m.div variants={fadeUp} custom={1} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button asChild size="lg" data-testid="cosmetics-hero-cta-catalog">
            <a href="#catalogo">
              <ShoppingBag className="h-5 w-5" />
              Ver catálogo
            </a>
          </Button>
          <a
            href={WA_VISIT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 underline decoration-[var(--rose-hot)]/50 underline-offset-[6px] transition hover:text-ink hover:decoration-[var(--rose-hot)]"
          >
            Escríbenos
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </m.div>

        <m.div
          variants={fadeUp}
          custom={2}
          className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/40 md:mt-16"
        >
          <span>{VENUES.cosmetics.address}</span>
          <span>{VENUES.cosmetics.hoursShort}</span>
        </m.div>
      </div>

      {/* Scroll cue */}
      <m.a
        href="#catalogo"
        aria-label="Ver el catálogo"
        variants={fadeUp}
        custom={4}
        className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 md:bottom-7"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/70 bg-white/70 text-[var(--gold-deep)] shadow-[0_0_24px_rgba(212,175,55,0.25)] backdrop-blur transition hover:scale-110">
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </span>
      </m.a>
    </m.section>
  )
}
