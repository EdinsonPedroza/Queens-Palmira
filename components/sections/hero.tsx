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
import { FloatingSparkles } from "@/components/floating-sparkles"
import { INTRO_EXIT_EVENT } from "@/components/intro-screen"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps } from "@/lib/site"

/*
 * The portal: one brand split down the middle, and each half is a door.
 *   Lado A (left)  → /cosmetics: crema + lila, the store photo in a gold-framed arch
 *   Lado B (right) → /spa:       crema + dorado, the nails photo in a gold-framed arch
 *
 * The two backgrounds are full-size layers clipped at a shared `split`
 * position, so anything drawn in both (the giant wordmark) swaps personality
 * exactly at the seam. The emblem and the copy ride the seam, and hovering a
 * side (desktop) widens it. Two invisible link overlays — sized to follow the
 * seam — make each half clickable and give the portal exactly two tab stops;
 * everything inside them is decorative.
 */

type Side = "glam" | "spa"

/*
 * The arch's width is worked out from the title's own width (--lockup), so it always sits beside the
 * text and never over it (both arches use it, one on each side). If you change the title's size or the
 * column's padding, recalculate this.
 */
const ARCH_WIDTH = "clamp(0px, calc(0.92 * (51.5vw - 8.5rem - 3.72 * var(--lockup))), 19.5rem)"

/** Seam position, in % of the hero width. */
const SPLIT_REST = 50
const DEAD_ZONE = 2.5
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
  // Neutral strip around the seam (DEAD_ZONE % of the width on each side): neither door covers it, so a click
  // exactly in the middle goes nowhere, and returning the cursor to the middle of the screen closes whichever side is open.
  const glamWidth = useMotionTemplate`calc(${split}% - ${DEAD_ZONE}%)`
  const spaLeft = useMotionTemplate`calc(${split}% + ${DEAD_ZONE}%)`
  const spaWidth = useMotionTemplate`calc(${splitInverse}% - ${DEAD_ZONE}%)`
  // Full-width rows translated by the seam offset → their center rides the seam
  const shift = useTransform(split, (v) => `${v - SPLIT_REST}%`)
  // The side that loses space steps back
  const glamOpacity = useTransform(split, [SPLIT_ACTIVE.spa, SPLIT_REST], [0.35, 1])
  const spaOpacity = useTransform(split, [SPLIT_REST, SPLIT_ACTIVE.glam], [1, 0.35])
  // Each arch gives way a little more than the text: the title slides toward it when the OTHER side opens
  const ovalOpacity = useTransform(split, [SPLIT_REST, SPLIT_ACTIVE.glam], [1, 0.15])
  const glamOvalOpacity = useTransform(split, [SPLIT_ACTIVE.spa, SPLIT_REST], [0.15, 1])

  /*
   * Hover reveal. `split` already says how far a side has opened (50 at rest,
   * 57 / 43 once it is hovered), so one 0→1 value per side drives the lot: that
   * side's arch steps back and a short description of the service settles in
   * next to the title. It rides the same spring as the
   * widening, so everything arrives and leaves together. Nothing loops.
   */
  const glamOpen = useTransform(split, [SPLIT_REST, SPLIT_ACTIVE.glam], [0, 1])
  const spaOpen = useTransform(split, [SPLIT_ACTIVE.spa, SPLIT_REST], [1, 0])

  const glamServiceOpacity = useTransform(glamOpen, [0.45, 1], [0, 1])
  const glamServiceX = useTransform(glamOpen, [0.45, 1], [-14, 0])
  const spaServiceOpacity = useTransform(spaOpen, [0.45, 1], [0, 1])
  const spaServiceX = useTransform(spaOpen, [0.45, 1], [14, 0])

  // The spa half is covered with the palette's crema (#FFFFEE) while it is hovered.
  const spaVeil = useTransform(spaOpen, [0, 1], [0, 0.35])
  // An arch also steps back while ITS side is open: the title and its text sit next to it and need a clean crema ground.
  const archOpacity = useTransform([ovalOpacity, spaOpen], ([a, b]: number[]) => a * (1 - 0.8 * b))
  const glamArchOpacity = useTransform([glamOvalOpacity, glamOpen], ([a, b]: number[]) => a * (1 - 0.8 * b))

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
    // Back at the middle of the screen: close whichever side is open. Measured from the fixed centre (not the
    // moving seam) so it cannot flicker.
    if (Math.abs(pct - SPLIT_REST) < DEAD_ZONE) return setActive(null)
    // Side under the cursor: against the moving seam while a side is open, against the fixed centre once closed
    // (the seam is still sliding back then, and comparing with it reopened the side for an instant: the "jump").
    const edge = activeRef.current ? split.get() : SPLIT_REST
    setActive(pct < edge ? "glam" : "spa")
  }

  return (
    <m.section
      id="hero"
      aria-labelledby="hero-title"
      initial="hidden"
      animate={controls}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setActive(null)}
      className="relative h-[100svh] min-h-[600px] overflow-hidden bg-background"
      style={
        {
          "--emblem": "clamp(5.25rem, 15.5vh, 10rem)",
          "--lockup": "clamp(2.1rem, min(6.4vw, 9vh), 6.6rem)",
        } as React.CSSProperties
      }
    >
      <h1 id="hero-title" className="sr-only">
        Queens — Cosmetics y Spa en Palmira
      </h1>

      {/* ════ LADO A · Cosmetics background ════ — crema like the rest of the site. The store photo lives in
          an ARCH with a gold frame, the mirror of the spa's (the client asked for it in place of the full-height
          photo under a purple veil). Same width formula as the spa's, so it always sits to the LEFT of the text. */}
      <m.div aria-hidden className="face-cosmetics absolute inset-0 bg-white" style={{ clipPath: glamClip }}>
        <m.div style={{ opacity: glamArchOpacity }} className="absolute inset-0">
          {/* `sizes`: the photo is 1400×2489 and is drawn as wide as `object-cover` needs to fill the arch's height
              (0.562 × min(76svh, 2.7 × arch width)); on a phone the arch is the narrower side, so 30vw. */}
          <PortalArch
            side="glam"
            src="/images/cosmetics/store-interior.webp"
            position="object-[50%_46%]"
            sizes="(max-width: 1023px) 32vw, clamp(240px, 43vh, 480px)"
          />
        </m.div>
        <Wordmark className="text-[color-mix(in_oklab,var(--face-light)_14%,transparent)]" />
      </m.div>

      {/* ════ LADO B · Spa background ════ — crema too; the photo is in an ARCH that rises from the bottom edge
          (picked by the client over an oval, a card and a circle). Its width comes from the title's own width, so
          it always sits to the RIGHT of the text and never over it; its height is as much of the screen as the
          width allows. Both arches are hidden between 768 and 1023px, where there is no room, and are small floating
          arches on phones. Photo supplied by the client: a French manicure being painted. The file is the right-hand part
          of ACTUALIZACION/Manicura francesa en un spa de lujo.png (the arch is too narrow to show the rest). */}
      <m.div aria-hidden className="face-spa absolute inset-0 bg-white" style={{ clipPath: spaClip }}>
        <m.div style={{ opacity: archOpacity }} className="absolute inset-0">
          {/* `sizes` is the width the PHOTO is drawn at, not the arch's: on desktop the arch is tall and narrow, so
              `object-cover` scales the photo by the arch's height (the photo is 813×1146, so 0.71 × min(76svh,
              2.7 × arch width)). With the arch's own width here the browser picks a file a third too small and
              stretches it. */}
          <PortalArch
            side="spa"
            src="/images/spa/nails-french.webp"
            position="object-[60%_50%]"
            sizes="(max-width: 1023px) 32vw, clamp(332px, 54vh, 640px)"
          />
        </m.div>
        <Wordmark className="text-outline-gold opacity-25" />
        <m.div className="absolute inset-0 bg-white" style={{ opacity: spaVeil }} />
        {!isMobile && <FloatingSparkles count={14} tone="gold" />}
      </m.div>

      {/* Both halves are crema, so a hairline marks the seam */}
      <m.div aria-hidden style={{ left: seamLeft }} className="pointer-events-none absolute inset-y-0 z-[5] w-px bg-[var(--ink)]/12" />

      {/* ════ Content — decorative: the doors below own every interaction ════ */}
      {/* The emblem hangs right under the header; the two titles are centred in what is left below it. */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col pt-28 pb-16 md:pb-20">
        <m.div style={{ x: shift }} className="flex shrink-0 justify-center">
          <Emblem />
        </m.div>

        <div className="flex flex-1 items-center">
          {/* Four rows shared by both columns (crown, title, line, button): the two titles and the two buttons
              line up across the seam whatever the length of the text in between. */}
          <m.div style={{ x: shift }} className="grid w-full grid-cols-2 grid-rows-[auto_auto_auto_auto]">
            <PortalColumn side="glam" subtitle="COSMETICS" opacity={glamOpacity} open={glamOpen} noteOpacity={glamServiceOpacity} noteX={glamServiceX} />
            <PortalColumn side="spa" subtitle="SPA" opacity={spaOpacity} open={spaOpen} noteOpacity={spaServiceOpacity} noteX={spaServiceX} />
          </m.div>
        </div>
      </div>
      {/* ════ The two doors ════ */}
      <Door
        href={VENUES.cosmetics.href}
        label={`Entrar a ${VENUES.cosmetics.name}`}
        testId="portal-door-cosmetics"
        onActivate={() => setActive("glam")}
        onRelease={() => setActive(null)}
        style={{ left: 0, width: glamWidth }}
        ringClassName="ring-[var(--lila-deep)]"
      />
      <Door
        href={VENUES.spa.href}
        label={`Entrar a ${VENUES.spa.name}`}
        testId="portal-door-spa"
        onActivate={() => setActive("spa")}
        onRelease={() => setActive(null)}
        style={{ left: spaLeft, width: spaWidth }}
        ringClassName="ring-[var(--dorado-deep)]"
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
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--ink)]/30 bg-white text-[var(--ink)] shadow-sm transition hover:scale-110">
          <ArrowDown className="h-4 w-4" />
        </span>
      </m.a>
    </m.section>
  )
}

/*
 * A photo in an arch with a thin gold line beside it, one on each side of the portal. The line is HALF
 * of an outline concentric with the photo (same shape, a few pixels out): it rises along the side that
 * faces the middle of the page, follows the curve and stops at the very top of the arch, as in the
 * client's reference. It is open at the bottom too: on a desktop the arch stands on the edge of the screen.
 * The line is gold on BOTH sides (client's request), whatever the half's own accent is.
 * Its width comes from `ARCH_WIDTH`; between 768px and 1023px there is no room for it, and on a
 * phone it is a small arch in the top corner.
 */
function PortalArch({ side, src, position, sizes }: { side: Side; src: string; position: string; sizes: string }) {
  const isLeft = side === "glam"
  return (
    <m.div
      variants={photoIn}
      style={{ "--arch-w": ARCH_WIDTH } as React.CSSProperties}
      className={cn(
        "absolute top-[13%] aspect-[1/1.5] w-[30vw] max-[1024px]:md:hidden min-[1024px]:top-auto min-[1024px]:bottom-0 min-[1024px]:aspect-auto min-[1024px]:h-[min(76svh,calc(var(--arch-w)*2.7))] min-[1024px]:w-[var(--arch-w)]",
        isLeft ? "left-[4vw] min-[1024px]:left-[3vw]" : "right-[4vw] min-[1024px]:right-[3vw]",
      )}
    >
      {/* Half the outline: the box starts one gap outside the photo on the middle-facing side and is half the
          photo's width plus the gap wide, so its single rounded corner (clamped to a quarter circle by the box's
          own width) is exactly the outer arc, ending at the arch's centre line. Gap: 8px on a phone, 16px from
          `min-[1024px]`. The colour is inline on purpose: `globals.css` has an unlayered
          `* { border-color: var(--border) }` that beats every `border-[...]` utility (and so greys out the borders
          all over the site), but not an inline style. */}
      <div
        aria-hidden
        className={cn(
          "absolute -top-2 bottom-0 w-[calc(50%+0.5rem)] border-t min-[1024px]:-top-4 min-[1024px]:w-[calc(50%+1rem)]",
          isLeft
            ? "-right-2 rounded-tr-[999px] border-r min-[1024px]:-right-4"
            : "-left-2 rounded-tl-[999px] border-l min-[1024px]:-left-4",
        )}
        style={{ borderColor: "color-mix(in oklab, var(--dorado) 80%, transparent)" }}
      />
      <div className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-2xl bg-[var(--face-soft)] shadow-[0_30px_60px_-24px_rgba(35,16,37,0.4)]">
        <Image src={src} alt="" fill priority sizes={sizes} className={cn("object-cover", position)} />
      </div>
    </m.div>
  )
}

/*
 * One side's text: title, a short line, the "Visítanos" pill and, on hover, the longer service note.
 * It spans the grid's four rows (subgrid) so both sides share them. Row 1 is the spa's crown with its
 * hairline (the store leaves it empty), row 2 the title, row 3 the short line, row 4 the pill.
 */
function PortalColumn({
  side,
  subtitle,
  opacity,
  open,
  noteOpacity,
  noteX,
}: {
  side: Side
  subtitle: string
  /** The column steps back while the other side is open. */
  opacity: MotionValue<number>
  open: MotionValue<number>
  noteOpacity: MotionValue<number>
  noteX: MotionValue<number>
}) {
  const isSpa = side === "spa"
  const venue = isSpa ? VENUES.spa : VENUES.cosmetics

  return (
    <m.div
      style={{ opacity }}
      className={cn(
        "row-span-4 grid grid-rows-subgrid",
        isSpa
          ? "face-spa justify-items-start pl-3.5 pr-3 text-left md:pl-12"
          : "face-cosmetics justify-items-end pl-3 pr-3.5 text-right md:pr-12",
      )}
    >
      {isSpa && (
        // The brand's own crown (cut from the isotipo) and a hairline
        <m.div variants={fadeUp} custom={0} aria-hidden className="row-start-1 mb-3 flex h-6 items-center gap-3 md:mb-4">
          <Image src="/images/brand/corona-dorado.webp" alt="" width={257} height={168} unoptimized className="h-4 w-auto md:h-[1.15rem]" />
          <span className="h-px w-10 bg-[var(--face)]/60 md:w-24" />
        </m.div>
      )}

      {/* `relative`: the service note hangs off the title block, level with its top, at a fixed distance */}
      <div className="relative row-start-2">
        <ServiceNote side={side} open={open} opacity={noteOpacity} x={noteX} />
        <h2 className="font-display uppercase leading-[0.86] tracking-[-0.025em]" style={{ fontSize: "var(--lockup)" }}>
          <span className="block overflow-hidden pb-[0.1em]">
            <m.span variants={rise} custom={0} className="block font-bold text-[var(--face)]">
              QUEENS
            </m.span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <m.span variants={rise} custom={1} className="block text-[0.5em] font-light tracking-[0.14em] text-ink">
              {subtitle}
            </m.span>
          </span>
        </h2>
      </div>

      {/* From `md` up: on a phone each half is too narrow for a line of text. Its width follows the title's. */}
      <m.p
        variants={fadeUp}
        custom={1}
        className="row-start-3 mt-3 hidden max-w-[calc(var(--lockup)*3.72)] text-[clamp(0.8rem,1.15vw,1.05rem)] leading-snug text-ink/80 md:block"
      >
        {venue.portalIntro}
      </m.p>

      <m.div variants={fadeUp} custom={2} className="row-start-4 mt-6 md:mt-7">
        <span
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-5 text-xs font-medium md:h-12 md:px-7 md:text-base border-[var(--face)] text-[var(--face-deep)]",
            isSpa
              ? "shadow-[0_0_20px_rgba(188,161,87,0.36),inset_0_0_12px_rgba(188,161,87,0.14)]"
              : "shadow-[0_0_20px_rgba(164,139,166,0.36),inset_0_0_12px_rgba(164,139,166,0.14)]",
          )}
        >
          Visítanos
          <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
        </span>
      </m.div>
    </m.div>
  )
}

/*
 * The service note: shown when its side is hovered, hanging off the title block
 * at a fixed distance — to the left of Cosmetics' title, to the right of the
 * Spa's — with its top level with the "QUEENS" title. Anchoring it to the title
 * (rather than to the screen edge) keeps it a neighbour of the title at any width
 * instead of stranded against the window. Wide screens only: below `xl` there is
 * no room beside the title, and touch has no hover. Each side also has a short
 * line that is always on screen (`portalIntro`); this one tells the services.
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
        "pointer-events-none absolute top-0 hidden w-56 text-left xl:block 2xl:w-64",
        isSpa ? "face-spa left-full ml-16 2xl:ml-24" : "face-cosmetics right-full mr-16 2xl:mr-24",
      )}
    >
      <m.div style={{ opacity, x }}>
        <span className="mb-4 block h-px w-10 bg-[var(--face-deep)]" />
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--face-deep)]">
          {isSpa ? "El spa" : "La tienda"}
        </p>
        <p className="mt-3 font-display text-[1rem] font-light leading-[1.4] tracking-[-0.005em] text-ink 2xl:text-[1.2rem]">
          {venue.service}
        </p>
        {/* "Ver más": just a word, an arrow and a hairline that draws itself as the side opens */}
        <span className="relative mt-5 inline-flex items-center gap-2 pb-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-ink/75 2xl:text-[11px]">
          <span>{venue.serviceCta}</span>
          <m.span style={{ rotate: arrowTurn }} className="flex">
            <ArrowRight className="h-3 w-3" />
          </m.span>
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-current opacity-20" />
          <m.span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-current" style={{ scaleX: fill }} />
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
        "pointer-events-none absolute inset-x-0 bottom-0 flex select-none justify-center font-display font-bold uppercase leading-[0.75] tracking-[-0.03em]",
        className,
      )}
      style={{ fontSize: "18vw", transform: "translateY(17%)" }}
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
      {/* Each half wears its own colour on crema: lila (cosmetics) and gold (spa).
          `unoptimized`: the artwork is already a small WebP (14 KB) with hairline strokes, and
          re-encoding it through the image optimizer (AVIF, smaller sizes) is what softened it. Served
          as is, at its full 556×803, it stays crisp on any screen; the browser only scales it down. */}
      <Image
        src={isSpa ? "/images/brand/isotipo-dorado.webp" : "/images/brand/isotipo-lila.webp"}
        alt=""
        fill
        priority
        unoptimized
        className={cn(
          "object-contain p-[6%]",
          isSpa ? "drop-shadow-[0_0_14px_rgba(188,161,87,0.3)]" : "drop-shadow-[0_6px_12px_rgba(35,16,37,0.15)]",
        )}
      />
    </div>
  )
}
