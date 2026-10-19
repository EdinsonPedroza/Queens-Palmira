"use client"

import { useEffect, useRef, useState } from "react"
import { m, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { seededRandom } from "@/lib/utils"

const LETTERS = "QUEENS".split("")

/*
 * The logo at the centre. It is drawn 112px tall on phones and 160px from `md`
 * (h-28 / md:h-40), that is 78px and 111px wide: with `sizes` the browser takes
 * the smallest file that is still sharp at its pixel density, instead of the
 * full-size artwork.
 */
const INTRO_LOGO = {
  src: "/images/brand/isotipo-crema.webp",
  width: 556,
  height: 803,
  quality: 90,
  sizes: "(min-width: 768px) 111px, 78px",
} as const

/** Fired when the intro starts opening, so the hero can time its entrance to the reveal. */
export const INTRO_EXIT_EVENT = "queens:intro-exit"

/* ── Expanding ring ── */
function Ring({ delay, scaleTo, color, opacity }: { delay: number; scaleTo: number; color: string; opacity: number }) {
  return (
    <m.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 150, height: 150, border: `1.5px solid ${color}`, willChange: "transform, opacity" }}
      initial={{ scale: 1, opacity }}
      animate={{ scale: scaleTo, opacity: 0 }}
      transition={{ duration: 1.7, delay, ease: "easeOut" }}
    />
  )
}

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
    // Storage can be blocked (some private modes and in-app browsers) and reading it then
    // throws. No storage means no intro, which is also what the hero assumes.
    let seen = true
    try {
      seen = !!sessionStorage.getItem(SEEN_KEY)
    } catch {
      /* keep `seen` */
    }
    if (seen) return
    // The intro is gated on sessionStorage, which only exists after mount, so it
    // deliberately never renders on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
    const release = holdScroll()
    releaseScrollRef.current = release
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

  // Until the intro shows (and that includes the server render) this is a hidden copy of its
  // logo. The intro only exists in the browser, so on its own the logo would not start
  // downloading until the page had hydrated — too late for its own entrance animation. This
  // puts it in the HTML, so it arrives with the page and is already there when the intro mounts.
  if (!visible) return <Image {...INTRO_LOGO} alt="" aria-hidden priority className="hidden" />

  // 18 sparks alternating lila / gold + a softer inner ring
  const sparks = [
    ...Array.from({ length: 18 }, (_, i) => ({
      angle: i * 20,
      delay: 0.16 + i * 0.008,
      size: seededRandom(i * 3) * 2.5 + 1.5,
      dist: 120 + seededRandom(i * 3 + 1) * 80,
      color: i % 3 === 0 ? "#A48BA6" : "#BCA157",
    })),
    ...Array.from({ length: 9 }, (_, i) => ({
      angle: i * 40 + 12,
      delay: 0.26 + i * 0.01,
      size: 1.5,
      dist: 80 + seededRandom(i * 3 + 2) * 40,
      color: "#FFFFEE",
    })),
  ]

  // Split down the middle like the hero underneath: Lado A (cosmetics, rose) on
  // the left, Lado B (spa, gold) on the right — the curtains part sideways.
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
            style={{ willChange: "transform", background: "linear-gradient(135deg, var(--lila) 0%, var(--lila-deep) 100%)" }}
          />
          <m.div
            key="curtain-right"
            variants={curtainRight}
            initial="initial"
            exit="exit"
            className="fixed inset-y-0 right-0 w-1/2 z-[98] pointer-events-none"
            style={{ willChange: "transform", background: "linear-gradient(135deg, var(--dorado) 0%, var(--dorado-deep) 100%)" }}
          />

          <m.div
            key="intro-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Ambient radial glow */}
            <m.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.3] }}
              transition={{ duration: 2.2, times: [0, 0.4, 1] }}
              style={{
                background:
                  "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(255,255,255,0.7) 0%, rgba(255,255,238,0.3) 38%, transparent 70%)",
              }}
            />

            {/* Center seam between the two personalities */}
            <m.div
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-center pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #BCA157 30%, #BCA157 70%, transparent)" }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.7 }}
              transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Logo + bursts */}
            <div className="relative flex items-center justify-center">
              <Ring delay={0.1} scaleTo={2.2} color="#BCA157" opacity={0.45} />
              <Ring delay={0.22} scaleTo={3.1} color="#462649" opacity={0.3} />
              <Ring delay={0.36} scaleTo={4.2} color="#BCA157" opacity={0.18} />
              <Ring delay={0.5} scaleTo={5.5} color="#ffffff" opacity={0.12} />

              {sparks.map((s, i) => (
                <Spark key={i} {...s} />
              ))}

              <m.div
                initial={{ scale: 0, y: -60, opacity: 0, rotate: -16 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.55, ease: [0.34, 1.5, 0.64, 1], delay: 0.06 }}
                className="relative"
              >
                <m.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0.5] }}
                  transition={{ duration: 1.3, times: [0, 0.3, 1] }}
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
                    filter: "blur(22px)",
                    transform: "scale(1.7)",
                  }}
                />
                <Image
                  {...INTRO_LOGO}
                  alt="Queens Cosmetics"
                  priority
                  className="relative h-28 w-auto md:h-40 drop-shadow-[0_8px_30px_rgba(70,38,73,0.35)]"
                />
              </m.div>
            </div>

            {/* QUEENS — letter stagger */}
            <div className="flex mt-7 overflow-hidden gap-1 md:gap-2">
              {LETTERS.map((letter, i) => (
                <m.span
                  key={i}
                  className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-none select-none text-white"
                  style={{ willChange: "transform", textShadow: "0 4px 24px color-mix(in oklab, var(--face) 40%, transparent)" }}
                  initial={{ y: 90, opacity: 0, skewX: -6 }}
                  animate={{ y: 0, opacity: 1, skewX: 0 }}
                  transition={{ duration: 0.42, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  {letter}
                </m.span>
              ))}
            </div>

            {/* Animated underline */}
            <m.div
              className="h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4 origin-center"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: "min(440px, 84vw)", willChange: "transform" }}
            />

            {/* Tagline — each word sits on its own side of the seam */}
            <m.p
              className="grid w-full grid-cols-2 font-display uppercase tracking-[0.45em] text-[10px] md:text-xs mt-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              <span className="pr-5 text-right text-white/85">Cosmetics</span>
              <span className="pl-5 text-left text-white/85">Spa</span>
            </m.p>

            {/* Loading bar */}
            <m.div
              className="absolute bottom-0 left-0 h-[2px] origin-left"
              style={{
                background: "linear-gradient(90deg, #BCA157, #FFFFEE, #462649)",
                willChange: "transform",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.3, delay: 0.08, ease: "linear" }}
            />

            {/* Corner brackets */}
            {[
              "top-5 left-5 border-t border-l",
              "top-5 right-5 border-t border-r",
              "bottom-5 left-5 border-b border-l",
              "bottom-5 right-5 border-b border-r",
            ].map((pos, i) => (
              <m.div
                key={i}
                className={`absolute w-8 h-8 ${pos} border-white/45`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.55 + i * 0.06 }}
              />
            ))}
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
