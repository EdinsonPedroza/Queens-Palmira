"use client"

import { useEffect, useState } from "react"
import { m, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { seededRandom } from "@/lib/utils"

const LETTERS = "QUEENS".split("")

/* ── Expanding ring ── */
function Ring({ delay, scaleTo, color, opacity }: { delay: number; scaleTo: number; color: string; opacity: number }) {
  return (
    <m.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: 150, height: 150, border: `1.5px solid ${color}`, willChange: "transform, opacity" }}
      initial={{ scale: 1, opacity }}
      animate={{ scale: scaleTo, opacity: 0 }}
      transition={{ duration: 1.7, delay, ease: "easeOut" }}
    />
  )
}

/* ── Sparkle particle bursting outward ── */
function Spark({ angle, delay, dist, size, color }: { angle: number; delay: number; dist: number; size: number; color: string }) {
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * dist
  const y = Math.sin(rad) * dist
  return (
    <m.div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: "50%",
        left: "50%",
        marginTop: -(size / 2),
        marginLeft: -(size / 2),
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 2.5}px ${color}`,
        willChange: "transform, opacity",
      }}
      initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.95, delay, ease: "easeOut" }}
    />
  )
}

export function IntroScreen() {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("queens-intro-seen")) return
    // The intro is gated on sessionStorage, which only exists after mount, so it
    // deliberately never renders on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
    document.body.style.overflow = "hidden"
    const t = setTimeout(() => setExiting(true), 2400)
    return () => clearTimeout(t)
  }, [])

  const handleExitComplete = () => {
    document.body.style.overflow = ""
    sessionStorage.setItem("queens-intro-seen", "1")
    setVisible(false)
  }

  if (!visible) return null

  // 18 sparks alternating gold / rose + a softer inner ring
  const sparks = [
    ...Array.from({ length: 18 }, (_, i) => ({
      angle: i * 20,
      delay: 0.16 + i * 0.008,
      size: seededRandom(i * 3) * 2.5 + 1.5,
      dist: 120 + seededRandom(i * 3 + 1) * 80,
      color: i % 3 === 0 ? "#FF69B4" : "#D4AF37",
    })),
    ...Array.from({ length: 9 }, (_, i) => ({
      angle: i * 40 + 12,
      delay: 0.26 + i * 0.01,
      size: 1.5,
      dist: 80 + seededRandom(i * 3 + 2) * 40,
      color: "#fff4d6",
    })),
  ]

  const curtainTop = {
    initial: { y: 0 },
    exit: { y: "-100%", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const } },
  }
  const curtainBottom = {
    initial: { y: 0 },
    exit: { y: "100%", transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const } },
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <>
          {/* Curtains split open on exit */}
          <m.div
            key="curtain-top"
            variants={curtainTop}
            initial="initial"
            exit="exit"
            className="fixed inset-x-0 top-0 h-1/2 z-[98] pointer-events-none bg-queens-gradient"
            style={{ willChange: "transform" }}
          />
          <m.div
            key="curtain-bottom"
            variants={curtainBottom}
            initial="initial"
            exit="exit"
            className="fixed inset-x-0 bottom-0 h-1/2 z-[98] pointer-events-none bg-queens-gradient"
            style={{ willChange: "transform" }}
          />

          <m.div
            key="intro-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center overflow-hidden bg-queens-gradient"
          >
            {/* Ambient radial glow */}
            <m.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.3] }}
              transition={{ duration: 2.2, times: [0, 0.4, 1] }}
              style={{
                background:
                  "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(255,255,255,0.7) 0%, rgba(255,244,214,0.3) 38%, transparent 70%)",
              }}
            />

            {/* Logo + bursts */}
            <div className="relative flex items-center justify-center">
              <Ring delay={0.1} scaleTo={2.2} color="#D4AF37" opacity={0.45} />
              <Ring delay={0.22} scaleTo={3.1} color="#FF69B4" opacity={0.3} />
              <Ring delay={0.36} scaleTo={4.2} color="#D4AF37" opacity={0.18} />
              <Ring delay={0.5} scaleTo={5.5} color="#ffffff" opacity={0.12} />

              {sparks.map((s, i) => (
                <Spark key={i} {...s} />
              ))}

              <m.div
                initial={{ scale: 0, y: -60, opacity: 0, rotate: -16 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.55, ease: [0.34, 1.5, 0.64, 1], delay: 0.06 }}
                className="relative"
              >
                <m.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0.5] }}
                  transition={{ duration: 1.3, times: [0, 0.3, 1] }}
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
                    filter: "blur(22px)",
                    transform: "scale(1.7)",
                  }}
                />
                <Image
                  src="/images/logoFondo.webp"
                  alt="Queens Cosmetics"
                  width={120}
                  height={120}
                  priority
                  quality={85}
                  className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_8px_30px_rgba(212,175,55,0.5)]"
                />
              </m.div>
            </div>

            {/* QUEENS — letter stagger */}
            <div className="flex mt-7 overflow-hidden gap-1 md:gap-2">
              {LETTERS.map((letter, i) => (
                <m.span
                  key={i}
                  className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-none select-none text-white"
                  style={{ willChange: "transform", textShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
                  initial={{ y: 90, opacity: 0, skewX: -6 }}
                  animate={{ y: 0, opacity: 1, skewX: 0 }}
                  transition={{ duration: 0.42, delay: 0.4 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  {letter}
                </m.span>
              ))}
            </div>

            {/* Animated underline */}
            <m.div
              className="h-px bg-gradient-to-r from-transparent via-white to-transparent mt-4 origin-center"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: "min(440px, 84vw)", willChange: "transform" }}
            />

            {/* Tagline */}
            <m.p
              className="font-display uppercase tracking-[0.45em] text-ink/55 text-[10px] md:text-xs mt-4 pl-[0.45em]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              La belleza que mereces
            </m.p>

            {/* Loading bar */}
            <m.div
              className="absolute bottom-0 left-0 h-[2px] origin-left"
              style={{
                background: "linear-gradient(90deg, #D4AF37, #fff4d6, #FF69B4)",
                willChange: "transform",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.3, delay: 0.08, ease: "linear" }}
            />

            {/* Corner brackets */}
            {[
              "top-5 left-5 border-t border-l",
              "top-5 right-5 border-t border-r",
              "bottom-5 left-5 border-b border-l",
              "bottom-5 right-5 border-b border-r",
            ].map((pos, i) => (
              <m.div
                key={i}
                className={`absolute w-8 h-8 ${pos} border-white/45`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.55 + i * 0.06 }}
              />
            ))}
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
