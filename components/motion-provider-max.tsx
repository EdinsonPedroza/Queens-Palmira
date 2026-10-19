"use client"

import { LazyMotion, domMax } from "framer-motion"
import type { ReactNode } from "react"

/*
 * `MotionProvider` plus layout animations and drag. It is a separate file on
 * purpose: importing `domMax` is what pulls that extra code into a page's bundle,
 * so only the pages that need it should import this.
 */
export function MotionProviderMax({ children }: { children: ReactNode }) {
  return <LazyMotion features={domMax} strict>{children}</LazyMotion>
}
