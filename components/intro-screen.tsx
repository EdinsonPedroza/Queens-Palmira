"use client"

import { useEffect, useRef, useState } from "react"
import { m, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { IntroPlayer } from "@/components/intro/intro-player"
import { isIntroVersionId, type IntroVersionId } from "@/components/intro/intro-versions"
import { seededRandom } from "@/lib/utils"

const LETTERS = "QUEENS".split("")

/*
 * The logo at the centre, in the two colours of the house: the left half in lila (Cosmetics) and the
 * right half in gold (Spa), the same pairing as the emblem of the portal. It is drawn 112px tall on
 * phones and 160px from `md` (h-28 / md:h-40), that is 78px and 111px wide: with `sizes` the browser
 * takes the smallest file that is still sharp at its pixel density, instead of the full-size artwork.
 */
const LOGO_LILA = "/images/brand/isotipo-lila.webp"
const LOGO_DORADO = "/images/brand/isotipo-dorado.webp"
const INTRO_LOGO = {
  width: 556,
  height: 803,
  quality: 90,
  sizes: "(min-width: 768px) 111px, 78px",
} as const

/** Fired when the intro starts opening, so the hero can time its entrance to the reveal. */
export const INTRO_EXIT_EVENT = "queens:intro-exit"

/* ── Sparkle particle bursting outward ── */
function Spark({ angle, delay, dist, size, color }: { angle: number; delay: number; dist: number; size: number; color: string }) {
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * dist
  const y = Math.sin(rad) * dist
  return (
    <m.div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        marginTop: -(size / 2),
        marginLeft: -(size / 2),
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2.5}px ${color}`,
        willChange: "transform, opacity",
      }}
      initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.95, delay, ease: "easeOut" }}
    />
  )
}

const SEEN_KEY = "queens-intro-seen"
const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"])

/*
 * Holds the page still while the intro is up, and returns the function that lets go.
 *
 * It blocks the input that scrolls instead of setting `overflow: hidden`. Hiding the
 * scrollbar makes the page wider by the scrollbar's width, and narrower again the moment
 * the intro leaves — which is exactly when the hero is animating in, so on a desktop the
 * whole layout would jump sideways. This way the layout never changes.
 */
function holdScroll() {
  const block = (e: Event) => e.preventDefault()
  const blockKeys = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) e.preventDefault()
  }
  window.addEventListener("wheel", block, { passive: false })
  window.addEventListener("touchmove", block, { passive: false })
  window.addEventListener("keydown", blockKeys)
  return () => {
    window.removeEventListener("wheel", block)
    window.removeEventListener("touchmove", block)
    window.removeEventListener("keydown", blockKeys)
  }
}

export function IntroScreen() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [variant, setVariant] = useState<IntroVersionId | null>(null)
  const releaseScrollRef = useRef<(() => void) | null>(null)

  // Ends the intro exactly once, from whichever path gets there first —
  // the normal exit-animation callback, or the safety-net fallback below.
  const finish = () => {
    if (!releaseScrollRef.current) return
    releaseScrollRef.current()
    releaseScrollRef.current = null
    try {
      sessionStorage.setItem(SEEN_KEY, "1")
    } catch {
      /* storage blocked: nothing to remember */
    }
    setVisible(false)
  }

  useEffect(() => {
    // TEMPORARY (see /intro-versiones): `/?intro=<version>` plays one of the new versions and `/?intro=actual` this one, even if the
    // session already saw the intro. Delete with the preview page once the client picks.
    const asked = new URLSearchParams(window.location.search).get("intro")
    const forced = isIntroVersionId(asked) ? asked : null
    const replay = forced !== null || asked === "actual"
    // Storage can be blocked (some private modes and in-app browsers) and reading it then
    // throws. No storage means no intro, which is also what the hero assumes.
    let seen = true
    try {
      // Clearing the flag here makes the hero wait for the intro as well: this effect runs before the hero's (it comes first in the page).
      if (replay) sessionStorage.removeItem(SEEN_KEY)
      seen = !!sessionStorage.getItem(SEEN_KEY)
    } catch {
      /* keep `seen` */
    }
    if (seen) return
    // The intro is gated on sessionStorage, which only exists after mount, so it
    // deliberately never renders on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
    setVariant(forced)
    const release = holdScroll()
    releaseScrollRef.current = release
    if (forced) {
      // The new versions keep their own clock (IntroPlayer): nothing else to schedule here.
      return () => {
        release()
        releaseScrollRef.current = null
      }
    }
    const t = setTimeout(() => {
      setExiting(true)
      window.dispatchEvent(new Event(INTRO_EXIT_EVENT))
    }, 2400)
    // Safety net: if AnimatePresence's onExitComplete never fires (observed
    // under React Strict Mode's double-effect dev remount), the page would
    // stay held forever. Force the end a beat after the exit animation
    // should have finished either way.
    const safety = setTimeout(finish, 3600)
    return () => {
      clearTimeout(t)
      clearTimeout(safety)
      // Covers the Strict Mode dev remount: let go of this pass's hold so the
      // next mount starts clean instead of stacking on top of it.
      release()
      releaseScrollRef.current = null
    }
  }, [])

  const handleExitComplete = finish

  // Until the intro shows (and that includes the server render) these are hidden copies of its
  // logo. The intro only exists in the browser, so on its own the logo would not start
  // downloading until the page had hydrated — too late for its own entrance animation. This
  // puts it in the HTML, so it arrives with the page and is already there when the intro mounts.
  if (!visible)
    return (
      <>
        <Image {...INTRO_LOGO} src={LOGO_LILA} alt="" aria-hidden priority className="hidden" />
        <Image {...INTRO_LOGO} src={LOGO_DORADO} alt="" aria-hidden priority className="hidden" />
      </>
    )

  if (variant)
    return (
      <IntroPlayer
        id={variant}
        onExitStart={() => window.dispatchEvent(new Event(INTRO_EXIT_EVENT))}
        onDone={handleExitComplete}
      />
    )

  // Sparks follow the seam: the ones that fly to the left are lila, the ones to the right are gold, so the
  // two colours never mix in mid-air. The softer inner ring is ink, because crema would vanish on crema.
  const sideColor = (angle: number) => (Math.cos((angle * Math.PI) / 180) < 0 ? "#A48BA6" : "#BCA157")
  const sparks = [
    ...Array.from({ length: 18 }, (_, i) => ({
      angle: i * 20 + 10,
      delay: 0.16 + i * 0.008,
      size: seededRandom(i * 3) * 2.5 + 1.5,
      dist: 120 + seededRandom(i * 3 + 1) * 80,
      color: sideColor(i * 20 + 10),
    })),
    ...Array.from({ length: 9 }, (_, i) => ({
      angle: i * 40 + 12,
      delay: 0.26 + i * 0.01,
      size: 1.5,
      dist: 80 + seededRandom(i * 3 + 2) * 40,
      color: "color-mix(in oklab, var(--ink) 45%, transparent)",
    })),
  ]

  // Split down the middle like the portal underneath: two crema halves, Lado A (cosmetics) with a breath of
  // lila on the left and Lado B (spa) with a breath of gold on the right. They are the same crema as the
  // portal's halves, so when the curtains part sideways nothing changes colour: the portal is just there.
  const curtainLeft = {
    initial: { x: 0 },
    exit: { x: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const } },
  }
  const curtainRight = {
    initial: { x: 0 },
    exit: { x: "100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const } },
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <>
          {/* Curtains split open on exit */}
          <m.div
            key="curtain-left"
            variants={curtainLeft}
            initial="initial"
            exit="exit"
            className="fixed inset-y-0 left-0 w-1/2 z-[98] pointer-events-none"
            style={{
              willChange: "transform",
              background: "linear-gradient(135deg, color-mix(in oklab, var(--lila-soft) 55%, var(--crema)) 0%, var(--crema) 70%)",
            }}
          />
          <m.div
            key="curtain-right"
            variants={curtainRight}
            initial="initial"
            exit="exit"
            className="fixed inset-y-0 right-0 w-1/2 z-[98] pointer-events-none"
            style={{
              willChange: "transform",
              background:
                "linear-gradient(225deg, color-mix(in oklab, var(--dorado-soft) 22%, var(--crema)) 0%, var(--crema) 70%)",
            }}
          />

          <m.div
            key="intro-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Logo + bursts */}
            <div className="relative flex items-center justify-center">
              {sparks.map((s, i) => (
                <Spark key={i} {...s} />
              ))}

              <m.div
                initial={{ scale: 0, y: -60, opacity: 0, rotate: -16 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.55, ease: [0.34, 1.5, 0.64, 1], delay: 0.06 }}
                className="relative"
              >
                {/* One isotype, two halves: lila on the Cosmetics side, gold on the Spa side */}
                <div className="relative drop-shadow-[0_8px_24px_rgba(35,16,37,0.16)]">
                  <Image
                    {...INTRO_LOGO}
                    src={LOGO_LILA}
                    alt="Queens Cosmetics"
                    priority
                    className="relative h-28 w-auto md:h-40"
                    style={{ clipPath: "inset(0 50% 0 0)" }}
                  />
                  <Image
                    {...INTRO_LOGO}
                    src={LOGO_DORADO}
                    alt=""
                    aria-hidden
                    priority
                    className="absolute inset-0 h-full w-full"
                    style={{ clipPath: "inset(0 0 0 50%)" }}
                  />
                </div>
              </m.div>
            </div>

            {/* QUEENS — letter stagger */}
            <div className="flex mt-7 overflow-hidden gap-1 md:gap-2">
              {LETTERS.map((letter, i) => (
                <m.span
                  key={i}
                  className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-none select-none text-[var(--ink)]"
                  style={{ willChange: "transform" }}
                  initial={{ y: 90, opacity: 0, skewX: -6 }}
                  animate={{ y: 0, opacity: 1, skewX: 0 }}
                  transition={{ duration: 0.42, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  {letter}
                </m.span>
              ))}
            </div>

            {/* Tagline — each word sits on its own side of the seam, in its own colour */}
            <m.p
              className="grid w-full grid-cols-2 font-display uppercase tracking-[0.45em] text-[10px] md:text-xs mt-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              <span className="pr-5 text-right text-[var(--lila-deep)]">Cosmetics</span>
              <span className="pl-5 text-left text-[var(--dorado-deep)]">Spa</span>
            </m.p>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
