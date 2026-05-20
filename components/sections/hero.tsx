"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, MessageCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_VISIT } from "@/lib/whatsapp"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.4, ease: "easeOut" },
  },
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  const textContent = (
    <motion.div
      className="w-full max-w-xl"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <div className="mb-5">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-[var(--gold)]/70 uppercase">
            Cosmética Premium · Palmira
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h1
          className="font-display leading-[1.05] mb-6"
          style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", letterSpacing: "-0.03em" }}
        >
          <motion.span className="block text-[#2C1810] font-medium" variants={fadeIn}>
            La belleza
          </motion.span>
          <motion.span className="block font-semibold text-queens-gradient" variants={fadeIn}>
            que mereces
          </motion.span>
        </h1>
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="max-w-md text-xs md:text-sm leading-relaxed text-[#2C1810]/60 mb-10 font-body"
      >
        Cosméticos premium seleccionados para ti. Maquillaje, skincare,
        esmaltes y línea capilar en Local 128, Unicentro Palmira.
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button asChild variant="default" size="lg">
            <a href="#catalogo">
              <ShoppingBag className="h-5 w-5" />
              Ver catálogo
            </a>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent text-[#2C1810] border-[#2C1810]/30 hover:bg-[#2C1810]/10 hover:text-[#2C1810]"
          >
            <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Escríbenos
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )

  return (
    <section ref={ref} id="hero" className="bg-white">

      {/* ── MOBILE: texto + imagen apilados ── */}
      <div className="md:hidden flex flex-col min-h-[100svh]">
        <div className="pt-24 pb-8 px-6 flex items-center flex-1">
          {textContent}
        </div>
        <motion.div
          className="relative mx-4 mb-6 rounded-3xl overflow-hidden"
          style={{ height: "46svh" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/images/PORTADA.png"
            alt="Queens Cosmetics — colección de maquillaje premium"
            fill
            sizes="100vw"
            priority
            quality={95}
            className="object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 40%)",
            }}
          />
        </motion.div>
      </div>

      {/* ── DESKTOP: split editorial ── */}
      <div className="hidden md:flex min-h-[100svh] overflow-hidden">

        {/* Left — texto */}
        <motion.div
          className="relative z-10 flex w-1/2 items-center px-12 lg:px-20 xl:px-28 pt-24 pb-20"
          style={{ y: textY }}
        >
          {textContent}
        </motion.div>

        {/* Right — PORTADA */}
        <div className="relative w-1/2 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            <Image
              src="/images/PORTADA.png"
              alt="Queens Cosmetics — colección de maquillaje premium"
              fill
              sizes="50vw"
              priority
              quality={100}
              className="object-cover object-center"
            />
          </motion.div>

          {/* Fade suave hacia el lado del texto */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 18%, transparent 38%)",
            }}
          />

          {/* Brillo sutil inferior */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 100%)",
            }}
          />

          {/* Badge flotante premium */}
          <motion.div
            className="absolute bottom-10 right-8 z-20 flex flex-col items-end gap-1"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-[var(--gold-deep)]/70">
              Local 128
            </span>
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-[#2C1810]/40">
              Unicentro Palmira
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.a
          href="#catalogo"
          aria-label="Ver catálogo"
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[#2C1810]/40 hover:text-[var(--gold)] transition-colors"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </motion.a>
      </div>

    </section>
  )
}
