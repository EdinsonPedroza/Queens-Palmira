"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { CalendarHeart, Check, ChevronDown, Clock, MapPin } from "lucide-react"
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
 * Flat, square and with fine lines, like the rest of the site, on a dark band in "dorado noche" (--dorado-noche: the gold's own hue, very dark).
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
  }
  if (!consent) e.consent = "Debes autorizar el tratamiento de tus datos para continuar."
  return e
}

const FIELD =
  "w-full bg-[color-mix(in_oklab,var(--crema)_7%,transparent)] px-3.5 text-[14px] text-[var(--crema)] outline-none transition-shadow duration-150 placeholder:text-[var(--crema)]/40 " +
  "hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--crema)_50%,transparent)] focus:shadow-[inset_0_0_0_2px_var(--face)]"
const FIELD_LINE = "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--crema)_24%,transparent)]"
const FIELD_ERR = "shadow-[inset_0_0_0_1.5px_oklch(0.52_0.17_25)]"
const LINE = "color-mix(in oklab, var(--crema) 16%, transparent)"

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--face)]">
        <span>{label}</span>
        {optional && <span className="font-normal normal-case tracking-normal text-[var(--crema)]/50">Opcional</span>}
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

/** One row of the information column: a square icon box, a small label and the value. */
function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div
      className="group flex items-start gap-4 bg-[color-mix(in_oklab,var(--crema)_5%,transparent)] p-4 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--crema)_9%,transparent)]"
      style={{ boxShadow: `inset 0 0 0 1px ${LINE}` }}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center text-[var(--face)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face)_55%,transparent)] transition-colors duration-300 group-hover:bg-[var(--face)] group-hover:text-[var(--dorado-noche)]">
        {icon}
      </span>
      <div className="min-w-0 text-[var(--crema)]">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--crema)]/60">{label}</p>
        {children}
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
    const firstBad = (["name", "phone", "service", "date", "consent"] as const).find((k) => errs[k])
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

  const invalid = (k: keyof Errors) => (errors[k] ? true : undefined)
  const describedBy = (k: keyof Errors) => (errors[k] ? `booking-${k}-error` : undefined)

  return (
    <section
      id="agendar"
      aria-labelledby="agendar-title"
      className="relative scroll-mt-[var(--nav-h)] bg-[var(--dorado-noche)] py-10 text-[var(--crema)] md:py-14"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ── Header, centred ── */}
        <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <span className="mb-2.5 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face)]">Agenda tu cita</span>
          <h2
            id="agendar-title"
            className="font-display font-semibold text-[var(--crema)]"
            style={{ fontSize: "clamp(1.8rem, 3.8vw, 2.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            Reserva en un minuto
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--crema)]/75 md:text-base">
            Cuéntanos qué te gustaría y te abrimos WhatsApp con tu solicitud lista para enviar. Nosotras te confirmamos el horario.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ── Form card ── */}
          <Reveal delay={100}>
            <form
              onSubmit={onSubmit}
              noValidate
              data-testid="spa-booking-form"
              className="bg-[color-mix(in_oklab,var(--dorado-noche)_88%,var(--crema))] p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--face)_35%,transparent)] md:p-7"
            >
              <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--crema)]">Envíanos tu solicitud</h3>

              <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
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
                    className={cn(FIELD, "h-11", errors.name ? FIELD_ERR : FIELD_LINE)}
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
                    className={cn(FIELD, "h-11", errors.phone ? FIELD_ERR : FIELD_LINE)}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field id="booking-service" label="Servicio" error={errors.service}>
                    <div className="relative">
                      <select
                        id="booking-service"
                        name="service"
                        value={values.service}
                        onChange={set("service")}
                        aria-invalid={invalid("service")}
                        aria-describedby={describedBy("service")}
                        className={cn(FIELD, "h-11 cursor-pointer appearance-none pr-10", !values.service && "text-[var(--crema)]/40", errors.service ? FIELD_ERR : FIELD_LINE)}
                      >
                        <option value="" disabled className="bg-[var(--dorado-noche)] text-[var(--crema)]">Elige un servicio</option>
                        {SPA_SERVICES.map((s) => (
                          <option key={s.name} value={s.name} className="bg-[var(--dorado-noche)] text-[var(--crema)]">
                            {s.name} · {s.duration}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--face)]" />
                    </div>
                  </Field>
                </div>

                <Field id="booking-date" label="Fecha" error={errors.date}>
                  <input
                    id="booking-date"
                    name="date"
                    type="date"
                    value={values.date}
                    onChange={set("date")}
                    aria-invalid={invalid("date")}
                    aria-describedby={describedBy("date")}
                    className={cn(FIELD, "h-11 cursor-pointer [color-scheme:dark]", !values.date && "text-[var(--crema)]/50", errors.date ? FIELD_ERR : FIELD_LINE)}
                  />
                </Field>

                <Field id="booking-time" label="Hora preferida" optional>
                  <input
                    id="booking-time"
                    name="time"
                    type="text"
                    maxLength={30}
                    value={values.time}
                    onChange={set("time")}
                    placeholder="Ej. 3:00 PM o en la tarde"
                    className={cn(FIELD, "h-11", FIELD_LINE)}
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
                      className={cn(FIELD, "min-h-24 resize-y py-3 leading-relaxed", FIELD_LINE)}
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
                      "mt-0.5 grid h-5 w-5 shrink-0 cursor-pointer place-items-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--face)]",
                      consent ? "bg-[var(--face)] text-[var(--dorado-noche)]" : "bg-transparent text-transparent",
                      errors.consent ? FIELD_ERR : consent ? "" : FIELD_LINE,
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                  <label htmlFor="booking-consent" className="cursor-pointer text-[13px] leading-relaxed text-[var(--crema)]/70" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) return; e.preventDefault(); toggleConsent() }}>
                    Autorizo el tratamiento de mis datos personales conforme a la{" "}
                    <Link href="/privacidad" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--crema)] underline underline-offset-2 hover:text-[var(--face)]">
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
                className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 bg-[var(--face)] text-[12.5px] font-medium uppercase tracking-[0.16em] text-[var(--dorado-noche)] transition-colors duration-200 hover:bg-[var(--crema)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--face)] active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Agendar por WhatsApp
              </button>

              <p role="status" aria-live="polite" className="mt-3 text-center text-[12px] leading-snug text-[var(--crema)]/65">
                {link ? (
                  <>
                    Abrimos WhatsApp con tu solicitud.{" "}
                    <a href={link} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--crema)]/35 underline-offset-4 hover:text-[var(--crema)] hover:decoration-[var(--crema)]">
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

          {/* ── Contact information ── */}
          <Reveal delay={220}>
            <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--crema)]">Información de contacto</h3>
            <div className="space-y-3">
              <InfoRow icon={<MapPin className="h-5 w-5" strokeWidth={1.5} />} label="Dirección">
                <p className="font-medium">{VENUES.spa.address}</p>
                <p className="text-sm text-[var(--crema)]/65">{VENUES.spa.region}</p>
              </InfoRow>
              <InfoRow icon={<Clock className="h-5 w-5" strokeWidth={1.5} />} label="Horario">
                <p className="font-medium">{VENUES.spa.hours[0]}</p>
                <p className="text-sm text-[var(--crema)]/65">{VENUES.spa.hours[1]}</p>
              </InfoRow>
              <InfoRow icon={<WhatsAppIcon className="h-5 w-5" />} label="WhatsApp">
                <a href={WA_SPA} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-[var(--face)] hover:underline">
                  {BUSINESS.phoneDisplay}
                </a>
                <p className="text-sm text-[var(--crema)]/65">Respondemos lo antes posible</p>
              </InfoRow>
              <InfoRow icon={<InstagramIcon className="h-5 w-5" />} label="Síguenos">
                <a href={BUSINESS.instagramUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-[var(--face)] hover:underline">
                  {BUSINESS.instagram}
                </a>
              </InfoRow>
            </div>

            {/* The name of the house, closing the column (like "Laura Martínez Bodas · Wedding Planner" on the reference) */}
            <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${LINE}` }}>
              <p className="flex items-center gap-2.5 font-display text-2xl font-bold tracking-[-0.01em] text-[var(--crema)] md:text-3xl">
                <CalendarHeart aria-hidden className="h-6 w-6 text-[var(--face)]" strokeWidth={1.5} />
                Queens Spa
              </p>
              <p className="mt-1.5 text-sm text-[var(--crema)]/65">Spa de uñas | Palmira, Valle del Cauca</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
