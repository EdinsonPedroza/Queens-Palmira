"use client"

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react"
import { useInView } from "framer-motion"
import { cn } from "@/lib/utils"

/*
 * A block that rises into place (`reveal-up`, globals.css) the first time it scrolls into view. It is a CSS animation switched on by `useInView`, not Framer's
 * `initial` + `animate`: Framer's entrance sends the element back to its starting style for one frame when it ends, and it was seen as a blink (see CLAUDE.md).
 * Before it is in view the block is transparent; with "reduce motion" it simply appears.
 */
export function Reveal({
  as,
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType
  /** ms to wait once it is in view (for staggering a list). */
  delay?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const Tag = as ?? "div"
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: "-40px" })
  return (
    <Tag
      ref={ref}
      className={cn(className, seen ? "motion-safe:animate-[reveal-up_700ms_cubic-bezier(0.16,1,0.3,1)_backwards]" : "opacity-0")}
      style={{ ...style, animationDelay: seen && delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
