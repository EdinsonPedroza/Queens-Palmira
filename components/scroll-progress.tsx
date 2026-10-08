"use client"

import { useEffect, useRef } from "react"

export function ScrollProgress() {
  // Writes the bar directly via ref instead of React state: a scroll handler
  // can fire dozens of times per second, and routing that through setState +
  // re-render on every tick is what was causing the scroll jank on mobile.
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const h = document.documentElement
      const scrolled = h.scrollTop
      const max = h.scrollHeight - h.clientHeight
      const progress = max > 0 ? scrolled / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-queens-gradient-intense"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  )
}
