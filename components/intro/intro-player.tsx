"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { preload } from "react-dom"
import { INTRO_VERSIONS, type IntroVersionId } from "./intro-versions"
import styles from "./intro.module.css"

/** The official logo as a mask (see scripts/brand-imagotipo.mjs): the intro paints it in lila or crema. */
export const INTRO_LOGO_SRC = "/images/brand/imagotipo-cosmetics.webp"

interface IntroPlayerProps {
  id: IntroVersionId
  /** Fills its parent (a preview frame) instead of the whole screen. */
  contained?: boolean
  /** The exit starts: the portal's own entrance is timed to this moment. */
  onExitStart?: () => void
  /** The exit is over; the player can be removed. */
  onDone?: () => void
  /** Makes the whole intro a button (used by the full-screen preview to close it). */
  onClick?: () => void
}

/*
 * Plays one version of the intro: it only owns the clock. `data-phase` goes from "in" to "out" when the exit starts and the
 * CSS does the rest (a timer, not an animation callback: nothing here can get stuck waiting for an event that never comes).
 * With "reduce motion" the version stays still and the exit is a short fade.
 */
export function IntroPlayer({ id, contained = false, onExitStart, onDone, onClick }: IntroPlayerProps) {
  const version = INTRO_VERSIONS[id]
  const [phase, setPhase] = useState<"in" | "out">("in")
  const callbacks = useRef({ onExitStart, onDone })

  // Starts downloading the logo before the first animation frame needs it.
  preload(INTRO_LOGO_SRC, { as: "image", crossOrigin: "anonymous" })

  useEffect(() => {
    callbacks.current = { onExitStart, onDone }
  })

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const exitAt = reduced ? 900 : version.exitAt
    const exitMs = reduced ? 320 : version.exitMs
    const out = setTimeout(() => {
      setPhase("out")
      callbacks.current.onExitStart?.()
    }, exitAt)
    const done = setTimeout(() => callbacks.current.onDone?.(), exitAt + exitMs + 100)
    return () => {
      clearTimeout(out)
      clearTimeout(done)
    }
  }, [version])

  const Scene = version.Scene
  return (
    <div
      className={styles.root}
      data-v={id}
      data-phase={phase}
      data-contained={contained || undefined}
      data-clickable={onClick ? "" : undefined}
      aria-hidden
      onClick={onClick}
      style={{ "--mask": `url(${INTRO_LOGO_SRC})` } as CSSProperties}
    >
      <Scene />
    </div>
  )
}
