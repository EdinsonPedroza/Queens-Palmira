"use client"

import { useEffect, useState } from "react"
import { QueensLogo } from "./queens-logo"

export function IntroScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const seen = sessionStorage.getItem("queens-intro-seen")
    if (seen) {
      setVisible(false)
      return
    }
    const fade = setTimeout(() => setFading(true), 1600)
    const hide = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem("queens-intro-seen", "1")
    }, 2200)
    return () => {
      clearTimeout(fade)
      clearTimeout(hide)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-queens-gradient"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
      aria-hidden="true"
    >
      <div
        className="flex flex-col items-center gap-6"
        style={{
          animation: "fade-up 1s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div className="animate-glow-gold">
          <QueensLogo className="scale-[2.2]" />
        </div>
        <p className="font-display text-ink/60 text-xs font-medium tracking-[0.35em] uppercase">
          La belleza que mereces
        </p>
      </div>
    </div>
  )
}
