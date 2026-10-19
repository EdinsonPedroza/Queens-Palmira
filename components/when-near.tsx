"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useInView } from "framer-motion"

/** True once the page has finished loading and the main thread has had a quiet moment. */
function usePageSettled() {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const settle = () => setSettled(true)
    const arm = () => {
      // Safari has no requestIdleCallback
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(settle, { timeout: 1500 })
      } else {
        timeoutId = setTimeout(settle, 200)
      }
    }

    if (document.readyState === "complete") arm()
    else window.addEventListener("load", arm, { once: true })

    return () => {
      window.removeEventListener("load", arm)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      clearTimeout(timeoutId)
    }
  }, [])

  return settled
}

interface WhenNearProps {
  children: ReactNode
  /** Shown in the same box until the real thing mounts. */
  fallback: ReactNode
  /** How far ahead of the viewport to start. Any IntersectionObserver rootMargin. */
  margin?: `${number}px` | `${number}px ${number}px`
  className?: string
}

/*
 * Holds heavy, below-the-fold content back until it is about to be needed, so it never
 * competes with what the visitor sees first. The map is the case it was written for:
 * Leaflet plus a dozen tile requests, at the bottom of pages most visitors never scroll
 * to the end of.
 *
 * `children` mount when the box comes within `margin` of the viewport AND the page has
 * finished loading (on the portal the map sits right under the hero, so distance alone
 * would start it straight away). If the visitor actually reaches the box first, it mounts
 * at once: by then it is the thing they are looking at.
 */
export function WhenNear({ children, fallback, margin = "800px 0px", className }: WhenNearProps) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInView(ref, { once: true, margin })
  const visible = useInView(ref, { once: true })
  const settled = usePageSettled()

  return (
    <div ref={ref} className={className}>
      {visible || (near && settled) ? children : fallback}
    </div>
  )
}
