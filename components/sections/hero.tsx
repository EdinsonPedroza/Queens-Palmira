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

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.85, 0.95])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden bg-black"
    >
      {/* Background — parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imgY, scale: imgScale }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
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
      </motion.div>

      {/* Overlay — se oscurece al hacer scroll */}
      <motion.div
        className="absolute inset-0 z-[1]"
        style={{
          opacity: overlayOpacity,
          background: "linear-gradient(to right, rgba(0,0,0,1) 35%, rgba(0,0,0,0.2) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2] h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,1))" }}
      />

      {/* Shimmer particles */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${10 + i * 14}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -30, -60],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.9,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-6 md:px-10 pt-24 pb-28"
        style={{ y: textY }}
      >
        <motion.div
          className="w-full max-w-2xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Label */}
          <motion.div variants={fadeUp}>
            <div className="mb-5">
              <span className="text-[10px] font-semibold tracking-[0.3em] text-[var(--gold)]/70 uppercase">
                Cosmética Premium · Palmira
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp}>
            <h1
              className="font-display leading-[1.05] mb-6"
              style={{
                fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
                letterSpacing: "-0.03em",
              }}
            >
              <motion.span
                className="block text-white font-medium"
                variants={fadeIn}
              >
                La belleza
              </motion.span>
              <motion.span
                className="block font-semibold text-queens-gradient"
                variants={fadeIn}
              >
                que mereces
              </motion.span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="max-w-md text-xs md:text-sm leading-relaxed text-white/60 mb-10 font-body"
          >
            Cosméticos premium seleccionados para ti. Maquillaje, skincare,
            esmaltes y línea capilar en Local 128, Unicentro Palmira.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3"
          >
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
                className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Escríbenos
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.a
        href="#catalogo"
        aria-label="Ver catálogo"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50 hover:text-[var(--gold)] transition-colors"
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
    </section>
  )
}
