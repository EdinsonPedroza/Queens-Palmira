"use client"

import { LazyMotion, domAnimation } from "framer-motion"
import type { ReactNode } from "react"

/*
 * Framer Motion's features for a page that animates. Each animated page wraps
 * itself in this (the legal pages do not animate, so they skip it and never
 * download Framer Motion).
 *
 * `domAnimation` covers everything the site uses except layout animations
 * (`layout` / `layoutId`) and drag. A page that needs those uses
 * `MotionProviderMax` instead; no page of the site needs it today (only the
 * temporary /cosmetics/estilos still mounts it).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
}
