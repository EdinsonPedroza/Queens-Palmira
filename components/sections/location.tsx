"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { m, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { MapPin, Clock, Phone, Instagram, MessageCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { WA_SPA, WA_VISIT } from "@/lib/whatsapp"
import { BUSINESS, VENUES } from "@/lib/site"

const Map = dynamic(
  () => import("@/components/map-react-leaflet").then(m => m.MapReactLeaflet),
  { ssr: false, loading: () => <div className="h-full w-full bg-[var(--loc-card)]" /> }
)

/*
 * Each personality has its own venue, so this section takes one and dresses it:
 * light for the store at Unicentro, noir for the spa on Carrera 25. The theme is
 * injected as CSS custom properties so the markup below stays single-path.
 */
const THEMES = {
  light: {
    "--loc-bg": "oklch(0.97 0.008 15)",
    "--loc-card": "oklch(1 0 0)",
    "--loc-border": "oklch(0.84 0.065 15 / 0.4)",
    "--loc-text": "var(--ink)",
    "--loc-muted": "var(--muted-foreground)",
    "--loc-accent": "var(--gold-deep)",
    "--loc-icon-bg": "linear-gradient(135deg, var(--rose-pastel-soft) 0%, oklch(0.88 0.07 85) 100%)",
    "--loc-shadow": "0 2px 12px -4px oklch(0.18 0.025 40 / 0.06)",
  },
  noir: {
    "--loc-bg": "var(--noir)",
    "--loc-card": "var(--noir-soft)",
    "--loc-border": "oklch(1 0 0 / 0.12)",
    "--loc-text": "oklch(1 0 0)",
    "--loc-muted": "oklch(1 0 0 / 0.6)",
    "--loc-accent": "var(--gold)",
    "--loc-icon-bg": "linear-gradient(135deg, oklch(0.75 0.135 85 / 0.22) 0%, oklch(0.75 0.135 85 / 0.08) 100%)",
    "--loc-shadow": "0 2px 12px -4px oklch(0 0 0 / 0.5)",
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
    title: "Nuestra tienda en",
    place: "Unicentro Palmira",
    lead: "Ven y vive la experiencia Queens en persona. Te esperamos con un espacio pensado para consentirte.",
    cta: { href: WA_VISIT, label: "Confirmar disponibilidad" },
  },
  spa: {
    theme: "noir",
    title: "Nuestro spa en",
    place: "la Carrera 25",
    lead: "Una casa aparte de la tienda, pensada solo para bajar el ritmo. Reserva tu ritual y te esperamos con todo listo.",
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
  const isMobile = useIsMobile()

  const copy = COPY[face]
  const venue = VENUES[face]
  const cards: InfoCard[] = [
    { icon: <MapPin className="h-5 w-5" />, title: "Dirección", lines: [venue.address, venue.region] },
    { icon: <Clock className="h-5 w-5" />, title: "Horario", lines: venue.hours },
    { icon: <Phone className="h-5 w-5" />, title: "Contacto", lines: [`WhatsApp: ${BUSINESS.phoneDisplay}`] },
    { icon: <Instagram className="h-5 w-5" />, title: "Síguenos", lines: [BUSINESS.instagram], href: BUSINESS.instagramUrl },
  ]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const titleX = useTransform(scrollYProgress, [0, 0.5], ["-8%", "0%"])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const mapScale = useTransform(scrollYProgress, [0.1, 0.4], [0.88, 1])
  const mapY = useTransform(scrollYProgress, [0.1, 0.4], ["6%", "0%"])

  const springMapScale = useSpring(mapScale, { stiffness: 80, damping: 20 })
  const springMapY = useSpring(mapY, { stiffness: 80, damping: 20 })

  return (
    <section
      ref={sectionRef}
      id="ubicacion"
      className="relative overflow-hidden py-24 md:py-36"
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
                  ? "linear-gradient(90deg, transparent, oklch(0.84 0.065 15 / 0.15), transparent)"
                  : "linear-gradient(90deg, transparent, oklch(0.75 0.135 85 / 0.10), transparent)",
              transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {/* Orbe de glow rosa */}
        <m.div
          className="absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.84 0.065 15 / 0.18) 0%, transparent 70%)",
          }}
          animate={isMobile ? undefined : { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbe de glow dorado */}
        <m.div
          className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.135 85 / 0.12) 0%, transparent 70%)",
          }}
          animate={isMobile ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </m.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">

        {/* Header con slide brutal */}
        <m.div
          style={{ x: titleX, opacity: titleOpacity }}
          className="mb-14 md:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <m.span
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-[var(--loc-accent)]"
            variants={labelRise}
          >
            Visítanos
          </m.span>

          <div className="overflow-hidden">
            <m.h2
              className="font-display font-bold text-[var(--loc-text)]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
              variants={titleRise}
            >
              {copy.title}{" "}
              <br className="hidden md:block" />
              <em
                className="font-serif italic font-light"
                style={{
                  background: "linear-gradient(135deg, var(--rose-pastel) 0%, var(--gold) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {copy.place}
              </em>
            </m.h2>
          </div>

          <m.p className="mt-4 max-w-lg text-[var(--loc-muted)] text-base md:text-lg" variants={leadRise}>
            {copy.lead}
          </m.p>
        </m.div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-14 items-start">

          {/* ── MAPA ── */}
          <m.div
            style={{ scale: springMapScale, y: springMapY }}
            className="relative"
          >

            {/* Etiqueta flotante */}
            <m.div
              className="absolute -top-5 left-6 z-20 flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-[var(--loc-card)] px-4 py-2 shadow-lg"
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--rose-hot)] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--rose-hot)]" />
              </span>
              <span className="text-xs font-semibold text-[var(--loc-text)]">
                {venue.name} · {venue.address}
              </span>
            </m.div>

            {/* react-leaflet map */}
            <m.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ height: "clamp(340px, 45vw, 520px)" }}
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
                style={{ boxShadow: "inset 0 0 0 2px oklch(0.75 0.135 85 / 0.30)" }}
              />
              <Map venue={venue} />
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
              whileHover={{ scale: 1.06, backgroundColor: "oklch(0.75 0.135 85)" }}
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
                    {/* Shimmer on hover */}
                    <m.span
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)",
                        backgroundSize: "200% 100%",
                      }}
                      animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    />
                    <MessageCircle className="h-5 w-5" />
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
          ? "0 16px 40px -8px oklch(0.75 0.135 85 / 0.25), 0 4px 16px -4px oklch(0.84 0.065 15 / 0.20)"
          : "var(--loc-shadow)",
        borderColor: isHovered ? "var(--gold)" : "var(--loc-border)",
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
            "linear-gradient(135deg, oklch(0.84 0.065 15 / 0.05) 0%, oklch(0.75 0.135 85 / 0.05) 100%)",
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
                "linear-gradient(135deg, oklch(0.75 0.135 85 / 0.2) 0%, oklch(0.84 0.065 15 / 0.15) 100%)",
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
        animate={{
          scale: isHovered ? 1.15 : 1,
          rotate: isHovered ? [0, -6, 6, 0] : 0,
        }}
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
