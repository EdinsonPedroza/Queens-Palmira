"use client"

import { useRef, useState } from "react"
import { m, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { MapPin, Clock, Phone, Navigation } from "lucide-react"
import { InstagramIcon } from "@/components/instagram-icon"
import { Button } from "@/components/ui/button"
import { GoogleMap } from "@/components/google-map"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { WhenNear } from "@/components/when-near"
import { WA_SPA, WA_VISIT } from "@/lib/whatsapp"
import { BUSINESS, VENUES } from "@/lib/site"

const MapPlaceholder = () => <div className="h-full w-full bg-[var(--loc-card)]" />

/*
 * Each personality has its own venue, so this section takes one and dresses it:
 * both venues sit on crema; the accent (lila for the store, gold for the spa)
 * comes from --face. The theme is injected as CSS custom properties so the
 * markup below stays single-path.
 */
const THEMES = {
  light: {
    "--loc-bg": "oklch(0.97 0.02 103)",
    "--loc-card": "oklch(0.995 0.022 106.8)",
    "--loc-border": "color-mix(in oklab, var(--face-light) 40%, transparent)",
    "--loc-text": "var(--ink)",
    "--loc-muted": "var(--muted-foreground)",
    "--loc-accent": "var(--face-deep)",
    "--loc-icon-bg": "linear-gradient(135deg, var(--face-soft) 0%, oklch(0.88 0.051 90) 100%)",
    "--loc-shadow": "0 2px 12px -4px oklch(0.325 0.073 323.9 / 0.06)",
  },
} as const

type VenueKey = "cosmetics" | "spa"

const COPY: Record<VenueKey, {
  theme: keyof typeof THEMES
  title: string
  place: string
  lead: string
  cta: { href: string; label: string }
}> = {
  cosmetics: {
    theme: "light",
    title: "Nuestra sede en",
    place: "Unicentro Palmira",
    lead: "Ven y vive la experiencia Queens en persona. Te esperamos con un espacio pensado para consentirte.",
    cta: { href: WA_VISIT, label: "Confirmar disponibilidad" },
  },
  spa: {
    theme: "light",
    title: "Nuestro spa en",
    place: "la Carrera 25",
    lead: "Una casa aparte de la tienda, pensada para consentir tus uñas. Reserva tu cita y te esperamos con todo listo.",
    cta: { href: WA_SPA, label: "Reservar mi cita" },
  },
}

interface InfoCard {
  icon: React.ReactNode
  title: string
  lines: string[]
  href?: string
}

const EASE = [0.16, 1, 0.3, 1] as const

/*
 * The header animates from its wrapper, not element by element. The h2 starts
 * translated a full line below its own box, and that box clips — so if the h2
 * carried its own `whileInView`, it would sit entirely outside the clip rect,
 * report zero intersection, and never be told to animate in. It would stay
 * invisible forever. Driving it from the unclipped wrapper avoids that.
 */
const headerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const labelRise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

const titleRise = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
}

const leadRise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export function Location({ face = "cosmetics" }: { face?: VenueKey }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const copy = COPY[face]
  const venue = VENUES[face]
  const cards: InfoCard[] = [
    { icon: <MapPin className="h-5 w-5" />, title: "Dirección", lines: [venue.address, venue.region] },
    { icon: <Clock className="h-5 w-5" />, title: "Horario", lines: venue.hours },
    { icon: <Phone className="h-5 w-5" />, title: "Contacto", lines: [`WhatsApp: ${BUSINESS.phoneDisplay}`] },
    { icon: <InstagramIcon className="h-5 w-5" />, title: "Síguenos", lines: [BUSINESS.instagram], href: BUSINESS.instagramUrl },
  ]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const mapScale = useTransform(scrollYProgress, [0.1, 0.4], [0.88, 1])
  const mapY = useTransform(scrollYProgress, [0.1, 0.4], ["6%", "0%"])

  const springMapScale = useSpring(mapScale, { stiffness: 80, damping: 20 })
  const springMapY = useSpring(mapY, { stiffness: 80, damping: 20 })

  return (
    <section
      ref={sectionRef}
      id="ubicacion"
      className="relative scroll-mt-[var(--nav-h)] overflow-hidden py-5 md:py-7"
      style={{ ...THEMES[copy.theme], background: "var(--loc-bg)" } as React.CSSProperties}
    >
      {/* Fondo animado — líneas diagonales */}
      <m.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <m.div
            key={i}
            className="absolute h-px w-full origin-left"
            style={{
              top: `${10 + i * 12}%`,
              background:
                i % 2 === 0
                  ? "linear-gradient(90deg, transparent, color-mix(in oklab, var(--face-light) 15%, transparent), transparent)"
                  : "linear-gradient(90deg, transparent, color-mix(in oklab, var(--face) 10%, transparent), transparent)",
              transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* The two glows breathe forever: CSS loops (see "AMBIENT LOOPS" in globals.css), still on phones */}
        {/* Orbe de glow rosa */}
        <div
          className="ambient-breathe ambient-desktop absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full"
          style={
            {
              background: "radial-gradient(circle, color-mix(in oklab, var(--face-light) 20%, transparent) 0%, transparent 70%)",
              "--breathe-x": 1.12,
              "--breathe-from": 0.6,
              "--breathe-to": 1,
              "--amb-dur": "6s",
            } as React.CSSProperties
          }
        />
        {/* Orbe de glow dorado */}
        <div
          className="ambient-breathe ambient-desktop absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full"
          style={
            {
              background: "radial-gradient(circle, color-mix(in oklab, var(--face) 12%, transparent) 0%, transparent 70%)",
              "--breathe-x": 1.18,
              "--breathe-from": 0.5,
              "--breathe-to": 0.9,
              "--amb-dur": "8s",
              "--amb-delay": "2s",
            } as React.CSSProperties
          }
        />
      </m.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">

        {/* Header con slide brutal */}
        <m.div
          className="mb-3 md:mb-4"
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <m.span
            className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--loc-accent)]"
            variants={labelRise}
          >
            Visítanos
          </m.span>

          <div className="overflow-hidden">
            {/* Same look as the catalog's title (client request): one bold line in the ink colour, no italic, no gradient */}
            <m.h2
              className="font-display font-bold text-[var(--loc-text)]"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
              variants={titleRise}
            >
              {copy.title} {copy.place}
            </m.h2>
          </div>

          <m.p className="mt-4 max-w-lg text-[var(--loc-muted)] text-base md:text-lg" variants={leadRise}>
            {copy.lead}
          </m.p>
        </m.div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-[0.9fr_1fr] gap-8 lg:gap-14 items-start">

          {/* ── MAPA ── */}
          <m.div
            style={{ scale: springMapScale, y: springMapY }}
            className="relative mt-4 lg:mt-9"
          >

            {/* Etiqueta flotante */}
            <m.div
              className="absolute -top-5 left-6 z-20 flex items-center gap-2 rounded-full border border-[var(--face)]/40 bg-[var(--loc-card)] px-4 py-2 shadow-lg"
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--face-deep)] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--face-deep)]" />
              </span>
              <span className="text-xs font-semibold text-[var(--loc-text)]">
                {venue.name} · {venue.address}
              </span>
            </m.div>

            {/* react-leaflet map */}
            <m.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ height: "clamp(340px, 44vw, 540px)" }}
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
                style={{ boxShadow: "inset 0 0 0 2px color-mix(in oklab, var(--face) 30%, transparent)" }}
              />
              {/* This section closes the page: Google's map only loads once the visitor is getting close */}
              <WhenNear className="h-full w-full" fallback={<MapPlaceholder />}>
                <GoogleMap venue={venue} />
              </WhenNear>
              {/* The whole map is a link (the client: "apenas le dé clic se abra"): one click opens it in Google Maps. It sits over the embed, so the
                  embedded map itself is a preview that cannot be dragged or zoomed. */}
              <a
                href={venue.gmaps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${venue.name} en Google Maps`}
                data-testid="map-open"
                className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-(--face)"
              />
            </m.div>

            {/* Botón "Ver en Maps" */}
            <m.a
              href={venue.gmaps}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-5 right-6 z-20 flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.06, backgroundColor: "var(--face)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Navigation className="h-3.5 w-3.5" />
              Abrir en Google Maps
            </m.a>
          </m.div>

          {/* ── INFO CARDS ── */}
          <div className="flex flex-col gap-4 pt-6 lg:pt-0">
            {cards.map((card, i) => (
              <MagneticCard
                key={card.title}
                card={card}
                index={i}
                isHovered={hoveredCard === i}
                onHover={() => setHoveredCard(i)}
                onLeave={() => setHoveredCard(null)}
              />
            ))}

            {/* CTA WhatsApp */}
            <m.div
              className="pt-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <m.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Button asChild variant="whatsapp" size="lg" className="w-full relative overflow-hidden">
                  <a href={copy.cta.href} target="_blank" rel="noopener noreferrer">
                    {/* A band of light crossing the button, forever: a CSS loop (see "AMBIENT LOOPS" in
                        globals.css). It is a strip three tiles wide (each tile twice the button, with
                        the band in its middle) that slides two tiles to the left: pixel for pixel what
                        animating `background-position` on a 200% background gave, but `transform`
                        runs on the compositor and `background-position` repaints every frame. */}
                    <span
                      aria-hidden
                      className="ambient-sheen pointer-events-none absolute inset-y-0 left-[-200%] w-[600%]"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, oklch(0.995 0.022 106.8 / 0.15) 50%, transparent 60%)",
                        backgroundSize: "33.3333% 100%",
                      }}
                    />
                    <WhatsAppIcon className="h-5 w-5" />
                    {copy.cta.label}
                  </a>
                </Button>
              </m.div>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Magnetic card con hover 3D ── */
function MagneticCard({
  card,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  card: InfoCard
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * 5,
      y: -((e.clientX - cx) / (rect.width / 2)) * 5,
    })
  }

  const inner = (
    <m.div
      ref={ref}
      className="group relative flex gap-4 overflow-hidden rounded-2xl border bg-[var(--loc-card)] p-5 cursor-pointer"
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: "preserve-3d",
        transformPerspective: 800,
      }}
      initial={{ opacity: 0, x: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      animate={{
        boxShadow: isHovered
          ? "0 16px 40px -8px color-mix(in oklab, var(--face) 25%, transparent), 0 4px 16px -4px color-mix(in oklab, var(--face-light) 20%, transparent)"
          : "var(--loc-shadow)",
        borderColor: isHovered ? "var(--face)" : "var(--loc-border)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={() => { onLeave(); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Shimmer de fondo al hover */}
      <m.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--face-light) 5%, transparent) 0%, color-mix(in oklab, var(--face) 5%, transparent) 100%)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Borde brillante animado */}
      <AnimatePresence>
        {isHovered && (
          <m.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--face) 20%, transparent) 0%, color-mix(in oklab, var(--face-light) 15%, transparent) 100%)",
              padding: "1.5px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Icono con spring */}
      <m.div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[var(--loc-accent)]"
        style={{ background: "var(--loc-icon-bg)" }}
        animate={{ scale: isHovered ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {card.icon}
      </m.div>

      <div className="relative min-w-0">
        <m.h3
          className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--loc-accent)]"
          animate={{ x: isHovered ? 3 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {card.title}
        </m.h3>
        {card.lines.map((l, j) => (
          <m.p
            key={j}
            className="text-sm text-[var(--loc-text)]"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: j * 0.03 }}
          >
            {l}
          </m.p>
        ))}
      </div>
    </m.div>
  )

  if (card.href) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return inner
}
