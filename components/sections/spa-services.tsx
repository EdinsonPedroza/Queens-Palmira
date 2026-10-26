"use client"

import { useCallback, useRef, useState, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react"
import Image from "next/image"
import { useInView, useReducedMotion } from "framer-motion"
import { Reveal } from "@/components/reveal"
import { SPA_SERVICES as SERVICES, type SpaService } from "@/lib/spa-services"
import { spaBookingLink } from "@/lib/whatsapp"

const EASE = "cubic-bezier(0.16,1,0.3,1)" // strong ease-out: things arriving
const EASE_UI = "cubic-bezier(0.23,1,0.32,1)" // strong ease-out for hover
const ratio = (s: SpaService) => s.width / s.height
const RADIUS = "1.1rem"
const GRADIENT = "linear-gradient(to top, color-mix(in oklab, var(--dorado-noche) 94%, transparent) 0%, color-mix(in oklab, var(--dorado-noche) 62%, transparent) 34%, transparent 66%)"

/* Rows of the gallery: every row ends up the same height because each card is as wide as its photo is (so each photo is shown whole). */
const ROWS_WIDE = [[0, 1, 2], [3, 4, 5]]
const ROWS_TABLET = [[0, 1], [2], [3, 4], [5]]
const ROWS_PHONE = [[0], [1], [2], [3], [4], [5]] // two cards side by side are too narrow on a phone for the texts of the card

function useMedia(query: string, server: boolean) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query)
      m.addEventListener("change", cb)
      return () => m.removeEventListener("change", cb)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => server)
}

/*
 * One card of the gallery (the client's "Revelado": only the tag and the name are shown; the description unfolds when the card is pointed at, and always on a phone, where
 * nothing can be pointed at).
 *
 * ENTRANCE (once, when it scrolls into view; rows 140 ms apart, cards in a row 90 ms apart): each card FADES IN AND SETTLES: it rises 32 px and grows from 97 % while it fades
 * (0.8–1 s, strong ease-out) and its photo, which starts a little larger, eases back to its size behind it; then the tag, the name and the details fade up. Nothing
 * wipes or draws across the card: the client did not like entrances that load from one side to the other (the first was an iris, the second a curtain that rose,
 * and the fine white lines that went with them are gone too).
 *
 * HOVER (mouse or keyboard focus; the cursor becomes the hand: the whole card is the booking link; everything on an ease-out): the card lifts 6 px, the photo drifts closer
 * (scale 1.08) and follows the cursor a few pixels the other way, a second layer deepens the gradient, the tag fills, the description
 * unfolds (grid rows) while its text rises into place, and a gold line draws itself along the bottom edge. Leaving, everything goes back at the same speed.
 *
 * Only `transform` and `opacity` move (the unfolding uses grid rows, the usual exception for an accordion). With "reduce motion" the cards are simply there and the
 * hover only fades and unfolds. The card is a `group` and each card writes its own transforms (nothing on a parent).
 */
function RevealCard({ s, n, row, fill, hoverable }: { s: SpaService; n: number; row: number; fill: boolean; hoverable: boolean }) {
  const slot = useRef<HTMLDivElement>(null) // what we watch: it is never clipped (a fully clipped element reports no intersection and would never open)
  const drift = useRef<HTMLDivElement>(null)
  const seenOnce = useInView(slot, { once: true, margin: "-60px" })
  const reduce = useReducedMotion()
  const show = seenOnce || !!reduce
  const [on, setOn] = useState(false)
  const delay = row * 140 + n * 90
  const open = !hoverable || on
  const t = (css: string) => (reduce ? "none" : css) // no transitions at all with "reduce motion"
  const rise = (extra: number, y = 14) => ({ opacity: show ? 1 : 0, transform: show ? "none" : `translateY(${y}px)`, transition: t(`opacity 700ms ease-out ${delay + 450 + extra}ms, transform 900ms ${EASE} ${delay + 450 + extra}ms`) })

  const point = (e: ReactPointerEvent) => {
    const el = drift.current
    if (e.pointerType !== "mouse" || !el) return
    const r = e.currentTarget.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width - 0.5) * -12
    const dy = ((e.clientY - r.top) / r.height - 0.5) * -12
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(1.08)`
  }
  const enter = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return
    setOn(true)
    if (drift.current) drift.current.style.transform = "scale(1.08)"
  }
  const leave = () => {
    setOn(false)
    if (drift.current) drift.current.style.transform = "none"
  }

  return (
    <div ref={slot} className="min-w-0" style={{ flex: fill ? "1 1 0%" : `${ratio(s)} 1 0%`, aspectRatio: ratio(s) }}>
      <div className="relative h-full w-full" style={{ translate: on ? "0 -6px" : "0 0", transition: t(`translate 500ms ${EASE_UI}`) }}>
        {/* the shadows: a soft one always, a deeper one while pointed at (opacity only) */}
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: RADIUS, boxShadow: "0 26px 44px -34px color-mix(in oklab, var(--ink) 55%, transparent)", opacity: show ? 1 : 0, transition: t(`opacity 900ms ease-out ${delay}ms`) }} />
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ borderRadius: RADIUS, boxShadow: "0 40px 58px -32px color-mix(in oklab, var(--ink) 68%, transparent)", opacity: on ? 1 : 0, transition: t(`opacity 500ms ${EASE_UI}`) }} />

        {/* The whole card is the booking link (the hand cursor says so). There is NO arrow on the photo: the client did not like the round one in the top right corner. */}
        <a
          href={spaBookingLink(s.name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Reservar ${s.name} por WhatsApp`}
          onPointerEnter={enter}
          onPointerMove={point}
          onPointerLeave={leave}
          onFocus={() => setOn(true)}
          onBlur={() => setOn(false)}
          className="group relative block h-full w-full cursor-pointer overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--crema)]"
          style={{
            borderRadius: RADIUS,
            opacity: show ? 1 : 0,
            transform: show ? "none" : "translateY(32px) scale(0.97)",
            transition: t(`opacity 800ms ease-out ${delay}ms, transform 1000ms ${EASE} ${delay}ms`),
          }}
        >
          {/* the photo: hover drift on the outer layer, entrance (a slow settle from a little larger) on the inner one */}
          <div ref={drift} className="absolute inset-0" style={{ transition: t(`transform 1100ms ${EASE_UI}`) }}>
            <div className="absolute inset-0" style={{ transform: show ? "none" : "scale(1.1)", transition: t(`transform 1600ms ${EASE} ${delay}ms`) }}>
              <Image src={s.photo} alt="" fill sizes="(min-width: 1024px) 520px, 90vw" draggable={false} className="object-cover" />
            </div>
          </div>

          <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: GRADIENT }} />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-[var(--dorado-noche)]" style={{ opacity: open ? 0.28 : 0, transition: t(`opacity 600ms ${EASE_UI}`) }} />

          <div className="absolute inset-x-0 top-0 flex items-start p-5 md:p-6">
            <span
              className="rounded-full px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.22em] text-[var(--crema)] backdrop-blur-sm"
              style={{ ...rise(0, 10), background: on ? "color-mix(in oklab, var(--crema) 30%, transparent)" : "color-mix(in oklab, var(--crema) 16%, transparent)" }}
            >
              {s.tag}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-[var(--crema)] md:p-6">
            <p role="heading" aria-level={3} className="font-display text-[1.4rem] leading-[1.05] tracking-[-0.01em] md:text-[1.7rem]" style={rise(60, 12)}>
              {s.name}
            </p>
            <div className={`grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} style={{ transition: t(`grid-template-rows 550ms ${EASE_UI}`) }}>
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-[26rem] pt-2 text-[13.5px] leading-relaxed text-[var(--crema)]/85 md:text-[14px]" style={{ opacity: open ? 1 : 0, transform: open ? "none" : "translateY(10px)", transition: t(`opacity 450ms ease-out ${open ? 90 : 0}ms, transform 650ms ${EASE_UI} ${open ? 90 : 0}ms`) }}>
                  {s.desc}
                </p>
              </div>
            </div>
            <p className="mt-3.5 flex flex-wrap justify-between gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.2em] text-[var(--crema)]/80" style={rise(140, 10)}>
              <span>{s.duration}</span>
              <span>Precio: consultar</span>
            </p>
          </div>

          {/* a gold line that draws itself along the bottom edge */}
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[var(--face)]" style={{ transform: `scaleX(${open && hoverable ? 1 : 0})`, transition: t(`transform 900ms ${EASE}`) }} />
        </a>
      </div>
    </div>
  )
}

/*
 * The menu as a gallery (the client picked the "Revelado" version): the six cards of the client's reference in rows of the same height, each as wide as its photo, so every photo is
 * shown whole. Phones get one card per row, tablets two.
 */
export function SpaServices() {
  const wide = useMedia("(min-width: 1024px)", true)
  const tablet = useMedia("(min-width: 640px)", true)
  const hoverable = useMedia("(hover: hover) and (pointer: fine)", false)
  const rows = wide ? ROWS_WIDE : tablet ? ROWS_TABLET : ROWS_PHONE
  return (
    <section id="servicios" aria-labelledby="servicios-title" className="relative scroll-mt-[var(--nav-h)] bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 pb-8 pt-6 text-ink md:pb-12 md:pt-8">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Header ── */}
        <Reveal className="mb-4 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 md:mb-6">
          <div>
            <span className="mb-2.5 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">El menú</span>
            <h2 id="servicios-title" className="font-display font-semibold text-ink" style={{ fontSize: "clamp(1.45rem, 3vw, 2.2rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Servicios Queens
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink/70">Cada servicio se reserva con cita previa. Toca el servicio que quieras y te escribimos por WhatsApp para cuadrar el horario.</p>
        </Reveal>

        {/* ── Gallery ── */}
        <div className="space-y-6 md:space-y-5">
          {rows.map((row, gi) => (
            <div key={`${wide}-${tablet}-${gi}`} className="flex justify-center gap-3 md:gap-5">
              {row.map((k, n) => (
                <RevealCard key={k} s={SERVICES[k]} n={n} row={gi} fill={!tablet} hoverable={hoverable} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
