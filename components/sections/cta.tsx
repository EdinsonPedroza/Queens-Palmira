"use client"

import { useRef } from "react"
import { m, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_ADVICE } from "@/lib/whatsapp"

const WORDS = ["¿Lista", "para", "encontrar", "tu", "próximo", "favorito?"]

function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 350, damping: 25 })
  const y = useSpring(my, { stiffness: 350, damping: 25 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  const reset = () => { mx.set(0); my.set(0) }

  return (
    <m.div style={{ x, y }} onMouseMove={handleMouse} onMouseLeave={reset} className="inline-block">
      <Button asChild variant="whatsapp" size="xl" className={className}>
        <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
      </Button>
    </m.div>
  )
}

export function CTA() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-queens-gradient-intense" />

      {/* Animated orbs */}
      {[
        { size: 320, x: "10%", y: "20%", color: "oklch(1 0 0 / 8%)", dur: 8 },
        { size: 220, x: "75%", y: "60%", color: "oklch(0.75 0.135 85 / 20%)", dur: 11 },
        { size: 180, x: "55%", y: "10%", color: "oklch(1 0 0 / 6%)", dur: 7 },
        { size: 260, x: "20%", y: "70%", color: "oklch(0.75 0.135 85 / 15%)", dur: 13 },
      ].map((orb, i) => (
        <m.div
          key={i}
          className="pointer-events-none absolute rounded-full blur-3xl"
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y, background: orb.color }}
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-6 md:px-10 text-center text-white">
        <m.div
          initial={{ scale: 0, rotate: -180 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <m.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <Sparkles className="h-10 w-10 text-white/80" />
          </m.div>
        </m.div>

        {/* Word-by-word headline */}
        <h2
          className="font-display font-semibold mb-5 leading-tight"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.04em" }}
        >
          {WORDS.map((word, i) => (
            <m.span
              key={i}
              className="inline-block mr-[0.25em]"
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformPerspective: 600 }}
            >
              {word}
            </m.span>
          ))}
        </h2>

        <m.p
          className="mx-auto max-w-xl text-base md:text-lg text-white/85 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Escríbenos por WhatsApp y te asesoramos con los productos perfectos para ti. Local 128, Unicentro Palmira.
        </m.p>

        <m.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton href={WA_ADVICE}>
            <MessageCircle className="h-6 w-6" />
            Asesoría gratis por WhatsApp
          </MagneticButton>

          <m.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button asChild size="xl" className="bg-white text-ink hover:bg-white/90 border-white shadow-xl">
              <a href="#catalogo">Ver catálogo</a>
            </Button>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
