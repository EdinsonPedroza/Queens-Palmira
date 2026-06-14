"use client"

import { useEffect, useState } from "react"
import { m, useMotionValue, useSpring } from "framer-motion"

/**
 * Custom luxury cursor — a rose/gold trio: a snappy core dot, a laggy ring
 * follower, and an even laggier ambient halo. Grows over interactive elements
 * and shrinks on click. Only renders on devices with a fine pointer (mouse).
 */
export function CursorGlow() {
  const [visible, setVisible] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  // Core dot — snappy
  const dotX = useSpring(rawX, { stiffness: 850, damping: 40 })
  const dotY = useSpring(rawY, { stiffness: 850, damping: 40 })

  // Ring — medium lag
  const ringX = useSpring(rawX, { stiffness: 130, damping: 18 })
  const ringY = useSpring(rawY, { stiffness: 130, damping: 18 })

  // Halo — heavy lag
  const haloX = useSpring(rawX, { stiffness: 60, damping: 15 })
  const haloY = useSpring(rawY, { stiffness: 60, damping: 15 })

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    setVisible(true)
    document.documentElement.classList.add("queens-cursor-active")

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    const onDown = () => setClicked(true)
    const onUp = () => setClicked(false)
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("a, button, [role=button], input, textarea, select, label")) {
        setHovered(true)
      }
    }
    const onOut = () => setHovered(false)

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)

    return () => {
      document.documentElement.classList.remove("queens-cursor-active")
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
    }
  }, [rawX, rawY])

  if (!visible) return null

  return (
    <>
      {/* Halo — ambient rose-gold glow */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-[99996] rounded-full"
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovered ? 84 : 62,
          height: hovered ? 84 : 62,
          background:
            "radial-gradient(circle, rgba(255,105,180,0.14) 0%, rgba(212,175,55,0.08) 45%, transparent 72%)",
          transition: "width 0.3s, height 0.3s",
        }}
      />

      {/* Ring follower */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-[99997] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovered ? 46 : 34,
          height: hovered ? 46 : 34,
          border: `1.5px solid rgba(212, 175, 55, ${hovered ? 0.85 : 0.5})`,
          boxShadow: hovered
            ? "0 0 14px rgba(255,105,180,0.45), inset 0 0 8px rgba(212,175,55,0.15)"
            : "0 0 6px rgba(212,175,55,0.25)",
          transition: "width 0.25s, height 0.25s, border-color 0.25s, box-shadow 0.25s",
        }}
        animate={{ scale: clicked ? 0.7 : 1 }}
        transition={{ duration: 0.12 }}
      />

      {/* Core dot */}
      <m.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: hovered ? 7 : 6,
          height: hovered ? 7 : 6,
          backgroundColor: "#FF69B4",
          boxShadow: "0 0 8px #FF69B4, 0 0 16px rgba(212,175,55,0.6)",
          transition: "width 0.2s, height 0.2s",
        }}
        animate={{ scale: clicked ? 0.5 : 1 }}
        transition={{ duration: 0.12 }}
      />
    </>
  )
}
