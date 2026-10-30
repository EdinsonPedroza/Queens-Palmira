"use client"

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react"
import { useSeen } from "@/hooks/use-seen"
import { cn } from "@/lib/utils"

/*
 * A block that comes into place (`reveal-*` in globals.css) the first time it scrolls into view. It is a CSS animation switched on by `useSeen`, not Framer's `initial` +
 * `animate`: Framer's entrance sends the element back to its starting style for one frame when it ends (it was seen as a blink, see CLAUDE.md), and on an iPad it did not
 * show the blocks at all. The block is VISIBLE in the HTML and until the page is running in the browser; only then does a block that is still below the screen wait,
 * transparent, for its turn (see hooks/use-seen.ts). With "reduce motion" it simply appears.
 */
const KINDS = {
  up: "motion-safe:animate-[reveal-up_700ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
  left: "motion-safe:animate-[reveal-left_450ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
  right: "motion-safe:animate-[reveal-right_650ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
  fade: "motion-safe:animate-[reveal-fade_900ms_ease-out_backwards]",
  pop: "motion-safe:animate-[reveal-pop_600ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
  grow: "motion-safe:animate-[reveal-grow_500ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
  zoom: "motion-safe:animate-[reveal-zoom_800ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
} as const

export function Reveal({
  as,
  delay = 0,
  kind = "up",
  className,
  style,
  children,
  "aria-hidden": ariaHidden,
}: {
  as?: ElementType
  /** ms to wait once it is in view (for staggering a list). */
  delay?: number
  /** How it arrives: rises (default), slides in from the left or the right, fades, pops (rises while growing from 85 %), grows (from 80 %) or zooms (rises while growing from 96 %). */
  kind?: keyof typeof KINDS
  className?: string
  style?: CSSProperties
  children?: ReactNode
  "aria-hidden"?: boolean
}) {
  const Tag = as ?? "div"
  const ref = useRef<HTMLElement>(null)
  const seen = useSeen(ref)
  return (
    <Tag
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn(className, seen ? KINDS[kind] : "opacity-0")}
      style={{ ...style, animationDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
