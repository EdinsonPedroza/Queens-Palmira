import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * "smooth" for scrollTo / scrollIntoView, unless the visitor asked for less motion (prefers-reduced-motion): the CSS `scroll-behavior` on <html> is
 * switched off for them in globals.css, but a scroll started from script with an explicit behavior ignores it, so those calls use this.
 */
export function scrollBehavior(): ScrollBehavior {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
}

/**
 * Deterministic pseudo-random in [0, 1) (mulberry32) — integer ops only, so it
 * yields identical values on the server and in every browser engine.
 *
 * Use this instead of `Math.random()` for anything computed during render:
 * `Math.random()` produces different values on the server and on the client,
 * which breaks hydration.
 */
export function seededRandom(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

/*
 * Colombian pesos, e.g. "$ 45.000" (a no-break space after the sign, a dot every three digits, no decimals).
 *
 * Whole numbers (every price in the site) are formatted by hand. `new Intl.NumberFormat("es-CO", { style: "currency", ... })` costs about 17 ms
 * the first time it is created (the browser loads its locale data; 69 ms on a slow phone) and every product card prints a price, so it was
 * the single biggest cost of hydrating the catalog. The hand-made string is byte-for-byte the one Intl produces (checked for every integer from
 * -1 000 000 to 5 000 000 plus millions of random ones, in Node and in Chrome); anything else (decimals, NaN, huge numbers) still goes through Intl.
 */
let intl: Intl.NumberFormat | undefined

export function formatCOP(value: number): string {
  if (Number.isSafeInteger(value) && value !== 0) {
    const digits = String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return `${value < 0 ? "-" : ""}$\u00A0${digits}`
  }
  if (value === 0 && !Object.is(value, -0)) return "$\u00A00"
  intl ??= new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
  return intl.format(value)
}
