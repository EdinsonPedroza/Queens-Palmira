"use client"

import { useMemo } from "react"
import { seededRandom } from "@/lib/utils"

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
  // Seeded, not Math.random(): the Hero renders on the server, so random values
  // generated during render would differ on the client and break hydration.
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const s = i * 7
        return {
          id: i,
          left: `${3 + seededRandom(s) * 94}%`,
          size: seededRandom(s + 1) * 4 + 2,
          dur: `${seededRandom(s + 2) * 5 + 6}s`,
          delay: `${seededRandom(s + 3) * 8}s`,
          drift: `${(seededRandom(s + 4) - 0.5) * 90}px`,
          opacity: seededRandom(s + 5) * 0.5 + 0.3,
          rose: i % 3 === 0,
        }
      }),
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
