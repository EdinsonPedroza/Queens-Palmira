"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown, MessageCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_VISIT } from "@/lib/whatsapp"

export function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const slide = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 1s ${delay}s ease, transform 1s ${delay}s cubic-bezier(0.16,1,0.3,1)`,
  })

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-black"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.08)",
          transition: "opacity 2s ease, transform 6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <Image
          src="/images/herofondo.png"
          alt="Cosméticos premium Queens"
          fill
          sizes="100vw"
          priority
          className="object-cover"
          style={{ objectPosition: "center center" }}
        />
        {/* Soft overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.15) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(0,0,0,1))",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 md:px-10 pt-24 pb-16">
        <div className="w-full max-w-2xl">
          <div style={slide(0.2)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)] bg-black/60 backdrop-blur px-4 py-1.5 mb-6">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.2em] text-[var(--gold)] uppercase">
                Cosmética Premium · Palmira
              </span>
            </div>
          </div>

          <div style={slide(0.35)}>
            <h1
              className="font-display leading-[1.05] mb-6"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              <span className="block text-white font-medium">La belleza</span>
              <span className="block font-semibold text-queens-gradient">
                que mereces
              </span>
            </h1>
          </div>

          <div style={slide(0.5)}>
            <p className="max-w-lg text-base md:text-lg leading-relaxed text-white/80 mb-10 font-body">
              Cosméticos premium seleccionados para ti. Maquillaje, skincare,
              esmaltes y línea capilar en Local 128, Unicentro Palmira.
            </p>
          </div>

          <div style={slide(0.65)}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="default" size="lg">
                <a href="#catalogo">
                  <ShoppingBag className="h-5 w-5" />
                  Ver catálogo
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white">
                <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Escríbenos
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#catalogo"
        aria-label="Ver catálogo"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/60 hover:text-[var(--gold)] transition"
      >
        <ChevronDown className="h-8 w-8 animate-bounce" />
      </a>
    </section>
  )
}
