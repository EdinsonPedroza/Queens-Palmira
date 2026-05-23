"use client"

import { useEffect, useRef, useState } from "react"
import { m, useInView } from "framer-motion"
import { Sparkles, Heart, Package, Star } from "lucide-react"

interface Stat {
  icon: React.ReactNode
  value: number
  suffix?: string
  prefix?: string
  label: string
  decimals?: number
}

const STATS: Stat[] = [
  { icon: <Star className="h-7 w-7" />, value: 5.0, decimals: 1, label: "Rating promedio" },
  { icon: <Heart className="h-7 w-7" />, value: 500, prefix: "+", label: "Clientas felices" },
  { icon: <Package className="h-7 w-7" />, value: 50, suffix: "+", label: "Marcas premium" },
  { icon: <Sparkles className="h-7 w-7" />, value: 4, label: "Años de experiencia" },
]

function Counter({ target, decimals = 0, run }: { target: number; decimals?: number; run: boolean }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!run || started.current) return
    started.current = true
    const duration = 2000
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(target * eased)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [run, target])

  return <span>{decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString("es-CO")}</span>
}

export function Stats() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-20 md:py-24 bg-white overflow-hidden">
      {/* Subtle background pulse */}
      <m.div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.84 0.065 15 / 8%), transparent)" }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.85 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.06, y: -6 }}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-queens-gradient cursor-pointer overflow-hidden"
            >
              {/* shine sweep on hover */}
              <m.div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />

              <m.div
                className="mb-3 rounded-full bg-white/60 p-3 text-(--gold-deep) shadow-md"
                animate={inView ? { rotate: [0, 0] } : {}}
                whileHover={{ rotate: 15, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                {stat.icon}
              </m.div>

              <div
                className="font-display text-4xl md:text-5xl font-semibold text-ink"
                style={{ letterSpacing: "-0.03em" }}
              >
                {stat.prefix}
                <Counter target={stat.value} decimals={stat.decimals} run={inView} />
                {stat.suffix}
              </div>

              <m.div
                className="mt-1 text-xs md:text-sm font-medium uppercase tracking-wider text-(--ink)/70"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.12 + 0.4, duration: 0.5 }}
              >
                {stat.label}
              </m.div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
