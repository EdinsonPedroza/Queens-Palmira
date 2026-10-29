"use client"

import { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import type { SpaGroup, SpaService } from "@/lib/spa-services"
import { cn, formatCOP } from "@/lib/utils"
import { spaBookingLink } from "@/lib/whatsapp"

/*
 * The window a menu card with SEVERAL services opens (the client: "cuando se seleccione se abra como una ventana donde se pueda seleccionar el servicio, pero que se vea todo
 * bonito"; then "que no se vea tan grande"; then, from five ideas, "el compacto pero más pequeño": the other four are gone). Phones get a sheet that rises from the bottom (a photo
 * strip on top, the options, and the booking button pinned under them); from md up it is a small card in the middle: the card's photo on the left, the choice on the right. Native
 * radios, so the arrow keys and the labels work for free. No service is chosen at first (the cheapest would be booked by accident) and the button says so until one is: then it
 * carries the service's price and opens WhatsApp, on the SPA's number, with that service in the message. It is mounted only while open, so every opening starts with nothing chosen.
 * Entrances are CSS (`.picker` in globals.css). Keep it small: the client asked twice for smaller text and elements.
 */

const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
const IDLE =
  "bg-[color-mix(in_oklab,var(--face)_8%,var(--crema))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_28%,transparent)] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_60%,transparent)]"
const SELECTED = "bg-[var(--face-soft)] shadow-[inset_0_0_0_1.5px_var(--face-deep)]"
const NUMS = "[font-variant-numeric:lining-nums]"

export function ServicePickerContent({ group, items, onDone }: { group: SpaGroup; items: SpaService[]; onDone: () => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const current = items.find((s) => s.name === picked)

  return (
    <DialogContent
      data-testid="spa-picker"
      className={cn(
        // Phones: a sheet glued to the bottom. md and up: a card centred on the screen. (The base classes are the cart dialog's centred card: these override them.)
        "picker left-0 top-auto bottom-0 grid max-h-[92svh] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-t-[1.25rem] rounded-b-none p-0 text-ink",
        "md:left-1/2 md:top-1/2 md:bottom-auto md:max-h-[88svh] md:w-[min(660px,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-[0.62fr_1.38fr] md:grid-rows-1 md:rounded-[1.25rem]",
      )}
      closeClassName="right-2.5 top-2.5 grid h-9 w-9 place-items-center bg-[color-mix(in_oklab,var(--crema)_90%,transparent)] p-0 backdrop-blur-sm md:right-3 md:top-3 md:bg-transparent md:backdrop-blur-none [&_svg]:h-4 [&_svg]:w-4"
    >
      {/* ── The photo of the card, with its name over it ── */}
      <div className="relative h-24 shrink-0 md:h-full md:min-h-[340px]">
        <Image src={group.photo} alt="" fill sizes="(min-width: 768px) 260px, 100vw" draggable={false} className="object-cover" style={{ objectPosition: group.focus }} />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--dorado-noche)_88%,transparent)_0%,color-mix(in_oklab,var(--dorado-noche)_36%,transparent)_48%,transparent_82%)]" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-[var(--crema)] md:p-5">
          <span className="inline-block rounded-full bg-[color-mix(in_oklab,var(--crema)_20%,transparent)] px-2.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.22em] backdrop-blur-sm">{group.tag}</span>
          <p aria-hidden className="mt-1.5 font-display text-[1.25rem] leading-none tracking-[-0.01em] md:text-[1.6rem]">
            {group.title}
          </p>
        </div>
      </div>

      {/* ── The choice ── */}
      <div className="flex min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-3.5 md:px-6 md:pb-4 md:pt-7">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-[var(--face-deep)]">Elige tu servicio</p>
          <DialogTitle className="mt-1.5 text-[clamp(1.1rem,2vw,1.35rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{group.ask}</DialogTitle>
          <DialogDescription className="mt-1 text-[12px] leading-relaxed text-ink/70">Toca una opción y te escribimos por WhatsApp para cuadrar el horario.</DialogDescription>

          <fieldset className="mt-3 space-y-1.5">
            <legend className="sr-only">{group.title}</legend>
            {items.map((s) => {
              const on = s.name === picked
              return (
                <label key={s.name} className="block cursor-pointer">
                  <input type="radio" name="spa-service" value={s.name} checked={on} onChange={() => setPicked(s.name)} data-testid="spa-picker-option" className="peer sr-only" />
                  <span
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ink)]",
                      on ? SELECTED : IDLE,
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none", on ? "bg-[var(--face)] text-[var(--ink)]" : "shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--ink)_35%,transparent)]")}
                    >
                      <Check className={cn("h-2.5 w-2.5 transition-opacity duration-150 motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")} strokeWidth={3} />
                    </span>
                    <span className="min-w-0 flex-1 font-display text-[0.92rem] leading-tight">{s.label ?? s.name}</span>
                    <span className={cn("shrink-0 text-[0.85rem] font-semibold", NUMS)}>{formatCOP(s.price)}</span>
                  </span>
                </label>
              )
            })}
          </fieldset>
        </div>

        {/* ── Summary and booking, pinned under the options ── */}
        <div className="shrink-0 border-t px-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3 md:px-6 md:pb-4 md:pt-3.5" style={{ borderColor: HAIRLINE }}>
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
