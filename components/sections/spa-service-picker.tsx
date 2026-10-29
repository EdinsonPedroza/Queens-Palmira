"use client"

import { useId, useState } from "react"
import Image from "next/image"
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import type { SpaGroup, SpaService } from "@/lib/spa-services"
import { cn, formatCOP } from "@/lib/utils"
import { spaBookingLink } from "@/lib/whatsapp"

/*
 * The window a menu card with SEVERAL services opens (the client: "cuando se seleccione se abra como una ventana donde se pueda seleccionar el servicio, pero que se vea todo
 * bonito"; then "que no se vea tan grande"; then, from five ideas, "el compacto pero más pequeño"; then, from five Apple-style refinements, "el de pastilla es perfecto": the
 * other nine ideas are gone). Phones (under 640 px) get a sheet that rises from the bottom (a photo strip on top, the options, and the booking button pinned under them); from
 * 640 px up, iPads included, it is a small card in the middle: the card's photo on the left, the choice on the right (the client wants the iPad to look like the computer).
 *
 * THE OPTIONS ("Pastilla"): one segmented control, vertical. A light pill sits behind the rows and SLIDES to the one you touch; every row is 3 rem tall, so its place is just its
 * index (`translateY(index * 3rem)`): keep the rows at `h-12` and the two numbers in step. Native radios, so the arrow keys and the labels work for free. No service is chosen at
 * first (the cheapest would be booked by accident), the pill is hidden and the button says so until one is: then it carries the service's price and opens WhatsApp, on the SPA's
 * number, with that service in the message. It is mounted only while open, so every opening starts with nothing chosen. Entrances are CSS (`.picker` in globals.css). Keep it small.
 */

const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
const NUMS = "[font-variant-numeric:lining-nums]"

export function ServicePickerContent({ group, items, onDone }: { group: SpaGroup; items: SpaService[]; onDone: () => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const radioName = useId()
  const current = items.find((s) => s.name === picked)
  const idx = items.findIndex((s) => s.name === picked)

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
      {/* ── The photo of the card, with its name over it ── */}
      <div className="relative h-24 shrink-0 sm:h-full sm:min-h-[340px]">
        <Image src={group.photo} alt="" fill sizes="(min-width: 640px) 260px, 100vw" draggable={false} className="object-cover" style={{ objectPosition: group.focus }} />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--dorado-noche)_88%,transparent)_0%,color-mix(in_oklab,var(--dorado-noche)_36%,transparent)_48%,transparent_82%)]" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-[var(--crema)] sm:p-5">
          <span className="inline-block rounded-full bg-[color-mix(in_oklab,var(--crema)_20%,transparent)] px-2.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.22em] backdrop-blur-sm">{group.tag}</span>
          <p aria-hidden className="mt-1.5 font-display text-[1.25rem] leading-none tracking-[-0.01em] sm:text-[1.6rem]">
            {group.title}
          </p>
        </div>
      </div>

      {/* ── The choice ── */}
      <div className="flex min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-3.5 sm:px-6 sm:pb-4 sm:pt-7">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-[var(--face-deep)]">Elige tu servicio</p>
          <DialogTitle className="mt-1.5 text-[clamp(1.1rem,2vw,1.35rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{group.ask}</DialogTitle>
          <DialogDescription className="mt-1 text-[12px] leading-relaxed text-ink/70">Toca una opción y te escribimos por WhatsApp para cuadrar el horario.</DialogDescription>

          <fieldset className="mt-3.5 rounded-2xl bg-[color-mix(in_oklab,var(--face)_14%,var(--crema))] p-1">
            <legend className="sr-only">{group.title}</legend>
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
                    <input type="radio" name={radioName} value={s.name} checked={on} onChange={() => setPicked(s.name)} data-testid="spa-picker-option" className="peer sr-only" />
                    <span
                      className={cn(
                        "relative flex h-12 items-center justify-between gap-3 rounded-xl px-4",
                        "peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-[var(--ink)]",
                        !on && "hover:bg-[color-mix(in_oklab,var(--face)_14%,transparent)]",
                      )}
                    >
                      <span className={cn("font-display text-[1.05rem] leading-tight", on && "font-semibold")}>{s.label ?? s.name}</span>
                      <span className={cn("text-[0.92rem] font-semibold", on ? "text-ink" : "text-ink/70", NUMS)}>{formatCOP(s.price)}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </div>

        {/* ── Summary and booking, pinned under the options ── */}
        <div className="shrink-0 border-t px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4 sm:pt-3.5" style={{ borderColor: HAIRLINE }}>
          <div className="mb-2.5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-ink/70">Tu selección</p>
              <p aria-live="polite" className="truncate font-display text-[0.85rem] leading-tight">
                {current ? current.name : "Aún no has elegido"}
              </p>
            </div>
            <p className={cn("shrink-0 font-display text-[1.15rem] font-semibold leading-none", NUMS)}>{current ? formatCOP(current.price) : "—"}</p>
          </div>

          {current ? (
            <a
              href={spaBookingLink(current.name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDone}
              data-testid="spa-picker-book"
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--face)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow-[0_8px_16px_-12px_color-mix(in_oklab,var(--face-deep)_90%,transparent)] transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_oklab,var(--face)_82%,var(--ink))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] active:scale-[0.99]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Reservar por WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              data-testid="spa-picker-book"
              className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--face)_16%,var(--crema))] text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60"
            >
              Elige un servicio
            </button>
          )}
          <p className="mt-1.5 text-center text-[10.5px] leading-snug text-ink/65">Precios en pesos colombianos, con impuestos incluidos.</p>
        </div>
      </div>
    </DialogContent>
  )
}
