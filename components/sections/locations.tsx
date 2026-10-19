"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { m, type Variants } from "framer-motion"
import { ArrowUpRight, Clock, MapPin, Navigation } from "lucide-react"
import { WhenNear } from "@/components/when-near"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps, type Venue } from "@/lib/site"

const MapPlaceholder = () => <div className="h-full w-full bg-[var(--loc-card)]" />

const Map = dynamic(() => import("@/components/map-react-leaflet").then((m) => m.MapReactLeaflet), { ssr: false, loading: MapPlaceholder })

/*
 * What sits under the portal: where each personality actually is. Two separate venues (the store inside Unicentro, the spa on Carrera 25) on ONE map with both pins
 * (client request: the embed of Google shows a single place, so this is the Leaflet map), dressed like the store's "Visítanos" section: rounded frame, floating place
 * labels, "Abrir en Google Maps" pills, and a card per venue with the same Dirección / Horario rows. Each card wears its own accent (`.face-*`).
 */

const EASE = [0.16, 1, 0.3, 1] as const

const headerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const labelRise: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }
const titleRise: Variants = { hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE } } }
const leadRise: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }

/* The same variables the store's section uses, so the cards look the same. */
const THEME = {
  "--loc-bg": "oklch(0.97 0.02 103)",
  "--loc-card": "oklch(0.995 0.022 106.8)",
  "--loc-border": "color-mix(in oklab, var(--face-light) 40%, transparent)",
  "--loc-text": "var(--ink)",
  "--loc-muted": "var(--muted-foreground)",
  "--loc-accent": "var(--face-deep)",
  "--loc-icon-bg": "linear-gradient(135deg, var(--face-soft) 0%, oklch(0.88 0.051 90) 100%)",
  "--loc-shadow": "0 2px 12px -4px oklch(0.325 0.073 323.9 / 0.06)",
} as React.CSSProperties

const BLOCKS = [
  { venue: VENUES.cosmetics, face: "face-cosmetics", testId: "location-cosmetics", learnMore: "Conocer la tienda", mapLabel: "Tienda en Google Maps" },
  { venue: VENUES.spa, face: "face-spa", testId: "location-spa", learnMore: "Conocer el spa", mapLabel: "Spa en Google Maps" },
]

export function Locations() {
  return (
    <section
      id="ubicaciones"
      aria-labelledby="ubicaciones-title"
      className="relative scroll-mt-20 overflow-hidden py-14 md:py-20"
      style={{ ...THEME, background: "var(--loc-bg)" }}
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Header, like the store's */}
        <m.div
          className="mb-10 md:mb-14"
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <m.span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]" variants={labelRise}>
            Dónde encontrarnos
          </m.span>
          <div className="overflow-hidden">
            <m.h2
              id="ubicaciones-title"
              className="font-display font-bold text-[var(--loc-text)]"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              variants={titleRise}
            >
              Dos casas, una reina.
            </m.h2>
          </div>
          <m.p className="mt-4 max-w-lg text-base text-[var(--loc-muted)] md:text-lg" variants={leadRise}>
            La tienda está dentro de Unicentro y el spa en la Carrera 25: son dos sitios distintos, así que revisa a cuál vas.
          </m.p>
        </m.div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* ONE map, both pins */}
          <m.div
            className="relative mt-4 lg:sticky lg:top-28"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="absolute -top-5 left-6 z-[600] flex flex-wrap gap-2">
              {BLOCKS.map((b) => (
                <div key={b.venue.href} className={cn("flex items-center gap-2 rounded-full border border-[var(--face)]/40 bg-[var(--loc-card)] px-4 py-2 shadow-lg", b.face)}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.venue.accent }} />
                  <span className="text-xs font-semibold text-[var(--loc-text)]">{b.venue.name}</span>
                </div>
              ))}
            </div>

            <div className="relative isolate overflow-hidden rounded-3xl shadow-2xl" style={{ height: "clamp(360px, 46vw, 560px)" }}>
              <WhenNear className="absolute inset-0" fallback={<MapPlaceholder />}>
                <Map venues={BLOCKS.map((b) => b.venue)} />
              </WhenNear>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[500] rounded-3xl"
                style={{ boxShadow: "inset 0 0 0 2px color-mix(in oklab, var(--face-light) 55%, transparent)" }}
              />
            </div>

            <div className="absolute -bottom-5 right-6 z-[600] flex flex-wrap justify-end gap-2">
              {BLOCKS.map((b) => (
                <a
                  key={b.venue.href}
                  href={b.venue.gmaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`${b.testId}-map`}
                  className={cn("flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white shadow-xl transition-colors duration-200 hover:bg-[var(--face)]", b.face)}
                >
                  <Navigation className="h-3.5 w-3.5" />
                  {b.mapLabel}
                </a>
              ))}
            </div>
          </m.div>

          <div className="flex flex-col gap-6 pt-6 lg:pt-0">
            {BLOCKS.map((b, i) => (
              <VenueCard key={b.venue.href} {...b} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <div
      className="group relative flex gap-4 overflow-hidden rounded-2xl border bg-[var(--loc-card)] p-5 transition-[border-color,box-shadow] duration-300 hover:border-[var(--face)] hover:shadow-[0_16px_40px_-8px_color-mix(in_oklab,var(--face)_25%,transparent)]"
      style={{ borderColor: "var(--loc-border)", boxShadow: "var(--loc-shadow)" }}
    >
      <div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[var(--loc-accent)] transition-transform duration-300 group-hover:scale-110"
        style={{ background: "var(--loc-icon-bg)" }}
      >
        {icon}
      </div>
      <div className="relative min-w-0">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--loc-accent)]">{title}</h3>
        {lines.map((l) => (
          <p key={l} className="text-sm text-[var(--loc-text)]">
            {l}
          </p>
        ))}
      </div>
    </div>
  )
}

function VenueCard({ venue, face, testId, learnMore, index }: { venue: Venue; face: string; testId: string; learnMore: string; index: number }) {
  return (
    <m.article
      data-testid={testId}
      className={cn("flex flex-col gap-4", face)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
    >
      <h3 className="flex flex-wrap items-center gap-3 font-display text-xl font-semibold tracking-tight text-[var(--loc-text)] md:text-2xl">
        <span aria-hidden className="h-3 w-3 rounded-full bg-[var(--face)]" />
        {venue.name}
        <span className="rounded-full border border-[color-mix(in_oklab,var(--face)_55%,transparent)] px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--face-deep)]">
          {venue.note}
        </span>
      </h3>
      <InfoCard icon={<MapPin className="h-5 w-5" />} title="Dirección" lines={[venue.address, venue.region]} />
      <InfoCard icon={<Clock className="h-5 w-5" />} title="Horario" lines={venue.hours} />
      <Link
        href={venue.href}
        {...faceLinkProps(venue.href)}
        data-testid={`${testId}-enter`}
        className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--loc-text)]/80 underline decoration-[var(--face)] underline-offset-[6px] outline-none hover:text-[var(--loc-text)] focus-visible:ring-2 focus-visible:ring-[var(--face-deep)]"
      >
        {learnMore}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
      </Link>
    </m.article>
  )
}
