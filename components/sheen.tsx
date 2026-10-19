/*
 * A soft band of light that crosses a button again and again (the "Agregar al carrito" buttons and
 * the floating cart). The parent has to be `relative overflow-hidden`.
 *
 * It used to animate `background-position` on a 200%-wide gradient, which repaints the button on
 * every frame; with a dozen product cards on screen that kept the main thread busy for nothing.
 * Here the gradient sits still on a strip three tiles wide and the strip is slid with `transform`,
 * which the GPU does by itself. Checked pixel by pixel against the old version at a dozen points
 * of the sweep: the largest difference is 1 level out of 255.
 *
 * Why 3 tiles / ±33.3333%: the old gradient was 2 button-widths per tile and travelled two tiles
 * (-200% → 200%), so the strip is that many tiles wide and moves two tiles (a third of its width).
 */
export function Sheen({ alpha, seconds }: { alpha: number; seconds: number }) {
  return (
    <span
      aria-hidden
      className="sheen-slide pointer-events-none absolute inset-y-0 left-[-200%] w-[600%]"
      style={
        {
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,${alpha}) 50%, transparent 60%)`,
          backgroundSize: "33.3333% 100%",
          "--sheen-dur": `${seconds}s`,
        } as React.CSSProperties
      }
    />
  )
}
