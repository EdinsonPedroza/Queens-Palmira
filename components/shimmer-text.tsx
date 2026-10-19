import { cn } from "@/lib/utils"

/*
 * Gold text with a band of light that sweeps across it, forever.
 *
 * It replaces a `background-clip: text` gradient whose `background-position` was animated. That
 * look is the same, but it repaints the whole title on every frame, and a single one kept about
 * a quarter of the main thread busy on a slowed-down CPU. This version is built from layers the
 * GPU moves on its own:
 *
 *   the text, in the page's deep accent colour (--face-deep)
 *   └─ a window, 240px wide, soft at both ends, that slides across it (translateX)
 *        └─ a copy of the text in the lighter accent (--face), slid back the other way so it
 *           stays exactly over the original: the window only decides how much of it shows
 *
 * The motion is in whole pixels (see `shimmer-window` in globals.css) so the copy never lands
 * between pixels and goes soft. Same pace and same band as before: 500px per second, one pass
 * every two seconds. The copy is hidden from assistive technology; the text is read once.
 * `children` has to be a plain string, because it is drawn twice.
 */
export function ShimmerText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("shimmer-text", className)}>
      {children}
      <span aria-hidden className="shimmer-text__band">
        <span className="shimmer-text__copy">{children}</span>
      </span>
    </span>
  )
}
