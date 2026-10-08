"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { m, type Variants } from "framer-motion"
import { ArrowUpRight, Clock, MapPin, Navigation } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps, type Venue } from "@/lib/site"

const Map = dynamic(
  () => import("@/components/map-react-leaflet").then((m) => m.MapReactLeaflet),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-black/5" /> },
)

/*
 * What sits under the portal: where each personality actually is. They are two
 * separate venues — the store inside Unicentro, the spa on Carrera 25 — so one
 * map carries both pins, and each venue gets its own card with the same rows
 * (where, when, whether you need an appointment) so the two read side by side.
 */

const EASE = [0.16, 1, 0.3, 1] as const

const rise: Variants = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({ y: "0%", transition: { duration: 0.95, delay: i * 0.1, ease: EASE } }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: EASE } }),
}

const VENUE_LIST: Venue[] = [VENUES.cosmetics, VENUES.spa]

const CARDS = [
  { venue: VENUES.cosmetics, theme: "light" as const, testId: "location-cosmetics", learnMore: "Conocer la tienda" },
  { venue: VENUES.spa, theme: "noir" as const, testId: "location-spa", learnMore: "Conocer el spa" },
]

export function Locations() {
  return (
    <section id="ubicaciones" aria-labelledby="ubicaciones-title" className="relative scroll-mt-20 bg-white">
      {/* ── Header ── */}
      <m.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-6 pt-20 pb-12 text-center md:px-10 md:pt-28 md:pb-16"
      >
        <m.p
          variants={fadeUp}
          className="mb-5 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold-deep)]"
        >
          <span className="h-px w-10 bg-[var(--gold-deep)]/50" />
          Dónde encontrarnos
          <span className="h-px w-10 bg-[var(--gold-deep)]/50" />
        </m.p>
        <h2
          id="ubicaciones-title"
          className="font-display uppercase leading-[0.9] tracking-[-0.04em] text-ink"
          style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <m.span variants={rise} custom={0} className="block font-light">
              Dos casas,
            </m.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <m.span variants={rise} custom={1} className="block font-bold text-queens-gradient">
              una reina.
            </m.span>
          </span>
        </h2>
      </m.div>

      {/* ── Map on the left, one card per venue on the right ── */}
      <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          {/* One map, both pins. Absolutely filled so it stretches to the height of
              the cards instead of dictating it. */}
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative isolate h-[clamp(300px,70vw,380px)] w-full overflow-hidden rounded-3xl shadow-xl lg:h-auto lg:min-h-[460px]"
          >
            <div className="absolute inset-0">
              <Map venues={VENUE_LIST} />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[500] rounded-3xl"
              style={{ boxShadow: "inset 0 0 0 2px oklch(0.75 0.135 85 / 0.30)" }}
            />
            {/* Legend: one chip per venue, in its pin color */}
            <div className="absolute bottom-4 left-4 z-[600] flex flex-wrap gap-2">
              {VENUE_LIST.map((v) => (
                <span
                  key={v.href}
                  className="flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-white px-3.5 py-2 shadow-lg"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: v.accent }} />
                  <span className="text-xs font-semibold text-[var(--ink)]">{v.name}</span>
                </span>
              ))}
            </div>
          </m.div>

          <div className="flex flex-col gap-4 lg:gap-5">
            {CARDS.map((card, i) => (
              <VenueCard key={card.venue.href} {...card} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** One labelled row: icon, a small caption saying what it is, then the value. */
function InfoRow({
  icon,
  label,
  isNoir,
  accent,
  children,
}: {
  icon: React.ReactNode
  label: string
  isNoir: boolean
  accent: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${accent}1f`, color: accent }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <dt className={cn("text-[10px] font-semibold uppercase tracking-[0.22em]", isNoir ? "text-white/45" : "text-ink/45")}>
          {label}
        </dt>
        <dd className={cn("mt-1", isNoir ? "text-white" : "text-ink")}>{children}</dd>
      </div>
    </div>
  )
}

function VenueCard({
  venue,
  theme,
  testId,
  learnMore,
  index,
}: {
  venue: Venue
  theme: "light" | "noir"
  testId: string
  learnMore: string
  index: number
}) {
  const isNoir = theme === "noir"
  // The gold in `accent` is too pale to read as text on the light card
  const iconAccent = isNoir ? venue.accent : "#c48a1a"

  return (
    <m.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      data-testid={testId}
      className={cn(
        "relative flex-1 overflow-hidden rounded-3xl border p-6 md:p-8",
        isNoir
          ? "border-white/10 bg-noir text-white"
          : "border-[oklch(0.84_0.065_15/0.4)] bg-[linear-gradient(180deg,oklch(0.97_0.015_15)_0%,white_100%)] text-ink",
      )}
    >
      {isNoir && <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />}

      <div className="relative">
        {/* Who, and the one thing to know before coming */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h3 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight md:text-[1.7rem]">
            <span aria-hidden className="h-3 w-3 rounded-full" style={{ background: venue.accent }} />
            {venue.name}
          </h3>
          <span
            className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: iconAccent, borderColor: `${iconAccent}66` }}
          >
            {venue.note}
          </span>
        </div>

        {/* Where and when */}
        <dl className={cn("mt-6 grid gap-5 border-t pt-6", isNoir ? "border-white/10" : "border-ink/10")}>
          <InfoRow icon={<MapPin className="h-5 w-5" />} label="Dirección" isNoir={isNoir} accent={iconAccent}>
            <span className="block font-display text-lg font-semibold leading-snug md:text-xl">{venue.address}</span>
            <span className={cn("block text-sm", isNoir ? "text-white/55" : "text-ink/55")}>{venue.region}</span>
          </InfoRow>

          <InfoRow icon={<Clock className="h-5 w-5" />} label="Horario" isNoir={isNoir} accent={iconAccent}>
            {venue.hours.map((line) => (
              <span key={line} className="block text-base leading-snug">
                {line}
              </span>
            ))}
          </InfoRow>
        </dl>

        {/* What to do next */}
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={venue.gmaps}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: isNoir ? "gold" : "default", size: "default" })}
          >
            <Navigation className="h-4 w-4" />
            Cómo llegar
          </a>
          <Link
            href={venue.href}
            {...faceLinkProps(venue.href)}
            data-testid={`${testId}-enter`}
            className={cn(
              "group inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-[6px] outline-none hover:underline focus-visible:ring-2",
              isNoir
                ? "text-white/80 decoration-[var(--gold)] hover:text-white focus-visible:ring-[var(--gold)]"
                : "text-ink/75 decoration-[var(--rose-hot)] hover:text-ink focus-visible:ring-[var(--rose-hot)]",
            )}
          >
            {learnMore}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </m.article>
  )
}
