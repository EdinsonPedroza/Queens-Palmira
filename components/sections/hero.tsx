"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  animate,
  m,
  useAnimationControls,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { FloatingSparkles } from "@/components/floating-sparkles"
import { INTRO_EXIT_EVENT } from "@/components/intro-screen"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps } from "@/lib/site"

/*
 * The portal: one brand split down the middle, and each half is a door.
 *   Lado A (left)  → /cosmetics: white / rose / gold
 *   Lado B (right) → /spa:       noir / gold
 *
 * The two backgrounds are full-size layers clipped at a shared `split`
 * position, so anything drawn in both (the giant wordmark) swaps personality
 * exactly at the seam. The emblem and the copy ride the seam, and hovering a
 * side (desktop) widens it. Two invisible link overlays — sized to follow the
 * seam — make each half clickable and give the portal exactly two tab stops;
 * everything inside them is decorative.
 */

type Side = "glam" | "spa"

/** Seam position, in % of the hero width. */
const SPLIT_REST = 50
const SPLIT_ACTIVE: Record<Side, number> = { glam: 57, spa: 43 }
const SPLIT_SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 0.9 } as const
const EASE = [0.16, 1, 0.3, 1] as const

/* ── Variants (driven by one controller, started once the intro opens) ── */
const rise: Variants = {
  hidden: { y: "112%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 1, delay: 0.35 + i * 0.09, ease: EASE },
  }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.75 + i * 0.1, ease: EASE },
  }),
}

const emblemIn: Variants = {
  hidden: { opacity: 0, scale: 0.7, rotate: -10 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1.1, delay: 0.1, ease: [0.34, 1.3, 0.64, 1] },
  },
}

const photoIn: Variants = {
  hidden: { opacity: 0, scale: 1.14 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.8, ease: EASE } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1, delay: 1.2 } },
}

export function Hero() {
  const isMobile = useIsMobile()
  const controls = useAnimationControls()
  const activeRef = useRef<Side | null>(null)

  const split = useMotionValue(SPLIT_REST)
  const splitInverse = useTransform(split, (v) => 100 - v)
  const glamClip = useMotionTemplate`inset(0 ${splitInverse}% 0 0)`
  const spaClip = useMotionTemplate`inset(0 0 0 ${split}%)`
  const seamLeft = useMotionTemplate`${split}%`
  const glamWidth = useMotionTemplate`${split}%`
  const spaWidth = useMotionTemplate`${splitInverse}%`
  // Full-width rows translated by the seam offset → their center rides the seam
  const shift = useTransform(split, (v) => `${v - SPLIT_REST}%`)
  // The side that loses space steps back
  const glamOpacity = useTransform(split, [SPLIT_ACTIVE.spa, SPLIT_REST], [0.35, 1])
  const spaOpacity = useTransform(split, [SPLIT_REST, SPLIT_ACTIVE.glam], [1, 0.35])

  /*
   * Hover reveal. `split` already says how far a side has opened (50 at rest,
   * 57 / 43 once it is hovered), so one 0→1 value per side drives the lot: that
   * side's photo dims, and a short description of the service settles into the
   * free space on its outer edge. It rides the same spring as the widening, so
   * everything arrives and leaves together. Nothing loops.
   */
  const glamOpen = useTransform(split, [SPLIT_REST, SPLIT_ACTIVE.glam], [0, 1])
  const spaOpen = useTransform(split, [SPLIT_ACTIVE.spa, SPLIT_REST], [1, 0])

  const glamVeil = useTransform(glamOpen, [0, 1], [0, 0.5])
  const glamServiceOpacity = useTransform(glamOpen, [0.45, 1], [0, 1])
  const glamServiceX = useTransform(glamOpen, [0.45, 1], [-14, 0])

  const spaVeil = useTransform(spaOpen, [0, 1], [0, 0.55])
  const spaServiceOpacity = useTransform(spaOpen, [0.45, 1], [0, 1])
  const spaServiceX = useTransform(spaOpen, [0.45, 1], [14, 0])

  /* Entrance: wait for the intro curtains on a first visit, play at once otherwise */
  useEffect(() => {
    let introPending = false
    try {
      introPending = !sessionStorage.getItem("queens-intro-seen")
    } catch {
      /* storage blocked → no intro either */
    }
    if (!introPending) {
      controls.start("show")
      return
    }
    let fallback: ReturnType<typeof setTimeout> | undefined
    const play = () => {
      clearTimeout(fallback)
      controls.start("show")
    }
    window.addEventListener(INTRO_EXIT_EVENT, play, { once: true })
    fallback = setTimeout(play, 3200)
    return () => {
      window.removeEventListener(INTRO_EXIT_EVENT, play)
      clearTimeout(fallback)
    }
  }, [controls])

  /* No hover on phones: snap back to the middle if the viewport shrinks */
  useEffect(() => {
    if (!isMobile) return
    activeRef.current = null
    split.set(SPLIT_REST)
  }, [isMobile, split])

  const setActive = (side: Side | null) => {
    if (isMobile || activeRef.current === side) return
    activeRef.current = side
    animate(split, side ? SPLIT_ACTIVE[side] : SPLIT_REST, SPLIT_SPRING)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const r = e.currentTarget.getBoundingClientRect()
    const pct = ((e.clientX - r.left) / r.width) * 100
    setActive(pct < split.get() ? "glam" : "spa")
  }

  return (
    <m.section
      id="hero"
      aria-labelledby="hero-title"
      initial="hidden"
      animate={controls}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActive(null)}
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-noir"
      style={
        {
          "--emblem": "clamp(6rem, 19vh, 12rem)",
          "--lockup": "clamp(2.4rem, min(7.4vw, 10.5vh), 7.75rem)",
        } as React.CSSProperties
      }
    >
      <h1 id="hero-title" className="sr-only">
        Queens — Cosmetics y Spa en Palmira
      </h1>

      {/* ════ LADO A · Cosmetics background ════ */}
      <m.div aria-hidden className="absolute inset-0 bg-white" style={{ clipPath: glamClip }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 12% 22%, oklch(0.94 0.035 15 / 0.9) 0%, transparent 70%)," +
              "radial-gradient(45% 45% at 42% 85%, oklch(0.94 0.035 15 / 0.6) 0%, transparent 70%)," +
              "radial-gradient(30% 30% at 30% 45%, oklch(0.85 0.090 85 / 0.18) 0%, transparent 70%)",
          }}
        />
        {/* The mirror of the spa photo: one still image on the outer edge, melting
            into white toward the seam. `multiply` lets the photo's own white drop
            out so the rose washes above stay visible through it. */}
        <m.div variants={photoIn} className="absolute inset-y-0 left-0 w-1/2 md:w-[60%]">
          <Image
            src="/images/cosmetics/hero.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 50vw, 60vw"
            className="object-cover object-[39%_50%] mix-blend-multiply md:object-[65%_40%]"
          />
        </m.div>
        <div className="absolute inset-0 bg-[linear-gradient(270deg,white_48%,oklch(1_0_0/0.72)_64%,oklch(1_0_0/0.2)_100%)] md:bg-[linear-gradient(270deg,white_40%,oklch(1_0_0/0.7)_62%,oklch(1_0_0/0.15)_100%)]" />
        <Wordmark className="text-[oklch(0.84_0.065_15/0.2)]" />
        {/* Dims this side's photo while it is hovered, so the description reads over it */}
        <m.div className="absolute inset-0 bg-white" style={{ opacity: glamVeil }} />
      </m.div>

      {/* ════ LADO B · Spa background ════ */}
      <m.div aria-hidden className="absolute inset-0 bg-noir" style={{ clipPath: spaClip }}>
        <m.div variants={photoIn} className="absolute inset-y-0 right-0 w-1/2 md:w-[60%]">
          <Image
            src="/images/spa/oil.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 50vw, 60vw"
            className="object-cover object-[64%_50%] md:object-[34%_50%] grayscale-[30%] contrast-[1.1]"
          />
        </m.div>
        {/* Melt the photo into the noir toward the seam and the bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--noir)_48%,oklch(0.13_0.008_40/0.72)_64%,oklch(0.13_0.008_40/0.2)_100%)] md:bg-[linear-gradient(90deg,var(--noir)_40%,oklch(0.13_0.008_40/0.7)_62%,oklch(0.13_0.008_40/0.15)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--noir)_0%,transparent_45%)]" />
        <Wordmark className="text-outline-gold opacity-50" />
        <m.div className="absolute inset-0 bg-noir" style={{ opacity: spaVeil }} />
        {!isMobile && <FloatingSparkles count={14} tone="gold" />}
      </m.div>

      {/* ════ Content — decorative: the doors below own every interaction ════ */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-center pt-24 pb-16 md:pt-28 md:pb-20">
        <m.div style={{ x: shift }} className="flex justify-center">
          <Emblem />
        </m.div>

        <m.div style={{ x: shift }} className="mt-4 grid grid-cols-2 md:mt-8">
          {/* Lado A — Cosmetics */}
          <m.div style={{ opacity: glamOpacity }} className="flex flex-col items-end pl-3 pr-3.5 text-right md:pr-12">
            {/* `relative` so the service note can hang off the title block at a fixed distance */}
            <div className="relative flex flex-col items-end">
            <ServiceNote side="glam" open={glamOpen} opacity={glamServiceOpacity} x={glamServiceX} />
            <h2 className="font-display uppercase leading-[0.86] tracking-[-0.045em]" style={{ fontSize: "var(--lockup)" }}>
              <span className="block overflow-hidden pb-[0.1em]">
                <m.span variants={rise} custom={0} className="block font-bold text-queens-gradient">
                  QUEENS
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <m.span variants={rise} custom={1} className="block text-[0.5em] font-light tracking-[0.14em] text-ink">
                  COSMETICS
                </m.span>
              </span>
            </h2>
            <m.p
              variants={fadeUp}
              custom={0}
              className="mt-2 md:mt-4 max-w-[10.5rem] md:max-w-xs text-balance text-[11px] md:text-sm leading-relaxed text-ink/65"
            >
              {VENUES.cosmetics.tagline}
            </m.p>
            <m.div variants={fadeUp} custom={1} className="mt-4 md:mt-7">
              <span className={cn(buttonVariants({ size: "lg" }), "h-10 px-4 text-xs md:h-14 md:px-8 md:text-base")}>
                Visítanos
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </span>
            </m.div>
            </div>
          </m.div>

          {/* Lado B — Spa */}
          <m.div style={{ opacity: spaOpacity }} className="flex flex-col items-start pl-3.5 pr-3 text-left md:pl-12">
            <div className="relative flex flex-col items-start">
            <ServiceNote side="spa" open={spaOpen} opacity={spaServiceOpacity} x={spaServiceX} />
            <h2 className="font-display uppercase leading-[0.86] tracking-[-0.045em]" style={{ fontSize: "var(--lockup)" }}>
              <span className="block overflow-hidden pb-[0.1em]">
                <m.span variants={rise} custom={0} className="block font-bold text-[var(--gold)]">
                  QUEENS
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <m.span variants={rise} custom={1} className="block text-[0.5em] font-light tracking-[0.14em] text-white">
                  SPA
                </m.span>
              </span>
            </h2>
            <m.p
              variants={fadeUp}
              custom={0}
              className="mt-2 md:mt-4 max-w-[10.5rem] md:max-w-xs text-balance text-[11px] md:text-sm leading-relaxed text-white/65"
            >
              {VENUES.spa.tagline}
            </m.p>
            <m.div variants={fadeUp} custom={1} className="mt-4 md:mt-7">
              <span className={cn(buttonVariants({ variant: "gold", size: "lg" }), "h-10 px-4 text-xs md:h-14 md:px-8 md:text-base")}>
                Visítanos
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </span>
            </m.div>
            </div>
          </m.div>
        </m.div>
      </div>
s
      {/* ════ The two doors ════ */}
      <Door
        href={VENUES.cosmetics.href}
        label={`Entrar a ${VENUES.cosmetics.name}`}
        testId="portal-door-cosmetics"
        onActivate={() => setActive("glam")}
        onRelease={() => setActive(null)}
        style={{ left: 0, width: glamWidth }}
        ringClassName="ring-[var(--rose-hot)]"
      />
      <Door
        href={VENUES.spa.href}
        label={`Entrar a ${VENUES.spa.name}`}
        testId="portal-door-spa"
        onActivate={() => setActive("spa")}
        onRelease={() => setActive(null)}
        style={{ left: seamLeft, width: spaWidth }}
        ringClassName="ring-[var(--gold)]"
      />

      {/* Scroll cue, pinned to the seam. The addresses that used to sit in the
          bottom corners live in the locations section right below. */}
      <m.a
        href="#ubicaciones"
        aria-label="Ver dónde queda cada una"
        variants={fadeIn}
        style={{ left: seamLeft }}
        className="absolute bottom-4 z-30 -translate-x-1/2 md:bottom-6"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/70 bg-[linear-gradient(90deg,var(--noir)_50%,white_50%)] text-[var(--gold)] transition hover:scale-110">
          <ArrowDown className="h-4 w-4" />
        </span>
      </m.a>
    </m.section>
  )
}

/*
 * The service note: shown when its side is hovered, hanging off the title block
 * at a fixed distance — to the left of Cosmetics' title, to the right of the
 * Spa's. Anchoring it to the title (rather than to the screen edge) keeps it a
 * neighbour of the title at any width instead of stranded against the window.
 * Wide screens only: below `xl` there is no room beside the title, and touch
 * has no hover.
 */
function ServiceNote({
  side,
  open,
  opacity,
  x,
}: {
  side: Side
  /** 0→1 as this side opens; the button's own motion rides it. */
  open: MotionValue<number>
  opacity: MotionValue<number>
  x: MotionValue<number>
}) {
  const isSpa = side === "spa"
  const venue = isSpa ? VENUES.spa : VENUES.cosmetics

  // A quiet "ver más", deliberately lighter than "Visítanos": a hairline outline
  // whose soft tint sweeps in from the left while its arrow turns upright as the
  // side opens — movement of its own, without competing with the main button.
  const fill = useTransform(open, [0.55, 1], [0, 1])
  const arrowTurn = useTransform(open, [0.55, 1], [-45, 0])

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 hidden w-60 -translate-y-1/2 text-left xl:block 2xl:w-72",
        isSpa ? "left-full ml-16 2xl:ml-24" : "right-full mr-16 2xl:mr-24",
      )}
    >
      <m.div style={{ opacity, x }} className={isSpa ? "[text-shadow:0_2px_20px_rgba(0,0,0,0.55)]" : undefined}>
        <span className={cn("mb-5 block h-px w-12", isSpa ? "bg-[var(--gold)]" : "bg-[var(--gold-deep)]")} />
        <p
          className={cn(
            "font-display text-[11px] font-semibold uppercase tracking-[0.34em]",
            isSpa ? "text-[var(--gold)]" : "text-[var(--gold-deep)]",
          )}
        >
          {isSpa ? "El spa" : "La tienda"}
        </p>
        <p
          className={cn(
            "mt-4 font-display text-[1.25rem] font-light leading-[1.35] tracking-[-0.01em] 2xl:text-[1.5rem]",
            isSpa ? "text-white" : "text-ink",
          )}
        >
          {venue.service}
        </p>
        <span
          className={cn(
            "relative mt-6 inline-flex h-10 items-center gap-3 overflow-hidden rounded-full border pl-5 pr-1.5 2xl:h-11 2xl:pl-6",
            isSpa ? "border-[var(--gold)]/45 text-[var(--gold)] [text-shadow:none]" : "border-ink/25 text-ink",
          )}
        >
          <m.span
            aria-hidden
            className={cn("absolute inset-0 origin-left", isSpa ? "bg-[var(--gold)]/15" : "bg-ink/[0.07]")}
            style={{ scaleX: fill }}
          />
          <span className="relative text-[11px] font-semibold uppercase tracking-[0.22em] 2xl:text-[12px]">
            {venue.serviceCta}
          </span>
          <span
            className={cn(
              "relative flex h-7 w-7 items-center justify-center rounded-full border 2xl:h-8 2xl:w-8",
              isSpa ? "border-[var(--gold)]/45" : "border-ink/25",
            )}
          >
            <m.span style={{ rotate: arrowTurn }} className="flex">
              <ArrowRight className="h-3.5 w-3.5" />
            </m.span>
          </span>
        </span>
      </m.div>
    </div>
  )
}

/* ── An invisible half-width link: the whole side is the click target ── */
function Door({
  href,
  label,
  testId,
  onActivate,
  onRelease,
  style,
  ringClassName,
}: {
  href: string
  label: string
  testId: string
  onActivate: () => void
  onRelease: () => void
  style: React.ComponentProps<typeof m.div>["style"]
  ringClassName: string
}) {
  return (
    <m.div style={style} className="absolute inset-y-0 z-20">
      <Link
        href={href}
        {...faceLinkProps(href)}
        aria-label={label}
        data-testid={testId}
        onFocus={onActivate}
        onBlur={onRelease}
        className={cn(
          "block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-inset",
          ringClassName,
        )}
      />
    </m.div>
  )
}

/* ── Giant background wordmark (drawn in both layers, so it flips at the seam) ── */
function Wordmark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 flex select-none justify-center font-display font-bold uppercase leading-[0.75] tracking-[-0.06em]",
        className,
      )}
      style={{ fontSize: "22.5vw", transform: "translateY(16%)" }}
    >
      Queens
    </div>
  )
}

/* ── The logo, wearing both personalities: each half is clipped at its own center ── */
function Emblem() {
  return (
    <m.div variants={emblemIn} aria-hidden className="relative aspect-square" style={{ width: "var(--emblem)" }}>
      <EmblemHalf side="glam" />
      <EmblemHalf side="spa" />
    </m.div>
  )
}

function EmblemHalf({ side }: { side: Side }) {
  const isSpa = side === "spa"

  // Just the logo, still. The spinning ring of text, its inner circle and the
  // glow behind it were removed: the client found the hero too busy.
  return (
    <div className="absolute inset-0" style={{ clipPath: isSpa ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)" }}>
      <Image
        src="/images/logoFondo.webp"
        alt=""
        fill
        priority
        quality={85}
        sizes="(max-width: 768px) 45vw, 22rem"
        className={cn(
          "object-contain p-[6%]",
          isSpa
            ? "brightness-110 drop-shadow-[0_0_14px_rgba(212,175,55,0.35)]"
            : "drop-shadow-[0_6px_12px_rgba(212,175,55,0.25)]",
        )}
      />
    </div>
  )
}
