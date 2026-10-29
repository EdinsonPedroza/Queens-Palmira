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
 * bonito"). Phones get a sheet that rises from the bottom (a photo strip on top, the options, and the booking button pinned under them); from md up it is a card in the middle:
 * the card's photo on the left, the choice on the right. Native radios, so the arrow keys and the labels work for free. No service is chosen at first (the cheapest would be booked
 * by accident), and the button says so until one is: then it carries the service's price and opens WhatsApp, on the SPA's number, with that service in the message.
 * It is mounted only while open, so every opening starts with nothing chosen. Entrances are CSS (`.picker` in globals.css).
 */

const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
const IDLE =
  "bg-[color-mix(in_oklab,var(--face)_8%,var(--crema))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_28%,transparent)] hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_60%,transparent)]"
const SELECTED = "bg-[var(--face-soft)] shadow-[inset_0_0_0_2px_var(--face-deep)]"

export function ServicePickerContent({ group, items, onDone }: { group: SpaGroup; items: SpaService[]; onDone: () => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const current = items.find((s) => s.name === picked)

  return (
    <DialogContent
      data-testid="spa-picker"
      className={cn(
        // Phones: a sheet glued to the bottom. md and up: a card centred on the screen. (The base classes are the cart dialog's centred card: these override them.)
        "picker left-0 top-auto bottom-0 grid max-h-[92svh] w-full max-w-none translate-x-0 translate-y-0 grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-t-[1.75rem] rounded-b-none p-0 text-ink",
        "md:left-1/2 md:top-1/2 md:bottom-auto md:h-[min(640px,88svh)] md:w-[min(960px,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-[0.8fr_1.2fr] md:grid-rows-1 md:rounded-[1.75rem]",
      )}
      closeClassName="right-3 top-3 grid h-11 w-11 place-items-center bg-[color-mix(in_oklab,var(--crema)_90%,transparent)] p-0 backdrop-blur-sm md:right-5 md:top-5 md:bg-transparent md:backdrop-blur-none"
    >
      {/* ── The photo of the card, with its name over it ── */}
      <div className="relative h-36 shrink-0 md:h-full md:min-h-0">
        <Image src={group.photo} alt="" fill sizes="(min-width: 768px) 400px, 100vw" draggable={false} className="object-cover" style={{ objectPosition: group.focus }} />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--dorado-noche)_88%,transparent)_0%,color-mix(in_oklab,var(--dorado-noche)_36%,transparent)_48%,transparent_82%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-[var(--crema)] md:p-8">
          <span className="inline-block rounded-full bg-[color-mix(in_oklab,var(--crema)_20%,transparent)] px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.22em] backdrop-blur-sm">{group.tag}</span>
          <p aria-hidden className="mt-3 font-display text-[1.9rem] leading-none tracking-[-0.01em] md:text-[2.6rem]">
            {group.title}
          </p>
          <p className="mt-2.5 hidden max-w-[16rem] text-[13px] leading-relaxed text-[var(--crema)]/85 md:block">Cada servicio se reserva con cita previa.</p>
        </div>
      </div>

      {/* ── The choice ── */}
      <div className="flex min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-5 md:px-10 md:pb-6 md:pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--face-deep)]">Elige tu servicio</p>
          <DialogTitle className="mt-2.5 text-[clamp(1.6rem,3.2vw,2.3rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{group.ask}</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-ink/70">Toca una opción y te escribimos por WhatsApp para cuadrar el horario.</DialogDescription>

          <fieldset className="mt-5 space-y-2.5 md:mt-7 md:space-y-3">
            <legend className="sr-only">{group.title}</legend>
            {items.map((s) => {
              const on = s.name === picked
              return (
                <label key={s.name} className="block cursor-pointer">
                  <input type="radio" name="spa-service" value={s.name} checked={on} onChange={() => setPicked(s.name)} data-testid="spa-picker-option" className="peer sr-only" />
                  <span
                    className={cn(
                      "flex items-center gap-4 rounded-2xl px-4 py-4 transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ink)] md:px-5",
                      on ? SELECTED : IDLE,
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors duration-200 motion-reduce:transition-none", on ? "bg-[var(--face)] text-[var(--ink)]" : "shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--ink)_35%,transparent)]")}
                    >
                      <Check className={cn("h-3.5 w-3.5 transition-opacity duration-150 motion-reduce:transition-none", on ? "opacity-100" : "opacity-0")} strokeWidth={3} />
                    </span>
                    <span className="min-w-0 flex-1 font-display text-[1.2rem] leading-tight md:text-[1.3rem]">{s.label ?? s.name}</span>
                    <span className="shrink-0 text-[1.05rem] font-semibold [font-variant-numeric:lining-nums]">{formatCOP(s.price)}</span>
                  </span>
                </label>
              )
            })}
          </fieldset>
        </div>

        {/* ── Summary and booking, pinned under the options ── */}
        <div className="shrink-0 border-t px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 md:px-10 md:pb-7 md:pt-5" style={{ borderColor: HAIRLINE }}>
          <div className="mb-3.5 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/70">Tu selección</p>
              <p aria-live="polite" className="truncate font-display text-[1.05rem] leading-tight md:text-[1.2rem]">
                {current ? current.name : "Aún no has elegido"}
              </p>
            </div>
            <p className="shrink-0 font-display text-[1.6rem] font-semibold leading-none [font-variant-numeric:lining-nums] md:text-[1.9rem]">{current ? formatCOP(current.price) : "—"}</p>
          </div>

          {current ? (
            <a
              href={spaBookingLink(current.name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDone}
              data-testid="spa-picker-book"
              className="flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--face)] text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow-[0_12px_24px_-14px_color-mix(in_oklab,var(--face-deep)_90%,transparent)] transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_oklab,var(--face)_82%,var(--ink))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] active:scale-[0.99]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Reservar por WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              data-testid="spa-picker-book"
              className="flex h-13 w-full cursor-not-allowed items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--face)_16%,var(--crema))] text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ink/60"
            >
              Elige un servicio
            </button>
          )}
          <p className="mt-2.5 text-center text-[12px] leading-snug text-ink/65">Precios en pesos colombianos, con impuestos incluidos.</p>
        </div>
      </div>
    </DialogContent>
  )
}
