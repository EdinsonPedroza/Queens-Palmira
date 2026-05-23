"use client"

import { useRef } from "react"
import Image from "next/image"
import { m, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { ChevronDown, MessageCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_VISIT } from "@/lib/whatsapp"

export function Hero() {
  const ref       = useRef<HTMLElement>(null)
  const rightRef  = useRef<HTMLDivElement>(null)

  /* ── Scroll parallax ── */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const textY      = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const imgScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"])
  const imgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const imgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.5])

  /* ── Mouse parallax en imagen ── */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]),  { stiffness: 70, damping: 18 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]),  { stiffness: 70, damping: 18 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }
  const onMouseLeave = () => { mx.set(0); my.set(0) }

  /* ── Bloque de texto (compartido mobile/desktop) ── */
  const textBlock = (
    <div className="w-full max-w-2xl">

      {/* Eyebrow — desliza desde la izquierda */}
      <m.div
        className="mb-4"
        initial={{ opacity: 0, x: -36 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.28em] text-[var(--gold-deep)] uppercase">
          <m.span
            className="inline-block h-px bg-[oklch(0.60_0.130_75/60%)]"
            initial={{ width: 0 }} animate={{ width: 20 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />
          Cosmética Premium · Palmira
          <m.span
            className="inline-block h-px bg-[oklch(0.60_0.130_75/60%)]"
            initial={{ width: 0 }} animate={{ width: 20 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />
        </span>
      </m.div>

      {/* Título — clip reveal por línea (efecto "sube del suelo") */}
      <h1
        className="font-display leading-[0.92] mb-5"
        style={{ fontSize: "clamp(3rem, 5.8vw, 5.2rem)", letterSpacing: "-0.03em" }}
      >
        <div className="overflow-hidden">
          <m.span
            className="block text-[#2C1810] font-medium"
            initial={{ y: "110%", rotate: -1 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            La belleza
          </m.span>
        </div>
        <div className="overflow-hidden">
          <m.span
            className="block font-semibold text-queens-gradient"
            initial={{ y: "110%", rotate: 1 }}
            animate={{ y: "0%", rotate: 0 }}
            transition={{ duration: 0.85, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            que mereces
          </m.span>
        </div>
      </h1>

      {/* Descripción */}
      <m.p
        className="max-w-md text-xs md:text-sm leading-relaxed text-[#2C1810]/60 mb-7 font-body"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.88, ease: [0.16, 1, 0.3, 1] }}
      >
        Cosméticos premium seleccionados para ti. Maquillaje, skincare,
        esmaltes y línea capilar en Local 128, Unicentro Palmira.
      </m.p>

      {/* Botones — entran juntos con spring */}
      <m.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <m.div
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 550, damping: 22 }}
        >
          <Button asChild size="lg" className="bg-[var(--gold)] text-white hover:bg-[var(--gold-deep)] border-none shadow-lg">
            <a href="#catalogo">
              <ShoppingBag className="h-5 w-5" />
              Ver catálogo
            </a>
          </Button>
        </m.div>
        <m.div
          whileHover={{ scale: 1.06, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 550, damping: 22 }}
        >
          <Button asChild variant="outline" size="lg" className="bg-transparent text-[#2C1810] border-[#2C1810]/30 hover:bg-[#2C1810]/10 hover:text-[#2C1810]">
            <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Escríbenos
            </a>
          </Button>
        </m.div>
      </m.div>
    </div>
  )

  return (
    <section ref={ref} id="hero" className="bg-white">

      {/* ════ MOBILE ════ */}
      <div className="md:hidden flex flex-col min-h-[100svh]">
        <div className="pt-24 pb-8 px-6 flex items-center flex-1">
          {textBlock}
        </div>

        {/* Imagen mobile — entra + flota */}
        <m.div
          className="flex justify-center px-8 mb-8"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <m.div
            className="relative w-full max-w-[320px]"
            animate={{ y: [0, -12, 0], rotate: [0, 0.5, -0.5, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/PORTADA.png"
              alt="Queens Cosmetics — colección de maquillaje premium"
              width={600} height={800}
              priority quality={100} sizes="320px"
              className="w-full h-auto object-contain mix-blend-multiply"
              style={{
                maskImage: "radial-gradient(ellipse 82% 88% at 50% 50%, black 50%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 82% 88% at 50% 50%, black 50%, transparent 100%)",
              }}
            />
          </m.div>
        </m.div>
      </div>

      {/* ════ DESKTOP ════ */}
      <div className="hidden md:flex min-h-[100svh] overflow-hidden">

        {/* Left — texto con parallax Y */}
        <m.div
          className="relative z-30 flex w-[48%] shrink-0 items-center pl-16 pr-4 lg:pl-24 lg:pr-6 xl:pl-32 pt-25 pb-10"
          style={{ y: textY }}
        >
          {textBlock}
        </m.div>

        {/* Right — imagen con orbs + mouse parallax + float + scroll */}
        <div
          ref={rightRef}
          className="relative flex-1 flex items-center justify-start bg-white"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* Orb rosa — flota lento */}
          <m.div
            className="pointer-events-none absolute top-[18%] right-[12%] h-80 w-80 rounded-full blur-3xl"
            style={{ background: "oklch(0.84 0.065 15 / 24%)" }}
            animate={{ scale: [1, 1.28, 1], x: [0, 26, 0], y: [0, -18, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          {/* Orb dorado — flota opuesto */}
          <m.div
            className="pointer-events-none absolute bottom-[18%] right-[28%] h-60 w-60 rounded-full blur-3xl"
            style={{ background: "oklch(0.75 0.135 85 / 18%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 16, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
            aria-hidden
          />
          {/* Orb pequeño accent */}
          <m.div
            className="pointer-events-none absolute top-[55%] right-[8%] h-36 w-36 rounded-full blur-2xl"
            style={{ background: "oklch(0.70 0.195 355 / 12%)" }}
            animate={{ scale: [1, 1.4, 1], y: [0, -22, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            aria-hidden
          />

          {/* Scroll Y + scale + opacity */}
          <m.div
            className="relative z-10 -ml-73 mt-11"
            style={{ y: imgScrollY, scale: imgScale, opacity: imgOpacity, width: "125%", maxWidth: 1250 }}
          >
            {/* Perspectiva de mouse */}
            <m.div style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }}>
              {/* Float loop */}
              <m.div
                animate={{ y: [0, -20, 0], rotate: [0, 0.5, -0.5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Entrada — desliza desde la derecha con leve rotación */}
                <m.div
                  initial={{ x: 120, opacity: 0, scale: 0.86, rotate: 4 }}
                  animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 1.15, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="/images/PORTADA.png"
                    alt="Queens Cosmetics — colección de maquillaje premium"
                    width={1200} height={1500}
                    priority quality={100}
                    sizes="(max-width: 1280px) 65vw, 980px"
                    className="w-full h-auto object-contain mix-blend-multiply"
                    style={{
                      maskImage: "radial-gradient(ellipse 80% 88% at 50% 50%, black 50%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 80% 88% at 50% 50%, black 50%, transparent 100%)",
                    }}
                  />
                </m.div>
              </m.div>
            </m.div>
          </m.div>

          {/* Fade izquierda */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(255,255,255,0.85) 0%, transparent 22%)" }}
          />

          {/* Badge flotante — spring bounce */}
          <m.div
            className="absolute bottom-10 right-10 z-30 flex flex-col items-end gap-0.5"
            initial={{ opacity: 0, x: 24, scale: 0.75 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20, delay: 1.6 }}
          >
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase" style={{ color: "oklch(0.60 0.130 75 / 70%)" }}>
              Local 128
            </span>
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-[#2C1810]/40">
              Unicentro Palmira
            </span>
          </m.div>
        </div>

        {/* Scroll indicator */}
        <m.a
          href="#catalogo"
          aria-label="Ver catálogo"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[#2C1810]/40 hover:text-[var(--gold)] transition-colors"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.8 }}
        >
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-8 w-8" />
          </m.div>
        </m.a>
      </div>
    </section>
  )
}
