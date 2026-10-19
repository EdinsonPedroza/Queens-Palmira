"use client"

import { useEffect, useRef, useState } from "react"
import { preload } from "react-dom"
import { IntroPlayer, INTRO_LOGO_SRC } from "@/components/intro/intro-player"

/** Fired when the intro starts opening, so the hero can time its entrance to the reveal. */
export const INTRO_EXIT_EVENT = "queens:intro-exit"

/*
 * The entrance the client picked (19 Oct 2026): "Dos caras". Crema on the left with the logo in lila, lila on the right with the
 * logo in crema, so the logo changes colour right on the axis; then the screen opens like double doors onto the portal. Only lila
 * and crema (the two logo pairs the client approved) and no decorative lines. See components/intro/.
 */
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
  const releaseScrollRef = useRef<(() => void) | null>(null)

  // Ends the intro exactly once and lets the page scroll again.
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
    return () => {
      // Covers the Strict Mode dev remount: let go of this pass's hold so the next mount starts clean.
      release()
      releaseScrollRef.current = null
    }
  }, [])

  // Until the intro shows (and that includes the server render) this only asks for the logo. The intro exists only in the browser,
  // so on its own the logo would not start downloading until the page had hydrated, too late for its own entrance. This puts the
  // request in the HTML, so the file arrives with the page and is already there when the intro mounts.
  if (!visible) {
    preload(INTRO_LOGO_SRC, { as: "image", crossOrigin: "anonymous" })
    return null
  }

  // The player keeps its own clock: it tells the hero when the doors start to open and when it can be removed.
  return <IntroPlayer onExitStart={() => window.dispatchEvent(new Event(INTRO_EXIT_EVENT))} onDone={finish} />
}
