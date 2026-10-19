import Image from "next/image"
import { cn } from "@/lib/utils"

interface QueensLogoProps {
  className?: string
  /** dorado (spa, default), "deep" (darker gold, for busy light photos) or lila (cosmetics) on crema; "white" is crema, for dark surfaces. */
  variant?: "default" | "deep" | "lila" | "white"
  /** Height of the isotipo in px (it is taller than wide). */
  size?: number
  /**
   * Preload it. Only for the logo that is on screen the moment the page opens (the
   * navbar's): the footer's is a full page away and must not compete with the hero.
   */
  priority?: boolean
  /**
   * Show the full lettering "Queens" + "cosmetics" (the official imagotipo's text block) instead of just "Queens".
   * Only exists in lila and crema (the store's colours); any other variant ignores it.
   */
  cosmetics?: boolean
}

// Isotipo 556×803 and wordmark 640×170, both cut from the official imagotipo.
// The lettering there is outlined artwork, heavier than any cut of The Seasons,
// so the brand name is shown as the image and never retyped in a font.
const ISOTIPO_RATIO = 556 / 803
const WORDMARK_RATIO = 640 / 170
const WORDMARK_TO_ISOTIPO = 0.42
// "Queens" + "cosmetics" block, 1508×595 in the imagotipo (stored at 900 px wide). Its width is the width of "Queens".
const LOCKUP_RATIO = 1508 / 595

export function QueensLogo({ className, variant = "default", size = 48, priority = false, cosmetics = false }: QueensLogoProps) {
  const ink = variant === "white" ? "crema" : variant === "lila" ? "lila" : variant === "deep" ? "dorado-deep" : "dorado"
  const wordmarkH = Math.round(size * WORDMARK_TO_ISOTIPO)
  // Both sides rounded from the real ratio. With a rounded width and an unrounded height, the browser
  // lays the image out one pixel off its own attributes (55×79 instead of 55×80) and Next warns about it.
  // `sizes` makes Next list every width it can make, so a 3x phone picks one that is sharp at its density;
  // without it, a fixed-size image only gets 1x and 2x files and goes soft on 3x screens.
  const isotipoW = Math.round(size * ISOTIPO_RATIO)
  const isotipoH = Math.round(isotipoW / ISOTIPO_RATIO)
  const lockupInk = variant === "white" ? "crema" : variant === "lila" ? "lila" : null
  const lockupW = Math.round(wordmarkH * WORDMARK_RATIO)
  const lockupH = Math.round(lockupW / LOCKUP_RATIO)
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={`/images/brand/isotipo-${ink}.webp`}
        alt="Queens Cosmetics"
        width={isotipoW}
        height={isotipoH}
        sizes={`${isotipoW}px`}
        quality={90}
        className="shrink-0"
        priority={priority}
      />
      {cosmetics && lockupInk ? (
        <Image
          src={`/images/brand/lockup-cosmetics-${lockupInk}.webp`}
          alt=""
          width={lockupW}
          height={lockupH}
          sizes={`${lockupW}px`}
          quality={90}
          className="shrink-0"
          priority={priority}
        />
      ) : (
        <Image
          src={`/images/brand/wordmark-${ink}.webp`}
          alt=""
          width={Math.round(wordmarkH * WORDMARK_RATIO)}
          height={wordmarkH}
          sizes={`${Math.round(wordmarkH * WORDMARK_RATIO)}px`}
          quality={90}
          className="shrink-0"
          priority={priority}
        />
      )}
    </div>
  )
}
