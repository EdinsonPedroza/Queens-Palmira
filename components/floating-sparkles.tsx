"use client"

import { useMemo } from "react"

interface FloatingSparklesProps {
  /** Number of particles. */
  count?: number
  /** Extra classes for the absolute-positioned container. */
  className?: string
}

/**
 * Rose/gold stardust drifting upward — CSS-animated (`.sparkle`) so it costs
 * nothing on the JS thread. Drop inside any `position: relative` section.
 */
export function FloatingSparkles({ count = 22, className = "" }: FloatingSparklesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${3 + Math.random() * 94}%`,
        size: Math.random() * 4 + 2,
        dur: `${Math.random() * 5 + 6}s`,
        delay: `${Math.random() * 8}s`,
        drift: `${(Math.random() - 0.5) * 90}px`,
        opacity: Math.random() * 0.5 + 0.3,
        rose: i % 3 === 0,
      })),
    [count]
  )

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`sparkle${p.rose ? " rose" : ""}`}
          style={
            {
              left: p.left,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              "--sparkle-dur": p.dur,
              "--sparkle-delay": p.delay,
              "--sparkle-drift": p.drift,
              "--sparkle-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
