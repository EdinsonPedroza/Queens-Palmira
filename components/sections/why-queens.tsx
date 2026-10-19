"use client"

import { useRef } from "react"
import Image from "next/image"
import { m, useInView } from "framer-motion"

const FEATURES = [
  {
    number: "01",
    title: "100% Originales",
    desc: "Marcas auténticas y distribuidores autorizados. Sin réplicas, sin riesgos.",
    accent: "Garantía total",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Asesoría Personalizada",
    desc: "Te guiamos hacia el tono y producto ideal para tu tipo de piel.",
    accent: "Para cada piel",
    img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Envíos el Mismo Día",
    desc: "En Palmira y todo el Valle del Cauca. Rápido, seguro y sin complicaciones.",
    accent: "Palmira y Valle",
    img: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=600&q=80&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Muestras Gratis",
    desc: "En tu primera compra incluimos muestras de nuestros productos más pedidos.",
    accent: "Primera compra",
    img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80&auto=format&fit=crop",
  },
  {
    number: "05",
    title: "Pagos Seguros",
    desc: "Nequi, Daviplata, transferencia o efectivo. Como tú prefieras pagar.",
    accent: "Todos los métodos",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80&auto=format&fit=crop",
  },
]

export function WhyQueens() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} id="por-que" className="relative py-16 md:py-20 bg-white overflow-hidden">

      {/* Fondo sutil */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 65% 50% at 75% 30%, color-mix(in oklab, var(--face-light) 12%, transparent), transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* Header compacto */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <m.span
              className="block text-[11px] font-bold tracking-[0.3em] uppercase mb-2"
              style={{ color: "var(--face-deep)" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              Por qué elegir Queens
            </m.span>
            <m.h2
              className="font-display font-semibold text-ink"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.15 }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Más que cosméticos,{" "}
              <span className="text-queens-gradient">una experiencia</span>
            </m.h2>
          </div>

          <m.p
            className="text-sm max-w-xs"
            style={{ color: "oklch(0.46 0.055 324)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Cada detalle pensado para que vivas la belleza sin preocupaciones.
          </m.p>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.number} feature={f} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: typeof FEATURES[0]
  index: number
  inView: boolean
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white cursor-default"
      style={{
        boxShadow: "0 1px 4px oklch(0.325 0.073 323.9 / 6%), 0 0 0 1px color-mix(in oklab, var(--face-light) 30%, transparent)",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 16px 40px -8px color-mix(in oklab, var(--face) 20%, transparent), 0 0 0 1.5px color-mix(in oklab, var(--face) 30%, transparent)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 4px oklch(0.325 0.073 323.9 / 6%), 0 0 0 1px color-mix(in oklab, var(--face-light) 30%, transparent)"
      }}
    >
      {/* Imagen */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-b from-[var(--face-soft)] to-[var(--face-light)]/20">
        <Image
          src={feature.img}
          alt={feature.title}
          fill
          // capped: five cards inside max-w-7xl stop growing past ~1440px (255px drawn, 275 with the hover zoom)
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, min(20vw, 275px)"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
        />
        {/* Overlay degradado */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.5) 100%)" }}
        />
        {/* Número sobre imagen */}
        <span
          className="absolute top-3 right-3 font-display font-black leading-none select-none"
          style={{
            fontSize: "2rem",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 2px 12px rgba(70,38,73,0.25)",
            letterSpacing: "-0.04em",
          }}
          aria-hidden
        >
          {feature.number}
        </span>
      </div>

      {/* Texto */}
      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-4 gap-2">
        <h3
          className="font-display font-semibold leading-snug"
          style={{ fontSize: "0.92rem", color: "var(--ink)" }}
        >
          {feature.title}
        </h3>
        <p
          className="leading-relaxed flex-1"
          style={{ fontSize: "0.78rem", color: "oklch(0.46 0.055 324)" }}
        >
          {feature.desc}
        </p>

        {/* Accent */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-px flex-1" style={{ background: "color-mix(in oklab, var(--face-light) 50%, transparent)" }} />
          <span
            className="text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
            style={{ color: "var(--face-deep)" }}
          >
            {feature.accent}
          </span>
        </div>
      </div>
    </m.div>
  )
}
