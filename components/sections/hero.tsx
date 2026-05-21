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
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.28em] text-[var(--gold-deep)] uppercase">
            <span className="inline-block h-px w-5 bg-[var(--gold-deep)]/50" />
            Cosmética Premium · Palmira
            <span className="inline-block h-px w-5 bg-[var(--gold-deep)]/50" />
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
          className="flex justify-center px-8 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full max-w-[200px] bg-white rounded-3xl">
            <Image
              src="/images/PORTADA.png"
              alt="Queens Cosmetics — colección de maquillaje premium"
              width={400}
              height={533}
              priority
              quality={100}
              sizes="200px"
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>
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
        <div className="relative w-1/2 flex items-center justify-center bg-white overflow-hidden">

          {/* Imagen contenida */}
          <motion.div
            className="relative z-10 px-8 py-12"
            style={{ scale: imgScale, width: "100%", maxWidth: 380 }}
          >
            <Image
              src="/images/PORTADA.png"
              alt="Queens Cosmetics — colección de maquillaje premium"
              width={680}
              height={906}
              priority
              quality={100}
              sizes="(max-width: 1280px) 32vw, 380px"
              className="w-full h-auto object-contain mix-blend-multiply drop-shadow-xl"
            />
          </motion.div>

          {/* Fade hacia el texto */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(255,255,255,0.7) 0%, transparent 20%)",
            }}
          />

          {/* Badge flotante */}
          <motion.div
            className="absolute bottom-10 right-8 z-30 flex flex-col items-end gap-0.5"
            initial={{ opacity: 0, x: 12 }}
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
