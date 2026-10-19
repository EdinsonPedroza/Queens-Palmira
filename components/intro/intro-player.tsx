"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { preload } from "react-dom"
import { cn } from "@/lib/utils"
import styles from "./intro.module.css"

/** The official logo as a mask (see scripts/brand-imagotipo.mjs): the intro paints it in lila or crema. */
export const INTRO_LOGO_SRC = "/images/brand/imagotipo-cosmetics.webp"

/** ms until the exit starts (which is also when the portal's own entrance starts) and how long the exit lasts. */
const EXIT_AT = 2000
const EXIT_MS = 800

const word = (side: "L" | "R", tone: "cream" | "lila") =>
  cn("font-display", styles.tag, side === "L" ? styles.tagL : styles.tagR, tone === "cream" ? styles.onCream : styles.onLila, styles.tagIn)

const logo = (tone: "lila" | "crema") => cn(styles.mask, styles.logo, tone === "lila" ? styles.lila : styles.crema, styles.logoIn)

/*
 * "Dos caras": two layers with the same logo in the same place. The left one is crema with a lila logo; the right one (clipped to the right half)
 * is lila with a crema logo. It wipes in from the right edge to the axis, so the logo's right half flips colour right there, and on the way out
 * each half carries its half of the logo to its own side.
 */
export function IntroPlayer({ onExitStart, onDone }: { onExitStart?: () => void; onDone?: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in")
  const callbacks = useRef({ onExitStart, onDone })

  // Starts downloading the logo before the first animation frame needs it. It is a CSS mask, which the browser fetches in CORS mode,
  // so the preload has to be `anonymous` too or the browser would not reuse it.
  preload(INTRO_LOGO_SRC, { as: "image", crossOrigin: "anonymous" })

  useEffect(() => {
    callbacks.current = { onExitStart, onDone }
  })

  // A timer, not an animation callback: nothing here can get stuck waiting for an event that never comes.
  // With "reduce motion" the composition stays still and the exit is a short fade.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const exitAt = reduced ? 900 : EXIT_AT
    const exitMs = reduced ? 320 : EXIT_MS
    const out = setTimeout(() => {
      setPhase("out")
      callbacks.current.onExitStart?.()
    }, exitAt)
    const done = setTimeout(() => callbacks.current.onDone?.(), exitAt + exitMs + 100)
    return () => {
      clearTimeout(out)
      clearTimeout(done)
    }
  }, [])

  return (
    <div className={styles.root} data-phase={phase} aria-hidden style={{ "--mask": `url(${INTRO_LOGO_SRC})` } as CSSProperties}>
      <div className={cn(styles.layer, styles.cream, styles.left)}>
        <div className={logo("lila")} />
        <span className={word("L", "cream")}>La tienda</span>
      </div>
      <div className={cn(styles.layer, styles.lilaBg, styles.right)}>
        <div className={logo("crema")} />
        <span className={word("R", "lila")}>El spa</span>
      </div>
    </div>
  )
}
