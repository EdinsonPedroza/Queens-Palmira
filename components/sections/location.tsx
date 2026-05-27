"use client"

import dynamic from "next/dynamic"
import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { MapPin, Clock, Phone, Instagram, MessageCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_VISIT } from "@/lib/whatsapp"

const Map = dynamic(
  () => import("@/components/map-react-leaflet").then(m => m.MapReactLeaflet),
  { ssr: false, loading: () => <div className="h-full w-full bg-[oklch(0.95_0.01_15)]" /> }
)

const GMAPS_LINK = "https://maps.app.goo.gl/PKAKSgb6rRDPwBvUA"

const INFO_CARDS = [
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Dirección",
    lines: ["Local 128, Unicentro Palmira", "Valle del Cauca, Colombia"],
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Horario",
    lines: ["Lunes a Domingo", "10:00 AM – 8:00 PM"],
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Contacto",
    lines: ["WhatsApp: +57 314 867 7230"],
  },
  {
    icon: <Instagram className="h-5 w-5" />,
    title: "Síguenos",
    lines: ["@queenscosmeticss"],
    href: "https://www.instagram.com/queenscosmeticss/",
  },
]

export function Location() {
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

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
      style={{ background: "oklch(0.97 0.008 15)" }}
    >
      {/* Fondo animado — líneas diagonales */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
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
        <motion.div
          className="absolute -left-32 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.84 0.065 15 / 0.18) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbe de glow dorado */}
        <motion.div
          className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, oklch(0.75 0.135 85 / 0.12) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">

        {/* Header con slide brutal */}
        <motion.div
          style={{ x: titleX, opacity: titleOpacity }}
          className="mb-14 md:mb-20"
        >
          <motion.span
            className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-[var(--gold-deep)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Visítanos
          </motion.span>

          <div className="overflow-hidden">
            <motion.h2
              className="font-display font-bold text-[var(--ink)]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Nuestra tienda en{" "}
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
                Unicentro Palmira
              </em>
            </motion.h2>
          </div>

          <motion.p
            className="mt-4 max-w-lg text-[var(--muted-foreground)] text-base md:text-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Ven y vive la experiencia Queens en persona. Te esperamos con un
            espacio pensado para consentirte.
          </motion.p>
        </motion.div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-8 lg:gap-14 items-start">

          {/* ── MAPA ── */}
          <motion.div
            ref={mapRef}
            style={{ scale: springMapScale, y: springMapY }}
            className="relative"
          >

            {/* Etiqueta "Queens Store" flotante */}
            <motion.div
              className="absolute -top-5 left-6 z-20 flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-white px-4 py-2 shadow-lg"
              initial={{ opacity: 0, y: 16, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--rose-hot)] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--rose-hot)]" />
              </span>
              <span className="text-xs font-semibold text-[var(--ink)]">Queens Cosmetics · Local 128</span>
            </motion.div>

            {/* react-leaflet map */}
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ height: "clamp(340px, 45vw, 520px)" }}
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
                style={{ boxShadow: "inset 0 0 0 2px oklch(0.75 0.135 85 / 0.30)" }}
              />
              <Map />
            </motion.div>

            {/* Botón "Ver en Maps" */}
            <motion.a
              href={GMAPS_LINK}
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
            </motion.a>
          </motion.div>

          {/* ── INFO CARDS ── */}
          <div className="flex flex-col gap-4 pt-6 lg:pt-0">
            {INFO_CARDS.map((card, i) => (
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
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Button asChild variant="whatsapp" size="lg" className="w-full relative overflow-hidden">
                  <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
                    {/* Shimmer on hover */}
                    <motion.span
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
                    Confirmar disponibilidad
                  </a>
                </Button>
              </motion.div>
            </motion.div>
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
  card: (typeof INFO_CARDS)[number]
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
    <motion.div
      ref={ref}
      className="group relative flex gap-4 overflow-hidden rounded-2xl border bg-white p-5 cursor-pointer"
      style={{
        borderColor: isHovered ? "var(--gold)" : "oklch(0.84 0.065 15 / 0.4)",
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
          : "0 2px 12px -4px oklch(0.18 0.025 40 / 0.06)",
        borderColor: isHovered ? "var(--gold)" : "oklch(0.84 0.065 15 / 0.4)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={() => { onLeave(); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Shimmer de fondo al hover */}
      <motion.div
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
          <motion.div
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
      <motion.div
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[var(--gold-deep)]"
        style={{
          background: "linear-gradient(135deg, var(--rose-pastel-soft) 0%, oklch(0.88 0.07 85) 100%)",
        }}
        animate={{
          scale: isHovered ? 1.15 : 1,
          rotate: isHovered ? [0, -6, 6, 0] : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {card.icon}
      </motion.div>

      <div className="relative min-w-0">
        <motion.h3
          className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)]"
          animate={{ x: isHovered ? 3 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {card.title}
        </motion.h3>
        {card.lines.map((l, j) => (
          <motion.p
            key={j}
            className="text-sm text-[var(--ink)]"
            animate={{ x: isHovered ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: j * 0.03 }}
          >
            {l}
          </motion.p>
        ))}
      </div>
    </motion.div>
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
