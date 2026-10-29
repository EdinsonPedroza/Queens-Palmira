"use client"

import { createPortal } from "react-dom"
import { ShoppingBag, Check, ChevronDown, Plus, Star } from "lucide-react"
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { m, AnimatePresence, useReducedMotion } from "framer-motion"
import type { Product } from "@/lib/products"
import { Badge } from "./ui/badge"
import { useCart } from "@/context/cart-context"
import { cartOpener, flyToCart, markArrival } from "@/lib/cart-fx"
import { PRODUCT_TINTS } from "@/lib/product-tints"
import { cn, formatCOP } from "@/lib/utils"

/* ─── Estilos de tarjeta ───────────────────────────────────────
 * Las cinco comparten la misma lógica (useCardState). Lo que cambia es solo el
 * diseño. `CARD_GRID` es la rejilla que le sienta a cada una: el catálogo la usa.
 */
export type CardStyle = "editorial" | "suave" | "minimal" | "arco" | "lista"

export const CARD_STYLES: { id: CardStyle; label: string; note: string }[] = [
  { id: "editorial", label: "Editorial", note: "Plano y limpio, nombre en mayúsculas, botón de contorno." },
  { id: "suave",     label: "Suave",     note: "Tarjeta blanca con esquinas redondeadas, sombra suave y botón de color." },
  { id: "minimal",   label: "Minimal",   note: "Sin tarjeta: el producto flota y se agrega con un +." },
  { id: "arco",      label: "Arco",      note: "La foto en arco con filo fino, igual que el portal. Texto centrado." },
  { id: "lista",     label: "Lista",     note: "Horizontal: foto a la izquierda, datos a la derecha. La más compacta." },
]

export const CARD_GRID: Record<CardStyle, string> = {
  editorial: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:max-w-[1200px] xl:mx-auto gap-x-3 gap-y-8",
  suave:     "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4",
  minimal:   "grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:max-w-[1200px] xl:mx-auto gap-x-4 gap-y-10",
  arco:      "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:max-w-[1100px] xl:mx-auto gap-x-5 gap-y-12",
  lista:     "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
}

const BADGE_COPY: Record<NonNullable<Product["badge"]>, { text: string; variant: "new" | "bestseller" | "offer" }> = {
  nuevo:      { text: "Nuevo",       variant: "new" },
  bestseller: { text: "Bestseller",  variant: "bestseller" },
  oferta:     { text: "Oferta",      variant: "offer" },
}

const PHOTO_SIZES = "(max-width: 767px) 50vw, 260px"
const PANEL = "bg-[color-mix(in_oklab,var(--ink)_5%,var(--crema))]"
/** How long the button keeps saying "Agregado" before it goes back to what it was. */
const FLASH_MS = 1800

/* ─── Estado compartido ────────────────────────────────────── */
export function useCardState(product: Product) {
  const { addItem, items, openCart } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [lastTone, setLastTone]   = useState("")   // the tone that was just added (the button says it)
  const [open, setOpen]           = useState(false)
  const [selected, setSelected]   = useState<string>(product.variants?.length === 1 ? product.variants[0] : "")
  const triggerRef = useRef<HTMLButtonElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(flashTimer.current), [])

  const hasVariants = (product.variants?.length ?? 0) > 0
  const canAdd      = !hasVariants || selected !== ""
  const discount    = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0
  const badge = product.badge ? BADGE_COPY[product.badge] : null

  /* What of this product is already in the cart: units in all, and units per tone. */
  const inCart = useMemo(() => {
    const byTone: Record<string, number> = {}
    let total = 0
    for (const line of items) {
      if (line.product.id !== product.id) continue
      total += line.qty
      if (line.variant) byTone[line.variant] = (byTone[line.variant] ?? 0) + line.qty
    }
    return { total, byTone }
  }, [items, product.id])

  /* One unit to the cart, and every cue that says so: the cart opens at once, the photo flies into it and the button says "Agregado". */
  const add = useCallback((tone?: string) => {
    addItem(product.id, tone)
    cartOpener.el = triggerRef.current
    markArrival()
    openCart()
    flyToCart(triggerRef.current, { toDrawer: true, rowKey: tone ? `${product.id}--${tone}` : product.id })
    setLastTone(tone ?? "")
    setJustAdded(true)
    clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setJustAdded(false), FLASH_MS)
  }, [addItem, openCart, product.id])

  /* Sin tono elegido, el botón principal despliega las opciones; con tono, agrega. */
  const onAction = useCallback(() => {
    if (!canAdd) { setOpen((o) => !o); return }
    add(selected || undefined)
  }, [add, canAdd, selected])

  const close = useCallback(() => setOpen(false), [])
  /* Elegir un tono lo agrega al carrito de una vez, y la tarjeta vuelve a "Elige un tono" para poder escoger otro. */
  const pick  = useCallback((v: string) => {
    setOpen(false)
    if ((product.variants?.length ?? 0) > 1) setSelected("")
    // The option that had the focus is about to unmount: hand the focus back to the card's button first. The cart opens right
    // after and remembers it, so closing the cart returns the keyboard to this card.
    triggerRef.current?.focus({ preventScroll: true })
    add(v)
  }, [add, product.variants])

  return { justAdded, lastTone, inCart, open, setOpen, selected, triggerRef, hasVariants, canAdd, discount, badge, onAction, close, pick }
}
export type CardState = ReturnType<typeof useCardState>

/* Bolsita con la cantidad: en la foto de la tarjeta (tinta) y junto a cada tono del desplegable (acento). */
/** `still`: the number never animates in. The tone menu uses it: its badges appear every time the menu opens, and animating them in made
 *  those rows blink (the number only changes there by picking a tone, which closes the menu anyway). */
export function CartCount({ n, tone = "ink", className, still }: { n: number; tone?: "ink" | "face"; className?: string; still?: boolean }) {
  // Square and translucent, like the floating cart chip: ink over a blur (crema-on-lila for the "face" tone), the bag and the count in parentheses
  return (
    <span
      role="img"
      aria-label={`${n} en tu carrito`}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 px-2 py-1.5 leading-none backdrop-blur-md [font-variant-numeric:lining-nums]",
        tone === "ink" ? "bg-[color-mix(in_oklab,var(--ink)_72%,transparent)] text-[var(--crema)]" : "bg-[color-mix(in_oklab,var(--face)_80%,transparent)] text-[var(--ink)]",
        className,
      )}
    >
      <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
      <span key={n} className={cn("text-[12.5px] font-semibold", !still && "[--in-y:7px] motion-safe:animate-[enter-up_220ms_cubic-bezier(0.16,1,0.3,1)_backwards]")}>
        ({n})
      </span>
    </span>
  )
}

/* Lo que ya hay de este producto en el carrito, sobre la foto. Aparece con un resorte al agregar el primero y se queda. */
export function InCartChip({ count, className }: { count: number; className?: string }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <m.span
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.3, opacity: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 22 }}
          className={cn("pointer-events-none absolute right-2 top-2 z-10 shadow-[0_10px_20px_-8px_rgba(30,15,34,0.5)]", className)}
        >
          <CartCount n={count} />
        </m.span>
      )}
    </AnimatePresence>
  )
}

/* ─── Desplegable de tonos (portal) ────────────────────────── */
/* Panel "Vidrio" (translúcido, cuadrado, filas sin caja; elegido por el cliente entre seis diseños). Solo cambió el diseño y el
 * movimiento: elegir un tono lo agrega al carrito, Esc / clic fuera lo cierran, se abre hacia arriba si abajo no cabe y al deslizar la página SE QUEDA pegado a su botón: va en coordenadas del documento (absolute), así se mueve con el scroll nativo sin retraso.
 * El borde de las filas va como sombra en anillo (box-shadow), no como `border`: el color de borde de las utilidades no se aplica (ver CLAUDE.md).
 * Movimiento: nace en el borde del botón (origen arriba o abajo según hacia dónde abre), 180 ms al abrir y 120 ms al cerrar (ease-out fuerte),
 * las primeras ocho filas suben con 30 ms entre cada una; solo transform y opacity. Con "reducir movimiento" solo hay un fundido. */
const TONE_OUT = [0.23, 1, 0.32, 1] as const

export function ToneMenu({ variants, selected, counts, onSelect, open, onClose, triggerRef }: {
  variants: string[]
  selected: string
  /** Units of each tone already in the cart: those rows show a little bag with the number. */
  counts?: Record<string, number>
  onSelect: (v: string) => void
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const reduce = useReducedMotion()
  /* The panel is placed in DOCUMENT coordinates (absolute, not fixed): it scrolls with the page exactly like the button does, on the
   * browser's own scroll, with no listener and no lag: a fixed panel that follows the button from a scroll handler always trails it by a
   * frame and looks "loose". It opens downward, or upward when below the button there is not room, and keeps that side. */
  const [pos, setPos] = useState<{ top: number; left: number; width: number; up: boolean } | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const up = pos?.up ?? false

  const place = useCallback(() => {
    const t = triggerRef.current
    if (!t) return
    const r = t.getBoundingClientRect()
    const w = Math.max(r.width, 260)
    const left = Math.max(Math.min(r.left, window.innerWidth - w - 8), 8)
    const below = window.innerHeight - r.bottom
    const goesUp = below < 260 && r.top > below
    setPos({
      top: (goesUp ? r.top - 6 : r.bottom + 6) + window.scrollY,
      left: left + window.scrollX,
      width: w,
      up: goesUp,
    })
  }, [triggerRef])

  // Before paint: on a second opening `pos` still holds the previous one, and a plain effect would let that old spot show for a frame (the flicker).
  useLayoutEffect(() => {
    // Measuring the button is what this effect is for: the position can only be known after it is laid out.
    if (open) place()
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const outside = (e: MouseEvent) => {
      if (panelRef.current?.contains(e.target as Node) || triggerRef.current?.contains(e.target as Node)) return
      onClose()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      // The focus is inside the panel (keyboard use): hand it back to the button before the panel goes away, or it would be lost on <body>.
      if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus({ preventScroll: true })
      onClose()
    }
    // Only a change of layout (resizing the window) moves the button relative to the document.
    document.addEventListener("mousedown", outside)
    document.addEventListener("keydown", esc)
    window.addEventListener("resize", place)
    return () => {
      document.removeEventListener("mousedown", outside)
      document.removeEventListener("keydown", esc)
      window.removeEventListener("resize", place)
    }
  }, [open, onClose, triggerRef, place])

  // Keyboard: the panel lives in a portal at the end of <body>, so Tab from the button never reached it and a keyboard user could not pick a tone.
  // When it opens the focus goes in (the chosen tone, else the first one); the arrows, Home and End move between tones; Tab and Esc hand the focus back
  // to the button. For the mouse nothing changes: focus that follows a click is not "focus-visible", so no ring or underline shows.
  const focusedOnOpen = useRef(false)
  useEffect(() => {
    if (!open) { focusedOnOpen.current = false; return }
    if (focusedOnOpen.current || !pos) return
    const options = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    if (options.length === 0) return
    focusedOnOpen.current = true
    ;(options.find((o) => o.getAttribute("aria-selected") === "true") ?? options[0]).focus({ preventScroll: true })
  }, [open, pos])

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const options = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])
    if (options.length === 0) return
    const at = options.indexOf(document.activeElement as HTMLElement)
    const go = (i: number) => { e.preventDefault(); options[i].focus({ preventScroll: true }) }
    if (e.key === "ArrowDown") go((at + 1) % options.length)
    else if (e.key === "ArrowUp") go(at <= 0 ? options.length - 1 : at - 1)
    else if (e.key === "Home") go(0)
    else if (e.key === "End") go(options.length - 1)
    else if (e.key === "Tab") { triggerRef.current?.focus({ preventScroll: true }); onClose() }   // not prevented: the browser carries on from the button
  }

  // The exit stays in Framer Motion (AnimatePresence keeps the panel until it has faded out); the ENTRANCE is the CSS animation
  // `tone-in` / `tone-in-up` (globals.css), which has no hand-over frame and so no flicker.
  const exit = reduce
    ? { opacity: 0, transition: { duration: 0.1 } }
    : { opacity: 0, transform: `scale(0.97) translateY(${up ? 2 : -2}px)`, transition: { duration: 0.12, ease: TONE_OUT } }

  // `pos` only exists on the client (it is measured), so the portal never runs on the server.
  if (!pos) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div key="tone-anchor" style={{ position: "absolute", top: pos.top, left: pos.left, width: pos.width, zIndex: 39, transform: up ? "translateY(-100%)" : undefined }}>
        <m.div
          ref={panelRef}
          role="listbox"
          aria-label="Tonos disponibles"
          onKeyDown={onListKeyDown}
          initial={false}
          exit={exit}
          style={{ transformOrigin: up ? "50% 100%" : "50% 0%" }}
          className={cn(
            up ? "motion-safe:animate-[tone-in-up_180ms_cubic-bezier(0.23,1,0.32,1)]" : "motion-safe:animate-[tone-in_180ms_cubic-bezier(0.23,1,0.32,1)]",
            "motion-reduce:animate-[overlay-in_150ms_ease-out]",
            // "Vidrio" (the client's pick among six): translucent crema over a blur, square, no boxes around the rows
            "overflow-hidden bg-[color-mix(in_oklab,var(--crema)_62%,transparent)] backdrop-blur-xl",
            "shadow-[0_0_0_1px_color-mix(in_oklab,var(--crema)_85%,transparent),0_22px_44px_-18px_rgba(30,15,34,0.4)]",
          )}
        >
          <p className="px-4 pb-1.5 pt-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--ink)]/70">Elige tu tono</p>

          <div className="flex max-h-80 flex-col overflow-y-auto px-1.5 pb-2">
            {variants.map((v) => {
              const on = selected === v
              const n = counts?.[v] ?? 0
              return (
                <button
                  key={v}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => onSelect(v)}
                  className="group relative flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left text-[13.5px] leading-tight text-[var(--ink)] focus-visible:outline-none"
                >
                  <span className={cn("min-w-0 break-words", (on || n > 0) && "font-semibold")}>{v}</span>
                  {n > 0 ? (
                    <span role="img" aria-label={`${n} en tu carrito`} className="flex shrink-0 items-center gap-1 text-[12.5px] font-semibold tabular-nums text-[var(--face-deep)]">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      {n}
                    </span>
                  ) : on ? (
                    <Check aria-hidden className="h-3 w-3 shrink-0 text-[var(--face-deep)]" strokeWidth={3} />
                  ) : null}
                  {/* "Desde el centro" (the client's pick among six): the line opens from the middle to both sides, 180 ms, strong ease-out; on leaving it closes to the middle. Only transform. Hover only where there is a mouse; with reduced motion it just appears. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-3 bottom-1 h-px origin-center scale-x-0 bg-[var(--ink)] transition-transform duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                  />
                </button>
              )
            })}
          </div>
        </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ─── Botón principal: elegir tono / agregar ───────────────── */
// El color del borde va en línea: la regla `* { border-color }` de globals.css (sin capa) le gana a las utilidades (ver CLAUDE.md).
type ActionKind = "outline" | "small" | "pill"

/* "Borde" (the client's pick among five ideas): the outline button has almost no box until you touch it. A faint hairline rests around it and an ink line
 * "draws" itself around it on hover, side by side (40 ms apart), and stays complete while the tone menu is open. Transform only, 220 ms, strong ease-out;
 * no movement with reduced motion. Hover only exists where there is a mouse (Tailwind 4 gates it). */
function BorderLines({ on }: { on: boolean }) {
  // The hairline at rest and the ink outline are two BORDERS, not box-shadows or 1 px bars: a border is floored to whole device pixels, so on a 125/150/175 % display it stays one crisp pixel
  // on all four sides (the bars and the shadow came out 2-3 px blurry, and thicker on the top edge). The outline fades in (500 ms, strong ease-out) while the label's letters open up
  // (see ActionButton): "letras que respiran", the client's pick: immediate but soft. The colour is inline because of the unlayered `* { border-color }` rule (see CLAUDE.md).
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-0 border" style={{ borderColor: "color-mix(in oklab, var(--ink) 14%, transparent)" }} />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 border transition-opacity duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
          on ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
        style={{ borderColor: "var(--ink)" }}
      />
    </>
  )
}

export function ActionButton({ s, product, kind }: { s: CardState; product: Product; kind: ActionKind }) {
  const { canAdd, justAdded, lastTone, open, onAction, selected, triggerRef } = s
  const picking  = !canAdd
  /* "Agregado" for a moment; if the tone menu is open again the button is back to "Elige un tono". */
  const flashing = justAdded && !open
  const waiting  = picking && !flashing
  const style: React.CSSProperties = kind === "pill"
    ? {}
    : kind === "outline"
      ? { boxShadow: flashing ? "inset 0 0 0 1px var(--ink)" : undefined }
      : { borderColor: waiting ? "color-mix(in oklab, var(--ink) 35%, transparent)" : kind === "small" ? "var(--face-deep)" : "var(--ink)" }

  const base = {
    outline: cn(
      "group relative w-full px-3 py-2.5 text-[11.5px] uppercase tracking-[0.12em] font-medium [transition:transform_150ms,background-color_150ms,color_150ms,letter-spacing_500ms_cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:transition-none",
      // The letters "breathe": their spacing opens on hover and stays open while the tone menu is open (the outline stays drawn too).
      !flashing && (waiting && open ? "tracking-[0.17em]" : "hover:tracking-[0.17em]"),
    ),
    small:   "w-full border rounded-full px-3 py-2 text-[10.5px] uppercase tracking-[0.14em] font-medium",
    pill:    "w-full rounded-full px-3 py-2.5 text-xs font-bold tracking-wide",
  }[kind]

  const tone = {
    outline: flashing ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)]",
    small:   flashing ? "bg-[var(--face-deep)] text-[var(--crema)]" : "text-[var(--face-deep)] hover:bg-[var(--face-deep)] hover:text-[var(--crema)]",
    pill:    flashing ? "bg-[var(--ink)] text-[var(--crema)]" : "bg-queens-gradient-intense text-[var(--ink)] hover:brightness-95",
  }[kind]

  const added = `${product.name}${lastTone ? ` — ${lastTone}` : ""}`

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={onAction}
        aria-haspopup={waiting ? "listbox" : undefined}
        aria-expanded={waiting ? open : undefined}
        aria-label={flashing
          ? `Agregado${lastTone ? ` · ${lastTone}` : ""}: ${product.name}`
          : picking
            ? `Elige un tono: ${product.name}`
            : `Agregar al carrito: ${product.name}${selected ? ` — ${selected}` : ""}`}
        data-testid={`add-${product.name}`}
        style={style}
        className={cn(
          "flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--face)]",
          base,
          waiting
            ? kind === "pill"
              ? "bg-[color-mix(in_oklab,var(--face)_35%,var(--crema))] text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--face)_50%,var(--crema))]"
              : kind === "outline"
                ? "bg-transparent text-[var(--ink)]"
                : "bg-transparent text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_6%,transparent)]"
            : tone,
        )}
      >
        {/* Each state is its own element, so the label rises into place when it changes. */}
        <span
          key={flashing ? "added" : picking ? "pick" : "add"}
          className="flex min-w-0 items-center justify-center gap-2 [--in-y:6px] motion-safe:animate-[enter-up_200ms_cubic-bezier(0.16,1,0.3,1)_backwards]"
        >
          {flashing ? (
            <>
              <m.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 600, damping: 16, delay: 0.05 }}
                className="grid shrink-0 place-items-center"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.75} />
              </m.span>
              {/* The tone only where it fits: on a phone the card is too narrow and the name would be cut in half */}
              <span className="truncate">Agregado{lastTone && <span className="hidden min-[480px]:inline"> · {lastTone}</span>}</span>
            </>
          ) : picking ? (
            <>Elige un tono<ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", open && "rotate-180")} /></>
          ) : (
            <><ShoppingBag className="h-3.5 w-3.5 shrink-0" />Agregar al carrito</>
          )}
        </span>
        {kind === "outline" && !flashing && <BorderLines on={waiting && open} />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">{flashing ? `${added}, agregado al carrito` : ""}</span>
    </>
  )
}

/* Círculo "+" del estilo Minimal: mismo comportamiento que el botón principal. */
function QuickAdd({ s, product }: { s: CardState; product: Product }) {
  const { canAdd, justAdded, lastTone, open, onAction, selected, triggerRef } = s
  const flashing = justAdded && !open
  const added = `${product.name}${lastTone ? ` — ${lastTone}` : ""}`
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={onAction}
        aria-haspopup={!canAdd && !flashing ? "listbox" : undefined}
        aria-expanded={!canAdd && !flashing ? open : undefined}
        aria-label={flashing ? `Agregado al carrito: ${added}` : !canAdd ? `Elegir tono de ${product.name}` : `Agregar ${product.name}${selected ? ` — ${selected}` : ""} al carrito`}
        data-testid={`add-${product.name}`}
        className={cn(
          "absolute bottom-1 right-1 z-10 grid h-9 w-9 place-items-center rounded-full cursor-pointer shadow-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--face)]",
          flashing ? "bg-[var(--face-deep)] text-[var(--crema)]" : "bg-[var(--crema)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--crema)]",
        )}
      >
        <m.span
          key={flashing ? "ok" : "plus"}
          initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 520, damping: 20 }}
          className="grid place-items-center"
        >
          {flashing ? <Check className="h-4 w-4" strokeWidth={2.75} /> : <Plus className={cn("h-4 w-4 transition-transform", open && "rotate-45")} strokeWidth={2} />}
        </m.span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">{flashing ? `${added}, agregado al carrito` : ""}</span>
    </>
  )
}

/* ─── Piezas comunes ───────────────────────────────────────── */
/* `seated`: el producto se apoya abajo de su caja, sobre el suelo del fondo de estudio. */
export function Photo({ product, pad, seated }: { product: Product; pad: string; seated?: boolean }) {
  return (
    <>
    {seated && (
      /* Reflejo tenue sobre el suelo: la misma foto volteada sobre la línea donde se apoya (87 % del alto), que se desvanece hacia arriba. */
      <Image
        src={product.image}
        alt=""
        aria-hidden
        fill
        sizes={PHOTO_SIZES}
        className={cn("pointer-events-none object-contain object-bottom opacity-60 blur-[0.6px] transition-transform duration-700 ease-out origin-[50%_87%] scale-y-[-1] group-hover:scale-x-[1.05] group-hover:scale-y-[-1.05]", pad)}
        style={{ ...product.imageStyle, maskImage: "linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.34) 86.5%, transparent 87%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.34) 86.5%, transparent 87%)" }}
      />
    )}
    <Image
      src={product.image}
      alt={product.name}
      fill
      sizes={PHOTO_SIZES}
      className={cn(
        "object-contain transition-transform duration-700 ease-out group-hover:scale-[1.05]",
        // Only ONE drop-shadow applies: two `drop-shadow-[…]` utilities set the same CSS variable and the one generated later wins (this one). A first
        // `drop-shadow-[0_1px_1px_rgba(95,45,55,0.35)]` used to sit here and never showed; it was removed, so the look the client approved is unchanged.
        // To get a real second (contact) layer, write ONE arbitrary filter: `[filter:drop-shadow(a)_drop-shadow(b)]`.
        seated && "object-bottom origin-bottom drop-shadow-[0_7px_9px_rgba(95,45,60,0.22)]",
        pad,
      )}
      style={product.imageStyle}
    />
    </>
  )
}

/* Fondo de estudio (seda rosa) de las fichas editoriales. El suelo arranca en ~78 % del alto;
 * el producto se apoya sobre él (ver STAGE_PAD) con una sombra de contacto. Encima de la tela va
 * una luz suave detrás del producto (lo "enciende") y una viñeta ciruela en los bordes (contraste). */
export const STAGE_PAD = "px-[12%] pt-[7%] pb-[13%]"

/* El tono del fondo sigue al producto: de su foto sale un matiz y qué tan coloreado es (lib/product-tints.ts, generado por
 * scripts/product-tints.mjs). Los productos negros, blancos o grises (fuerza 0) se quedan con el rosa de siempre. El tinte es
 * pastel y parcial: el fondo solo se inclina hacia el color del producto, no se vuelve de ese color. */
export function stageTint(product: Product): { col: string; s: number; lift?: boolean } | null {
  const t = PRODUCT_TINTS[product.image]
  if (!t || t[1] < 0.05) return null
  const [hue, strength] = t
  // The silk is pink, so a hue far from pink (yellow, green, blue) is held back more than one close to it; and the whole effect is
  // a nudge, never a repaint (the client found the first version too loud on yellows and purples).
  const away = Math.abs(((hue - 350 + 540) % 360) - 180) / 180   // 0 = pink … 1 = the opposite hue
  const s = strength * (1 - 0.5 * away) * 0.8
  // A product in the silk's own family (pink, coral, red, mauve: hue 310°–70°) must not pull the silk to ITS colour: the client saw a pink gloss on a
  // dusty-pink silk as "practically the same colour", dark and dull. But the client LIKES the pink silk, so it stays pink: only the hue turns a little
  // away from the product (15°: cooler rose for warm products, warmer coral for cool ones; each product keeps ITS OWN matiz, the client insisted) and the silk is lifted a bit so it is not dull.
  const sameFamily = hue >= 310 || hue <= 70
  if (sameFamily) return { col: `oklch(0.88 ${(0.06 + 0.06 * s).toFixed(3)} ${hue >= 310 ? (hue + 15) % 360 : (hue + 345) % 360})`, s, lift: true }
  return { col: `oklch(0.82 ${(0.05 * s).toFixed(3)} ${hue})`, s }
}

/* Dos fondos de estudio: la seda rosa de siempre y la seda oro rosa (ACTUALIZACION/fondos/2.png). Cada producto tiene el suyo, fijo (sale de su id,
 * no al azar: no cambia al recargar ni al cambiar de categoría); más o menos uno de cada tres usa el oro rosa. */
export function stageBackdrop(product: Product): "seda" | "seda-oro" {
  let h = 0
  for (const c of product.id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 3 === 0 ? "seda-oro" : "seda"
}

export function Stage({ tint, backdrop = "seda" }: { tint?: { col: string; s: number; lift?: boolean } | null; backdrop?: "seda" | "seda-oro" }) {
  const beige = (hex: string) => (tint ? `color-mix(in oklab, ${hex}, ${tint.col} ${Math.round(14 * tint.s)}%)` : hex)
  return (
    <>
      <Image src={`/images/backgrounds/${backdrop}.webp`} alt="" aria-hidden fill sizes={PHOTO_SIZES} quality={85} className="object-cover" />
      {/* Matiz del producto sobre la seda: "color" conserva las luces y sombras de la tela y solo le cambia el color. */}
      {tint && <span aria-hidden className="stage-tint absolute inset-0 mix-blend-color opacity-50" style={{ background: tint.col }} />}
      {tint?.lift && <span aria-hidden className="stage-tint absolute inset-0 mix-blend-screen opacity-15" style={{ background: "#ffe9ea" }} />}
      {/* Con el cursor sobre la ficha la seda rosa se funde en un fondo de estudio beige cálido (va debajo de la luz y la viñeta
          y aparece con un fundido). Se queda mientras el desplegable de tonos de esa ficha está abierto (`data-active`:
          el panel vive fuera de la ficha y el cursor "sale" de ella) y con el foco de teclado dentro. No usa `focus-within`:
          un clic con el mouse dejaría la ficha pegada en lavanda. El nodo padre `.group` es la ficha. */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-has-focus-visible:opacity-100 group-data-active:opacity-100 motion-reduce:transition-none"
        style={{
          // A studio, not a flat colour: a pool of soft light behind the product, a warm blush wall and a slightly deeper floor that begins where the product stands (~78 %).
          background: `radial-gradient(ellipse 62% 52% at 54% 44%, ${beige("#fff6ee")}, transparent 72%), linear-gradient(to bottom, ${beige("#f7e7dc")} 0%, ${beige("#f0dacb")} 68%, ${beige("#e6c8b6")} 80%, ${beige("#dcb7a4")} 100%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-25 group-has-focus-visible:opacity-25 group-data-active:opacity-25 motion-reduce:transition-none"
        style={{
          background:
            "radial-gradient(ellipse 52% 46% at 50% 50%, rgba(255,248,250,0.4), rgba(255,248,250,0) 100%), radial-gradient(ellipse 85% 80% at 50% 48%, rgba(0,0,0,0) 55%, rgba(60,30,66,0.34) 100%)",
        }}
      />
      {/* Sombra de contacto en dos capas, multiplicada sobre la tela para que tome su color: un núcleo corto y oscuro
          justo bajo la base (donde el producto toca el suelo) y una penumbra ancha y suave. */}
      <span
        aria-hidden
        className="absolute bottom-[10.6%] left-1/2 h-[7%] w-[64%] -translate-x-1/2 mix-blend-multiply blur-[7px]"
        style={{ background: "radial-gradient(closest-side, rgba(110,50,70,0.36), rgba(110,50,70,0))" }}
      />
      <span
        aria-hidden
        className="absolute bottom-[11.6%] left-1/2 h-[2.4%] w-[38%] -translate-x-1/2 mix-blend-multiply blur-[2px]"
        style={{ background: "radial-gradient(closest-side, rgba(70,25,45,0.62), rgba(70,25,45,0))" }}
      />
    </>
  )
}

/* Va ENCIMA de la foto del producto: la base del producto recibe el rosa de la tela (luz rebotada) y todo el conjunto
 * comparte un ligero degradado de luz, para que no se vea como un recorte pegado. "multiply" solo oscurece o tiñe:
 * no cambia los blancos de la tela a un tono nuevo. */
export function StageFx({ tint }: { tint?: { col: string; s: number } | null }) {
  // La luz rebotada de la base toma un poco del color del producto, igual que la tela.
  const bounce = (hex: string) => (tint ? `color-mix(in oklab, ${hex}, ${tint.col} ${Math.round(18 * tint.s)}%)` : hex)
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-multiply"
      style={{
        background:
          `linear-gradient(to top, ${bounce("#f6d5dd")} 0%, ${bounce("#fbe9ed")} 12%, rgba(255,255,255,0) 30%)`,
      }}
    />
  )
}

/* Tono elegido, sobre la foto. */
export function ToneOnPhoto({ selected, round }: { selected: string; round?: boolean }) {
  return (
    <AnimatePresence>
      {selected && (
        <m.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="absolute bottom-2 left-2 right-2 z-10"
        >
          <div className={cn("flex items-center justify-center bg-white/90 px-2.5 py-1.5", round && "rounded-full")}>
            <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-[var(--ink)]">{selected}</span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

export function PriceLine({ product, discount, className }: { product: Product; discount: number; className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      {discount > 0 && (
        <span className="text-[12px] text-[var(--ink)] line-through">{formatCOP(product.originalPrice!)}</span>
      )}
      <span className={cn("text-[14px] font-semibold", discount > 0 ? "text-[var(--face-deep)]" : "text-[var(--ink)]")}>
        {formatCOP(product.price)}
      </span>
    </div>
  )
}

export function RatingRow({ rating, reviews }: { rating: number; reviews?: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-1" aria-label={`Calificación ${rating} de 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3" strokeWidth={0} fill={i < rounded ? "var(--face)" : "var(--face-light)"} />
        ))}
      </div>
      <span className="text-[10px] font-bold text-[var(--face-deep)] leading-none tabular-nums">{rating.toFixed(1)}</span>
      {reviews != null && <span className="text-[10px] text-[var(--muted-foreground)]/70 leading-none">({reviews})</span>}
    </div>
  )
}

function PriceRating({ product, discount }: { product: Product; discount: number }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
      <PriceLine product={product} discount={discount} />
      {product.rating != null && <RatingRow rating={product.rating} reviews={product.reviews} />}
    </div>
  )
}

/* ─── 1 · Editorial ────────────────────────────────────────── */
function EditorialCard({ product, s }: { product: Product; s: CardState }) {
  const tint = stageTint(product)
  return (
    <article className="group relative flex h-full flex-col" data-testid={`product-${product.id}`} data-active={s.open ? "" : undefined}>
      {/* La foto hace lo mismo que el botón de abajo (que sigue siendo el camino con teclado). */}
      <div className="relative aspect-square cursor-pointer overflow-hidden" onClick={s.onAction}>
        <Stage tint={tint} backdrop={stageBackdrop(product)} />
        <Photo product={product} pad={STAGE_PAD} seated />
        <StageFx tint={tint} />
        <ToneOnPhoto selected={s.selected} />
        <InCartChip count={s.inCart.total} />
      </div>
      {(s.badge || s.discount > 0) && (
        <div className="bg-[color-mix(in_oklab,var(--face-light)_55%,var(--crema))] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--face-deep)]">
          {s.discount > 0 ? `Ahorra ${s.discount}%` : s.badge?.text}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <div>
          <h3 className="line-clamp-2 text-[12.5px] font-bold uppercase leading-snug tracking-[0.03em] text-[var(--ink)]">{product.name}</h3>
          <p className="mt-1 line-clamp-1 text-[12px] leading-snug text-[var(--ink)]/80">{product.description}</p>
        </div>
        <PriceRating product={product} discount={s.discount} />
        <div className="mt-auto"><ActionButton s={s} product={product} kind="outline" /></div>
      </div>
    </article>
  )
}

/* ─── 2 · Suave ────────────────────────────────────────────── */
function SuaveCard({ product, s }: { product: Product; s: CardState }) {
  return (
    <m.article
      className="group relative flex h-full flex-col rounded-2xl bg-white"
      style={{ boxShadow: "0 6px 20px -8px rgba(70,38,73,0.16), 0 0 0 1px color-mix(in oklab, var(--face) 35%, transparent)" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      data-testid={`product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-b from-[var(--crema)] to-[color-mix(in_oklab,var(--face-light)_30%,var(--crema))]">
        <Photo product={product} pad="p-4" />
        {s.badge && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <Badge variant={s.badge.variant}>{s.badge.text}</Badge>
          </div>
        )}
        <ToneOnPhoto selected={s.selected} round />
        <InCartChip count={s.inCart.total} className="right-2.5 top-2.5" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-2.5">
        <div>
          <h3 className="line-clamp-2 font-display text-[13px] font-semibold leading-snug text-[var(--ink)]">{product.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--muted-foreground)]">{product.description}</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
          <div className="flex items-baseline gap-1.5">
            {s.discount > 0 && <span className="text-[11px] text-[var(--muted-foreground)] line-through">{formatCOP(product.originalPrice!)}</span>}
            <span className="font-display text-lg font-bold leading-none text-[var(--face-deep)]">{formatCOP(product.price)}</span>
          </div>
          {product.rating != null && <RatingRow rating={product.rating} reviews={product.reviews} />}
        </div>
        <div className="mt-auto pt-1"><ActionButton s={s} product={product} kind="pill" /></div>
      </div>
    </m.article>
  )
}

/* ─── 3 · Minimal ──────────────────────────────────────────── */
function MinimalCard({ product, s }: { product: Product; s: CardState }) {
  return (
    <article className="group relative flex h-full flex-col" data-testid={`product-${product.id}`}>
      <div className="relative aspect-square transition-colors duration-300 group-hover:bg-[color-mix(in_oklab,var(--ink)_4%,transparent)]">
        <Photo product={product} pad="p-3" />
        <InCartChip count={s.inCart.total} className="right-1 top-1" />
        <QuickAdd s={s} product={product} />
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-2.5">
        {(s.badge || s.discount > 0) && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--face-deep)]">
            {s.discount > 0 ? `-${s.discount}%` : s.badge?.text}
          </span>
        )}
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-[var(--ink)]">{product.name}</h3>
        <PriceLine product={product} discount={s.discount} />
      </div>
    </article>
  )
}

/* ─── 4 · Arco ─────────────────────────────────────────────── */
function ArcoCard({ product, s }: { product: Product; s: CardState }) {
  return (
    <article className="group relative flex h-full flex-col items-center text-center" data-testid={`product-${product.id}`}>
      <div className="relative aspect-[4/5] w-full">
        <div className="absolute inset-0 rounded-t-full border" style={{ borderColor: "var(--face)" }} aria-hidden />
        <div className={cn("absolute inset-[6px] overflow-hidden rounded-t-full", PANEL)}>
          <Photo product={product} pad="px-5 pb-6 pt-8" />
        </div>
        <ToneOnPhoto selected={s.selected} round />
        {/* Down from the corner of the box: the arch leaves that corner empty */}
        <InCartChip count={s.inCart.total} className="right-[7%] top-[26%]" />
      </div>
      <div className="flex w-full flex-1 flex-col items-center gap-1.5 pt-3">
        {(s.badge || s.discount > 0) && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--face-deep)]">
            {s.discount > 0 ? `Ahorra ${s.discount}%` : s.badge?.text}
          </span>
        )}
        <h3 className="line-clamp-2 font-display text-[14px] font-semibold leading-snug text-[var(--ink)]">{product.name}</h3>
        <PriceLine product={product} discount={s.discount} className="justify-center" />
        <div className="mt-auto w-full pt-2"><ActionButton s={s} product={product} kind="small" /></div>
      </div>
    </article>
  )
}

/* ─── 5 · Lista ────────────────────────────────────────────── */
function ListaCard({ product, s }: { product: Product; s: CardState }) {
  return (
    <article
      className="group relative flex h-full gap-3 border bg-white/60 p-2.5"
      style={{ borderColor: "color-mix(in oklab, var(--ink) 14%, transparent)" }}
      data-testid={`product-${product.id}`}
    >
      <div className={cn("relative h-[7.5rem] w-[7.5rem] shrink-0 overflow-hidden", PANEL)}>
        <Photo product={product} pad="p-2" />
        <InCartChip count={s.inCart.total} className="right-1.5 top-1.5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {(s.badge || s.discount > 0) && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--face-deep)]">
            {s.discount > 0 ? `Ahorra ${s.discount}%` : s.badge?.text}
          </span>
        )}
        <h3 className="line-clamp-2 text-[12.5px] font-bold uppercase leading-snug tracking-[0.03em] text-[var(--ink)]">{product.name}</h3>
        <PriceLine product={product} discount={s.discount} />
        <div className="mt-auto pt-1"><ActionButton s={s} product={product} kind="outline" /></div>
      </div>
    </article>
  )
}

const CARDS: Record<CardStyle, (p: { product: Product; s: CardState }) => React.ReactElement> = {
  editorial: EditorialCard,
  suave: SuaveCard,
  minimal: MinimalCard,
  arco: ArcoCard,
  lista: ListaCard,
}

/* ─── Tarjeta ──────────────────────────────────────────────── */
export function ProductCard({ product, cardStyle = "editorial" }: { product: Product; cardStyle?: CardStyle }) {
  const s = useCardState(product)
  const Card = CARDS[cardStyle]
  return (
    <>
      <Card product={product} s={s} />
      {s.hasVariants && (product.variants?.length ?? 0) > 1 && (
        <ToneMenu
          variants={product.variants!}
          selected={s.selected}
          counts={s.inCart.byTone}
          onSelect={s.pick}
          open={s.open}
          onClose={s.close}
          triggerRef={s.triggerRef}
        />
      )}
    </>
  )
}
