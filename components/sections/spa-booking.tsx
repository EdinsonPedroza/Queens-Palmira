"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronDown, Clock, MapPin } from "lucide-react"
import { InstagramIcon } from "@/components/instagram-icon"
import { Reveal } from "@/components/reveal"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { BUSINESS, VENUES } from "@/lib/site"
import { SPA_SERVICES } from "@/lib/spa-services"
import { WA_SPA, buildBookingMessage, waLink } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

/*
 * "Agenda tu cita": the spa's booking, laid out like Laura Martínez's contact section (the client's reference): a centred header, then the form in a card on the
 * left and, on the right, the contact information (address, hours, WhatsApp, Instagram) and the name of the house. Like hers, the form asks for the person's
 * name and phone, validates, asks for the data-processing consent (Ley 1581 de 2012, with a link to the privacy page) and ends in WhatsApp with the message already
 * written; unlike hers it asks for a SERVICE, a date and an optional time (the spa answers with a slot) and has no e-mail (the spa answers on WhatsApp).
 * LOOK (the client's second reference, an AI mockup of a private-appointment form): a light card with soft rounded corners, fields as filled gold-tinted boxes with no
 * outline (a gold ring on focus), small spaced labels above them, the order service → date and time → name and phone, and a full-width rounded gold button with the
 * WhatsApp logo and a small note under it. The mockup's stylist picker is NOT here (the spa has no stylists to choose from). Dark text on the pale gold band, all with tokens.
 * The site has no backend (project rule): the form builds ONE ready-made message and opens WhatsApp with it. Nothing is stored here.
 */

interface Values {
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string
}
type Errors = Partial<Record<"name" | "phone" | "service" | "date" | "consent", string>>

const EMPTY: Values = { name: "", phone: "", service: "", date: "", time: "", notes: "" }
const ERR = "oklch(0.52 0.17 25)"   // a deep coral that reads on the light band; the brand has no error colour

/** "2026-10-20" as a LOCAL date (new Date("2026-10-20") would be UTC midnight and show the day before in Colombia). */
function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/** A local date as "2026-10-20" (the value of an <input type="date">). */
function isoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

const MAX_DAYS_AHEAD = 365     // a booking can't be further than a year away (the native box lets you type a year like 12111)

function validate(v: Values, consent: boolean): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = "Escribe tu nombre."
  if (!/^[\d\s+\-()]{7,20}$/.test(v.phone.trim())) e.phone = "Escribe un teléfono válido."
  if (!v.service) e.service = "Elige un servicio."
  if (!v.date) e.date = "Elige una fecha."
  else {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (parseDay(v.date) < today) e.date = "Elige una fecha desde hoy."
    else if (parseDay(v.date) > addDays(today, MAX_DAYS_AHEAD)) e.date = "Elige una fecha dentro del próximo año."
  }
  if (!consent) e.consent = "Debes autorizar el tratamiento de tus datos para continuar."
  return e
}

/* The boxes: a gold wash over the cream that is clearly a field (20 %), a fine deep-gold outline at rest (30 %), stronger on hover and a 2 px ring on focus; the text is the full
 * ink and the placeholder 60 % (the first version had the outline off and the placeholder at 45 %, and the fields melted into the card). */
const FIELD =
  "w-full rounded-xl bg-[color-mix(in_oklab,var(--face)_20%,var(--crema))] px-4 text-[14.5px] font-medium text-[var(--ink)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_30%,transparent)] outline-none transition-shadow duration-150 placeholder:font-normal placeholder:text-[var(--ink)]/60 " +
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_60%,transparent)] focus:shadow-[inset_0_0_0_2px_var(--face-deep)]"
const FIELD_ERR = "shadow-[inset_0_0_0_1.5px_oklch(0.52_0.17_25)]"
const LINE = "color-mix(in oklab, var(--ink) 10%, transparent)"
const EASE = "cubic-bezier(0.23,1,0.32,1)"

interface Option {
  value: string
  label: string
  hint?: string
}

/**
 * Our own drop-down instead of the browser's `<select>` (whose list is drawn by the system: it took the field's faded colour, ignored the brand and looked flat). A button that
 * opens a panel of rows: the name on the left, the duration on the right; the row under the pointer (or the arrow keys) is tinted gold, the chosen one is bold with a check.
 * Keyboard: ↑ ↓ Home End move, Enter / Space choose (or open), Esc and Tab close; a click outside closes. The panel fades and drops 6 px in 200 ms (ease-out) and is `inert` while closed.
 */
function Listbox({ id, value, onChange, options, placeholder, invalid, describedBy }: { id: string; value: string; onChange: (v: string) => void; options: Option[]; placeholder: string; invalid?: boolean; describedBy?: string }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const sel = options.findIndex((o) => o.value === value)
  const current = sel >= 0 ? options[sel] : undefined

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open])

  useEffect(() => {
    if (open) list.current?.children[hi]?.scrollIntoView({ block: "nearest" })
  }, [open, hi])

  const show = () => {
    setHi(sel >= 0 ? sel : 0)
    setOpen(true)
  }
  const pick = (i: number) => {
    onChange(options[i].value)
    setOpen(false)
  }
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) show()
      else setHi((h) => Math.max(0, Math.min(last, h + (e.key === "ArrowDown" ? 1 : -1))))
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault()
      if (!open) show()
      setHi(e.key === "Home" ? 0 : last)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (open) pick(hi)
      else show()
    } else if (e.key === "Escape" && open) {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === "Tab") setOpen(false)
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-opt-${hi}` : undefined}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={cn(FIELD, "flex h-12 cursor-pointer items-center justify-between gap-3 text-left", open && "shadow-[inset_0_0_0_2px_var(--face-deep)]", invalid && FIELD_ERR)}
      >
        <span className={cn("truncate", !current && "font-normal text-[var(--ink)]/60")}>{current ? current.label : placeholder}</span>
        <span className="flex shrink-0 items-center gap-3">
          {current?.hint && <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]/60">{current.hint}</span>}
          <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
        </span>
      </button>
      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        inert={!open}
        className="absolute inset-x-0 top-full z-30 mt-2 max-h-72 origin-top overflow-auto rounded-2xl bg-[var(--crema)] p-1.5 shadow-[0_26px_50px_-22px_color-mix(in_oklab,var(--ink)_55%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--face-deep)_32%,transparent)] transition-[opacity,transform] duration-200 motion-reduce:transition-none"
        style={{ opacity: open ? 1 : 0, transform: open ? "none" : "translateY(-6px) scale(0.98)", pointerEvents: open ? "auto" : "none", transitionTimingFunction: EASE }}
      >
        {options.map((o, i) => (
          <li
            key={o.value || "any"}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={i === sel}
            onPointerEnter={() => setHi(i)}
            onClick={() => pick(i)}
            className={cn("flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-[14.5px] text-[var(--ink)] transition-colors duration-100", i === hi && "bg-[color-mix(in_oklab,var(--face)_28%,var(--crema))]", i === sel ? "font-semibold" : "font-medium")}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Check aria-hidden className={cn("h-4 w-4 shrink-0 text-[var(--face-deep)]", i === sel ? "opacity-100" : "opacity-0")} strokeWidth={2.5} />
              <span className="truncate">{o.label}</span>
            </span>
            {o.hint && <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]/60">{o.hint}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]/90">
        <span>{label}</span>
        {optional && <span className="font-normal normal-case tracking-normal text-[var(--ink)]/65">Opcional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[12px]" style={{ color: ERR }}>
          {error}
        </p>
      )}
    </div>
  )
}

/* "Today" is only known in the browser (the page is exported at build time, so the server can't say it): the server snapshot is "" and the limits show up on hydration. */
const subscribeNever = () => () => {}
const useToday = () => useSyncExternalStore(subscribeNever, () => isoDay(new Date()), () => "")

/* The preferred time as a list: every half hour, plus "Cualquier hora" (it is optional). They are preferences, not slots: the spa confirms the real one. */
const TIME_OPTIONS: string[] = Array.from({ length: 25 }, (_, i) => {
  const mins = 8 * 60 + i * 30   // 8:00 AM … 8:00 PM
  const h = Math.floor(mins / 60)
  return `${h % 12 || 12}:${mins % 60 === 0 ? "00" : "30"} ${h >= 12 ? "PM" : "AM"}`
})

/**
 * The contact column as a BUSINESS CARD over a photo (the client picked "Tarjeta de presentación" from six ideas and asked for a photo behind it that contrasts with the
 * elements). The photo is the card's BACKGROUND: it fills the top (a hand with a French manicure on a towel) and melts into crema, so the isotipo's round badge, the name, three round buttons (Cómo llegar,
 * WhatsApp, Instagram: they rise 4 px and fill with gold on hover), the address and hours and the big WhatsApp button always sit on (nearly) plain crema. Each piece rises in with `Reveal` (CSS).
 */
function CardAction({ href, label, aria, delay, children }: { href: string; label: string; aria: string; delay: number; children: ReactNode }) {
  return (
    <Reveal delay={delay}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={aria} className="group flex w-[5.5rem] flex-col items-center gap-2.5 outline-none md:w-24">
        <span
          className={cn(
            "grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--face)_30%,var(--crema))] transition-[background-color,translate,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
            "group-hover:-translate-y-1 group-hover:bg-[var(--face)] group-hover:shadow-[0_14px_22px_-12px_color-mix(in_oklab,var(--face-deep)_80%,transparent)] group-focus-visible:bg-[var(--face)] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[var(--ink)]",
          )}
        >
          {children}
        </span>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]">{label}</span>
      </a>
    </Reveal>
  )
}

function ContactCard() {
  return (
    <div
      data-testid="spa-contact-panel"
      className="relative flex flex-col overflow-hidden rounded-3xl bg-[var(--crema)] text-[var(--ink)]"
      style={{ boxShadow: `0 26px 50px -30px color-mix(in oklab, var(--ink) 55%, transparent), inset 0 0 0 1px ${LINE}` }}
    >
      {/* The card's BACKGROUND: the photo fills its top (a hand with a French manicure on a towel, white flowers) and melts into the crema where the text starts, so the photo is
          seen whole at the top and the ink text, the gold circles and the gold button always sit on (nearly) plain crema. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[340px]">
        <Image src="/images/spa/portada-spa-m.webp" alt="" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-[50%_30%]" />
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_14%,color-mix(in_oklab,var(--crema)_74%,transparent)_46%,var(--crema)_74%)]" />
      </div>

      <h3 className="relative z-10 mx-auto mt-6 rounded-full bg-[color-mix(in_oklab,var(--crema)_86%,transparent)] px-4 py-2 text-[10.5px] font-semibold uppercase tracking-[0.26em] backdrop-blur-md">Información de contacto</h3>

      <div className="relative mt-[150px] flex flex-1 flex-col items-center px-4 pb-6 pt-12 text-center sm:px-6 md:px-10">
        <span className="absolute left-1/2 top-0 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--crema)] shadow-[0_14px_28px_-14px_color-mix(in_oklab,var(--ink)_55%,transparent)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/isotipo-dorado.webp" alt="" width={556} height={803} aria-hidden decoding="async" className="h-12 w-auto" />
        </span>

        <p className="font-display text-[2.4rem] font-bold leading-none tracking-[-0.02em]">Queens Spa</p>
        <p className="mt-2 text-sm text-[var(--ink)]/80">Spa de uñas | Palmira, Valle del Cauca</p>

        <div className="mt-5 flex items-start justify-center gap-1.5 md:gap-6">
          <CardAction href={VENUES.spa.gmaps} label="Cómo llegar" aria="Cómo llegar a Queens Spa en Google Maps" delay={120}>
            <MapPin className="h-5 w-5" strokeWidth={1.5} />
          </CardAction>
          <CardAction href={WA_SPA} label="WhatsApp" aria={`Escribir por WhatsApp al ${BUSINESS.phoneDisplay}`} delay={200}>
            <WhatsAppIcon className="h-5 w-5" />
          </CardAction>
          <CardAction href={BUSINESS.instagramUrl} label="Instagram" aria={`Instagram de Queens ${BUSINESS.instagram}`} delay={280}>
            <InstagramIcon className="h-5 w-5" />
          </CardAction>
        </div>

        <Reveal delay={340} className="mt-5 w-full max-w-sm space-y-1.5 text-sm">
          <p className="flex items-center justify-center gap-2">
            <MapPin aria-hidden className="h-4 w-4 text-[var(--face-deep)]" strokeWidth={1.5} />
            {VENUES.spa.address}, Palmira
          </p>
          <p className="flex items-center justify-center gap-2">
            <Clock aria-hidden className="h-4 w-4 text-[var(--face-deep)]" strokeWidth={1.5} />
            {VENUES.spa.hours[0]} · {VENUES.spa.hours[1]}
          </p>
        </Reveal>

        <Reveal delay={400} className="mt-auto w-full max-w-sm pt-5">
          <a
            href={WA_SPA}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-[var(--face)] text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow-[0_12px_24px_-14px_color-mix(in_oklab,var(--face-deep)_90%,transparent)] transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_oklab,var(--face)_82%,var(--ink))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] active:scale-[0.99]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Escríbenos por WhatsApp
          </a>
        </Reveal>
      </div>
    </div>
  )
}

export function SpaBooking() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [link, setLink] = useState<string | null>(null)   // the WhatsApp link of the last request, kept as a fallback if the new tab was blocked

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const next = { ...values, [k]: e.target.value }
    setValues(next)
    if (submitted) setErrors(validate(next, consent))   // once they tried to send, errors clear as they fix them
  }
  const toggleConsent = () => {
    const next = !consent
    setConsent(next)
    if (submitted) setErrors(validate(values, next))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(values, consent)
    setErrors(errs)
    const firstBad = (["service", "date", "name", "phone", "consent"] as const).find((k) => errs[k])
    if (firstBad) {
      document.getElementById(`booking-${firstBad}`)?.focus()
      return
    }
    const service = SPA_SERVICES.find((s) => s.name === values.service)
    const date = new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(parseDay(values.date))
    const url = waLink(
      buildBookingMessage({
        name: values.name.trim(),
        phone: values.phone.trim(),
        service: values.service,
        duration: service?.duration,
        date,
        time: values.time.trim() || undefined,
        notes: values.notes.trim() || undefined,
      }),
    )
    setLink(url)
    // On a phone the WhatsApp app opens in this same tab (a new tab is often blocked); on a computer it opens in a new one
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) window.location.href = url
    else window.open(url, "_blank", "noopener,noreferrer")
  }

  const today = useToday()
  const invalid = (k: keyof Errors) => (errors[k] ? true : undefined)
  const describedBy = (k: keyof Errors) => (errors[k] ? `booking-${k}-error` : undefined)

  return (
    <section
      id="agendar"
      aria-labelledby="agendar-title"
      className="relative scroll-mt-[var(--nav-h)] bg-[var(--face-soft)] py-10 text-[var(--ink)] md:py-14"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Header, centred ── */}
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <span className="mb-2.5 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">Agenda tu cita</span>
          <h2
            id="agendar-title"
            className="font-display font-semibold text-[var(--ink)]"
            style={{ fontSize: "clamp(1.8rem, 3.8vw, 2.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Reserva en un minuto
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]/80 md:text-base">
            Cuéntanos qué te gustaría y te abrimos WhatsApp con tu solicitud lista para enviar. Nosotras te confirmamos el horario.
          </p>
        </Reveal>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          {/* ── Form card ── */}
          <Reveal delay={100}>
            <form
              onSubmit={onSubmit}
              noValidate
              data-testid="spa-booking-form"
              className="rounded-3xl bg-[var(--crema)] p-5 shadow-[0_18px_40px_-26px_color-mix(in_oklab,var(--ink)_45%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--face)_30%,transparent)] md:p-8"
            >
              <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)]">Envíanos tu solicitud</h3>

              <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="booking-service" label="Servicio" error={errors.service}>
                    <Listbox
                      id="booking-service"
                      value={values.service}
                      onChange={(v) => set("service")({ target: { value: v } })}
                      options={SPA_SERVICES.map((s) => ({ value: s.name, label: s.name, hint: s.duration }))}
                      placeholder="Elige un servicio"
                      invalid={invalid("service")}
                      describedBy={describedBy("service")}
                    />
                  </Field>
                </div>

                <Field id="booking-date" label="Fecha" error={errors.date}>
                  <input
                    id="booking-date"
                    name="date"
                    type="date"
                    min={today || undefined}
                    max={today ? isoDay(addDays(parseDay(today), MAX_DAYS_AHEAD)) : undefined}
                    value={values.date}
                    onChange={set("date")}
                    // anywhere on the box opens the calendar (by default only the little icon does)
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker()
                      } catch {
                        /* the browser has no showPicker, or it refused: the native box still works by typing */
                      }
                    }}
                    aria-invalid={invalid("date")}
                    aria-describedby={describedBy("date")}
                    className={cn(FIELD, "h-12 cursor-pointer [color-scheme:light]", !values.date && "text-[var(--ink)]/60", errors.date && FIELD_ERR)}
                  />
                </Field>

                <Field id="booking-time" label="Hora preferida" optional>
                  <Listbox
                    id="booking-time"
                    value={values.time}
                    onChange={(v) => set("time")({ target: { value: v } })}
                    options={[{ value: "", label: "Cualquier hora" }, ...TIME_OPTIONS.map((t) => ({ value: t, label: t }))]}
                    placeholder="Cualquier hora"
                  />
                </Field>

                <Field id="booking-name" label="Nombre completo" error={errors.name}>
                  <input
                    id="booking-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={60}
                    value={values.name}
                    onChange={set("name")}
                    placeholder="Tu nombre"
                    aria-invalid={invalid("name")}
                    aria-describedby={describedBy("name")}
                    className={cn(FIELD, "h-12", errors.name && FIELD_ERR)}
                  />
                </Field>

                <Field id="booking-phone" label="Teléfono" error={errors.phone}>
                  <input
                    id="booking-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    value={values.phone}
                    onChange={set("phone")}
                    placeholder="Tu teléfono"
                    aria-invalid={invalid("phone")}
                    aria-describedby={describedBy("phone")}
                    className={cn(FIELD, "h-12", errors.phone && FIELD_ERR)}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field id="booking-notes" label="Detalles" optional>
                    <textarea
                      id="booking-notes"
                      name="notes"
                      rows={3}
                      maxLength={300}
                      value={values.notes}
                      onChange={set("notes")}
                      placeholder="Un diseño, un color, si tienes uñas puestas para retirar…"
                      className={cn(FIELD, "min-h-24 resize-y py-3 leading-relaxed")}
                    />
                  </Field>
                </div>
              </div>

              {/* Data-processing consent: required by Ley 1581 de 2012 / Decreto 1377 de 2013 (as on the reference) */}
              <div className="mt-5">
                <div className="flex items-start gap-3">
                  <button
                    id="booking-consent"
                    type="button"
                    role="checkbox"
                    aria-checked={consent}
                    aria-invalid={invalid("consent")}
                    aria-describedby={describedBy("consent")}
                    onClick={toggleConsent}
                    data-testid="spa-booking-consent"
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--face)]",
                      consent ? "bg-[var(--face)] text-[var(--ink)]" : "bg-[color-mix(in_oklab,var(--face)_16%,var(--crema))] text-transparent",
                      errors.consent && FIELD_ERR,
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                  <label htmlFor="booking-consent" className="cursor-pointer text-[13px] leading-relaxed text-[var(--ink)]/80" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) return; e.preventDefault(); toggleConsent() }}>
                    Autorizo el tratamiento de mis datos personales conforme a la{" "}
                    <Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--ink)] underline underline-offset-2 hover:text-[var(--face-deep)]">
                      Política de Privacidad
                    </Link>{" "}
                    para ser contactada sobre mi cita. *
                  </label>
                </div>
                {errors.consent && (
                  <p id="booking-consent-error" role="alert" className="mt-2 text-[12px]" style={{ color: ERR }}>
                    {errors.consent}
                  </p>
                )}
              </div>

              <button
                type="submit"
                data-testid="spa-booking-submit"
                className="mt-6 flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--face)] text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] shadow-[0_12px_24px_-14px_color-mix(in_oklab,var(--face-deep)_90%,transparent)] transition-[background-color,transform] duration-200 hover:bg-[color-mix(in_oklab,var(--face)_82%,var(--ink))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--face)] active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Agendar por WhatsApp
              </button>

              <p role="status" aria-live="polite" className="mt-3 text-center text-[12px] leading-snug text-[var(--ink)]/70">
                {link ? (
                  <>
                    Abrimos WhatsApp con tu solicitud.{" "}
                    <a href={link} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--ink)]/35 underline-offset-4 hover:text-[var(--ink)] hover:decoration-[var(--ink)]">
                      Si no se abrió, toca aquí
                    </a>
                    .
                  </>
                ) : (
                  "Al enviar, serás redirigida a WhatsApp con tu mensaje. No guardamos tus datos en el sitio."
                )}
              </p>
            </form>
          </Reveal>

          {/* ── Contact information: the business card over a photo (see ContactCard). It keeps its own (shorter) height and is centred beside the form. ── */}
          <Reveal delay={200} className="min-w-0 lg:self-center">
            <ContactCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
