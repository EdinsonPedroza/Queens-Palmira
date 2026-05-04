"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (scrolled / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-queens-gradient-intense transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
