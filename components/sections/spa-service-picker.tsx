"use client"

import { useId, useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import type { SpaGroup, SpaService } from "@/lib/spa-services"
import { cn, formatCOP } from "@/lib/utils"
import { spaBookingLink } from "@/lib/whatsapp"

/*
 * The window a menu card with SEVERAL services opens (the client: "cuando se seleccione se abra como una ventana donde se pueda seleccionar el servicio, pero que se vea todo
 * bonito"; then "que no se vea tan grande"; then, from five ideas, "el compacto pero más pequeño"). Phones (under 640 px) get a sheet that rises from the bottom (a photo strip on
 * top, the options, and the booking button pinned under them); from 640 px up, iPads included, it is a small card in the middle: the card's photo on the left, the choice on the
 * right (the client wants the iPad to look like the computer, not like the phone). Native radios, so the arrow keys and the labels work for free. No service is chosen at first
 * (the cheapest would be booked by accident) and the button says so until one is: then it carries the service's price and opens WhatsApp, on the SPA's number, with that service
 * in the message. It is mounted only while open, so every opening starts with nothing chosen. Entrances are CSS (`.picker` in globals.css). Keep it small.
 *
 * `variant` is HOW THE OPTIONS (and in two cases the frame or the footer) ARE DRAWN. "actual" is the one the client picked; the other five (PICKER_VARIANTS) are refinements of it
 * to compare on the temporary page /spa/ventana-ideas. When the client picks one: make it the default here, delete the others and delete that page and spa-picker-preview.tsx.
 */

export type PickerVariant = "actual" | "tienda" | "ios" | "pastilla" | "vidrio" | "barra"

export const PICKER_VARIANTS: { id: PickerVariant; name: string; note: string }[] = [
  { id: "actual", name: "Actual", note: "La que ya tienes, para comparar." },
  { id: "tienda", name: "Tienda", note: "Fichas como el configurador de la tienda de Apple: la elegida se enmarca en dorado y suma una palomita que salta." },
  { id: "ios", name: "Lista iOS", note: "Una sola lista agrupada con líneas finas y la palomita a la derecha, como los Ajustes del iPhone." },
  { id: "pastilla", name: "Pastilla", note: "Una pastilla clara se desliza hasta la opción que tocas, como un control segmentado." },
  { id: "vidrio", name: "Vidrio", note: "La foto ocupa toda la ventana y las opciones van sobre un panel de vidrio esmerilado." },
  { id: "barra", name: "Barra", note: "Abajo, una barra con la selección y el precio a la izquierda y el botón a la derecha, como Apple Pay." },
]

const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
const IDLE =
  "bg-[color-mix(in_oklab,var(--face)_8%,var(--crema))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_28%,transparent)] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_60%,transparent)]"
const SELECTED = "bg-[var(--face-soft)] shadow-[inset_0_0_0_1.5px_var(--face-deep)]"
const FOCUS = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ink)]"
const FOCUS_IN = "peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-[var(--ink)]"
const TRANSITION = "transition-[background-color,box-shadow,transform] duration-200 motion-reduce:transition-none"
const NUMS = "[font-variant-numeric:lining-nums]"
const SPRING = "ease-[cubic-bezier(0.34,1.56,0.64,1)]"

interface OptionsProps {
  items: SpaService[]
  picked: string | null
  onPick: (name: string) => void
}

/** The ways of drawing the options. Exported so the preview page can show them side by side. */
export function PickerOptions({ variant, items, picked, onPick, legend }: OptionsProps & { variant: PickerVariant; legend: string }) {
  const name = useId()
  const label = (s: SpaService) => s.label ?? s.name
  const radio = (s: SpaService) => (
    <input type="radio" name={name} value={s.name} checked={s.name === picked} onChange={() => onPick(s.name)} data-testid="spa-picker-option" className="peer sr-only" />
  )

  /* Apple Store's configurator: tiles; the chosen one is framed in gold with a soft glow and a check that springs in on its corner. They give a little under the finger. */
  if (variant === "tienda") {
    return (
      <fieldset className="mt-3.5 space-y-2.5">
        <legend className="sr-only">{legend}</legend>
        {items.map((s) => {
          const on = s.name === picked
          return (
            <label key={s.name} className="block cursor-pointer transition-transform duration-150 motion-reduce:transition-none active:scale-[0.985]">
              {radio(s)}
              <span
                className={cn(
                  "relative flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5",
                  TRANSITION,
                  FOCUS,
                  on
                    ? "bg-[var(--crema)] shadow-[0_0_0_2px_var(--face-deep),0_12px_24px_-16px_color-mix(in_oklab,var(--face-deep)_85%,transparent)]"
                    : "bg-white shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_14%,transparent)] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_32%,transparent)]",
                )}
              >
                <span className="font-display text-[1.05rem] leading-tight">{label(s)}</span>
                <span className={cn("text-[0.95rem] font-semibold", NUMS)}>{formatCOP(s.price)}</span>
                <span
                  aria-hidden
                  className={cn("absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-[var(--face)] text-[var(--ink)] shadow-sm transition-transform duration-300 motion-reduce:transition-none", SPRING, on ? "scale-100" : "scale-0")}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              </span>
            </label>
          )
        })}
      </fieldset>
    )
  }

  /* iOS Settings: one grouped list, hairlines between the rows, a check on the right for the chosen one, a tint under the finger. */
  if (variant === "ios") {
    return (
      <fieldset className="mt-3.5 overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_12%,transparent)]">
        <legend className="sr-only">{legend}</legend>
        {items.map((s, i) => {
          const on = s.name === picked
          return (
            <label key={s.name} className="block cursor-pointer">
              {radio(s)}
              <span
                className={cn(
                  "flex items-center gap-3 px-4 py-3 active:bg-[color-mix(in_oklab,var(--ink)_6%,transparent)]",
                  TRANSITION,
                  FOCUS_IN,
                  i < items.length - 1 && "shadow-[inset_0_-1px_0_color-mix(in_oklab,var(--ink)_10%,transparent)]",
                  on && "bg-[var(--face-soft)]",
                )}
              >
                <span className={cn("min-w-0 flex-1 font-display text-[1.05rem] leading-tight", on && "font-semibold")}>{label(s)}</span>
                <span className={cn("shrink-0 text-[0.92rem] text-ink/65", NUMS)}>{formatCOP(s.price)}</span>
                <Check aria-hidden className={cn("h-4 w-4 shrink-0 text-[var(--face-deep)] transition-opacity duration-150 motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")} strokeWidth={2.75} />
              </span>
            </label>
          )
        })}
      </fieldset>
    )
  }

  /* A segmented control, vertical: one light pill sits behind the rows and SLIDES to the one you touch (the rows are all 3 rem tall, so its place is just its index). */
  if (variant === "pastilla") {
    const idx = items.findIndex((s) => s.name === picked)
    return (
      <fieldset className="mt-3.5 rounded-2xl bg-[color-mix(in_oklab,var(--face)_14%,var(--crema))] p-1">
        <legend className="sr-only">{legend}</legend>
        <div className="relative">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-12 rounded-xl bg-white shadow-[0_1px_2px_rgba(60,40,20,0.1),0_8px_18px_-10px_color-mix(in_oklab,var(--face-deep)_60%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_35%,transparent)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
            style={{ transform: `translateY(calc(${Math.max(idx, 0)} * 3rem))`, opacity: idx < 0 ? 0 : 1 }}
          />
          {items.map((s) => {
            const on = s.name === picked
            return (
              <label key={s.name} className="block cursor-pointer">
                {radio(s)}
                <span className={cn("relative flex h-12 items-center justify-between gap-3 rounded-xl px-4", FOCUS_IN, !on && "hover:bg-[color-mix(in_oklab,var(--face)_14%,transparent)]")}>
                  <span className={cn("font-display text-[1.05rem] leading-tight", on && "font-semibold")}>{label(s)}</span>
                  <span className={cn("text-[0.92rem] font-semibold", on ? "text-ink" : "text-ink/70", NUMS)}>{formatCOP(s.price)}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  /* Frosted glass: pills that let the photo behind show through a little. */
  if (variant === "vidrio") {
    return (
      <fieldset className="mt-3.5 space-y-2">
        <legend className="sr-only">{legend}</legend>
        {items.map((s) => {
          const on = s.name === picked
          return (
            <label key={s.name} className="block cursor-pointer transition-transform duration-150 motion-reduce:transition-none active:scale-[0.985]">
              {radio(s)}
              <span
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md",
                  TRANSITION,
                  FOCUS,
                  on ? "bg-white/90 shadow-[inset_0_0_0_2px_var(--face-deep)]" : "bg-white/55 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)] hover:bg-white/75",
                )}
              >
                <span aria-hidden className={cn("grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none", on ? "bg-[var(--face)] text-[var(--ink)]" : "shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--ink)_35%,transparent)]")}>
                  <Check className={cn("h-2.5 w-2.5 transition-opacity duration-150 motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")} strokeWidth={3} />
                </span>
                <span className="min-w-0 flex-1 font-display text-[1rem] leading-tight">{label(s)}</span>
                <span className={cn("shrink-0 text-[0.92rem] font-semibold", NUMS)}>{formatCOP(s.price)}</span>
              </span>
            </label>
          )
        })}
      </fieldset>
    )
  }

  // "actual" and "barra": the boxed rows the client picked, small
  return (
    <fieldset className="mt-3 space-y-1.5">
      <legend className="sr-only">{legend}</legend>
      {items.map((s) => {
        const on = s.name === picked
        return (
          <label key={s.name} className="block cursor-pointer">
            {radio(s)}
            <span className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2", TRANSITION, FOCUS, on ? SELECTED : IDLE)}>
              <span
                aria-hidden
                className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none", on ? "bg-[var(--face)] text-[var(--ink)]" : "shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--ink)_35%,transparent)]")}
              >
                <Check className={cn("h-2.5 w-2.5 transition-opacity duration-150 motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")} strokeWidth={3} />
              </span>
              <span className="min-w-0 flex-1 font-display text-[0.92rem] leading-tight">{label(s)}</span>
              <span className={cn("shrink-0 text-[0.85rem] font-semibold", NUMS)}>{formatCOP(s.price)}</span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}

export function ServicePickerContent({ group, items, onDone, variant = "actual" }: { group: SpaGroup; items: SpaService[]; onDone: () => void; variant?: PickerVariant }) {
  const [picked, setPicked] = useState<string | null>(null)
  const current = items.find((s) => s.name === picked)
  const glass = variant === "vidrio"
  const bar = variant === "barra"

  const book = current ? (
    <a
      href={spaBookingLink(current.name)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onDone}
      data-testid="spa-picker-book"
      className={cn(
        "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--face)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow-[0_8px_16px_-12px_color-mix(in_oklab,var(--face-deep)_90%,transparent)] transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_oklab,var(--face)_82%,var(--ink))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] active:scale-[0.99]",
        bar ? "shrink-0 px-5" : "w-full",
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {bar ? "Reservar" : "Reservar por WhatsApp"}
    </a>
  ) : (
    <button
      type="button"
      disabled
      data-testid="spa-picker-book"
      className={cn(
        "flex h-10 cursor-not-allowed items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--face)_16%,var(--crema))] text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60",
        bar ? "shrink-0 px-5" : "w-full",
      )}
    >
      {bar ? "Reservar" : "Elige un servicio"}
    </button>
  )

  return (
    <DialogContent
      data-testid="spa-picker"
      className={cn(
        // Phones (under 640 px): a sheet glued to the bottom. From 640 px up (iPads too): a card centred on the screen. (The base classes are the cart dialog's centred card: these override them.)
        "picker left-0 top-auto bottom-0 grid max-h-[92svh] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-t-[1.25rem] rounded-b-none p-0 text-ink",
        "sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[88svh] sm:w-[min(660px,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:grid-cols-[0.62fr_1.38fr] sm:grid-rows-1 sm:rounded-[1.25rem]",
      )}
      closeClassName="right-2.5 top-2.5 grid h-9 w-9 place-items-center bg-[color-mix(in_oklab,var(--crema)_90%,transparent)] p-0 backdrop-blur-sm sm:right-3 sm:top-3 sm:bg-transparent sm:backdrop-blur-none [&_svg]:h-4 [&_svg]:w-4"
    >
      {/* ── The photo of the card, with its name over it (glass: from 640 px up it fills the whole window and the panel floats over it) ── */}
      <div className={cn("relative h-24 shrink-0 sm:h-full sm:min-h-[340px]", glass && "sm:absolute sm:inset-0")}>
        <Image src={group.photo} alt="" fill sizes="(min-width: 640px) 660px, 100vw" draggable={false} className="object-cover" style={{ objectPosition: group.focus }} />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--dorado-noche)_88%,transparent)_0%,color-mix(in_oklab,var(--dorado-noche)_36%,transparent)_48%,transparent_82%)]" />
        <div className={cn("absolute inset-x-0 bottom-0 p-3.5 text-[var(--crema)] sm:p-5", glass && "sm:right-auto sm:w-[38%]")}>
          <span className="inline-block rounded-full bg-[color-mix(in_oklab,var(--crema)_20%,transparent)] px-2.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.22em] backdrop-blur-sm">{group.tag}</span>
          <p aria-hidden className="mt-1.5 font-display text-[1.25rem] leading-none tracking-[-0.01em] sm:text-[1.6rem]">
            {group.title}
          </p>
        </div>
      </div>

      {/* ── The choice ── */}
      <div className={cn("flex min-h-0 flex-col bg-[var(--crema)]", glass ? "sm:relative sm:col-start-2 sm:bg-[color-mix(in_oklab,var(--crema)_72%,transparent)] sm:backdrop-blur-2xl" : "")}>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-3.5 sm:px-6 sm:pb-4 sm:pt-7">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-[var(--face-deep)]">Elige tu servicio</p>
          <DialogTitle className="mt-1.5 text-[clamp(1.1rem,2vw,1.35rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{group.ask}</DialogTitle>
          <DialogDescription className="mt-1 text-[12px] leading-relaxed text-ink/70">Toca una opción y te escribimos por WhatsApp para cuadrar el horario.</DialogDescription>

          <PickerOptions variant={variant} items={items} picked={picked} onPick={setPicked} legend={group.title} />
        </div>

        {/* ── Summary and booking, pinned under the options ── */}
        <div className="shrink-0 border-t px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4 sm:pt-3.5" style={{ borderColor: HAIRLINE }}>
          {bar ? (
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p aria-live="polite" className="truncate font-display text-[0.85rem] leading-tight">
                  {current ? current.name : "Aún no has elegido"}
                </p>
                <p className={cn("font-display text-[1.25rem] font-semibold leading-tight", NUMS)}>{current ? formatCOP(current.price) : "—"}</p>
              </div>
              {book}
            </div>
          ) : (
            <>
              <div className="mb-2.5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-ink/70">Tu selección</p>
                  <p aria-live="polite" className="truncate font-display text-[0.85rem] leading-tight">
                    {current ? current.name : "Aún no has elegido"}
                  </p>
                </div>
                <p className={cn("shrink-0 font-display text-[1.15rem] font-semibold leading-none", NUMS)}>{current ? formatCOP(current.price) : "—"}</p>
              </div>
              {book}
            </>
          )}
          <p className="mt-1.5 text-center text-[10.5px] leading-snug text-ink/65">Precios en pesos colombianos, con impuestos incluidos.</p>
        </div>
      </div>
    </DialogContent>
  )
}
