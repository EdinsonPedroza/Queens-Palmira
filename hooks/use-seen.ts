"use client"

import { useEffect, useState, type RefObject } from "react"

/*
 * "Has this block come into view?" for the entrances below the hero (Reveal, the footer, the gallery, the location, the spa's cards...).
 *
 * It is NOT Framer Motion's `useInView` / `whileInView`, and it does not start hidden. Those started every block at `opacity: 0` in the HTML the server writes and relied on
 * a script to show it: on an iPad whole sections (Conócenos, Ubicación, the footer) stayed blank because that script never brought them in. Now:
 *  - the HTML, and the first render, say `true`: the block is visible and a CSS animation (`backwards`) may play once, off screen, harmlessly;
 *  - once the page is alive in the browser (after hydration), a block that sits completely BELOW the fold is switched to `false` (hidden); one already on screen (or above
 *    it, when the browser restores the scroll) is left alone;
 *  - the hidden block is switched back to `true` the first time its top comes within `margin` px of the bottom of the screen, and stays `true`.
 * If anything in this chain fails (the script, the hydration, the listeners), the block is simply visible: nothing is ever lost. The check is plain geometry on `scroll`,
 * `resize` and `load` (throttled), not IntersectionObserver, so there is no observer that can fail to fire.
 */

interface Waiting {
  el: Element
  margin: number
  show: () => void
}

const waiting = new Set<Waiting>()
let timer = 0
let listening = false

function check() {
  timer = 0
  const bottom = window.innerHeight
  for (const w of [...waiting]) {
    if (w.el.getBoundingClientRect().top < bottom - w.margin) {
      waiting.delete(w)
      w.show()
    }
  }
  if (!waiting.size) stop()
}

/** Trailing throttle: at most one pass of measuring every 100 ms while the page scrolls. */
function schedule() {
  if (!timer) timer = window.setTimeout(check, 100)
}

function listen() {
  if (listening) return
  listening = true
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  window.addEventListener("load", schedule)
}

function stop() {
  listening = false
  window.removeEventListener("scroll", schedule)
  window.removeEventListener("resize", schedule)
  window.removeEventListener("load", schedule)
}

/**
 * Calls `show` once, the first time the top of `el` is within `margin` px of the bottom edge of the screen (a negative margin means "this far BEFORE it gets there").
 * Plain geometry on scroll / resize / load, no IntersectionObserver. Returns the function that cancels it.
 */
export function onReached(el: Element, margin: number, show: () => void): () => void {
  const entry: Waiting = { el, margin, show }
  waiting.add(entry)
  listen()
  // Layout may settle after the first measure (images, fonts): measure once the page has had a moment
  schedule()
  return () => {
    waiting.delete(entry)
    if (!waiting.size) stop()
  }
}

/**
 * `true` = show it (the default, also on the server). `margin` is how far (px) the block's top must be above the bottom edge of the screen before it counts as seen.
 * Watch an element that is never clipped by an `overflow-hidden` parent that it starts translated out of.
 */
export function useSeen(ref: RefObject<Element | null>, margin = 40): boolean {
  const [seen, setSeen] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // On screen, or above it: leave it visible. Only what is wholly below the fold waits for its turn.
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setSeen(false)
    return onReached(el, margin, () => setSeen(true))
  }, [ref, margin])

  return seen
}
