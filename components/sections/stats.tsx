"use client"

import { useEffect, useRef, useState } from "react"
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
  {
    icon: <Star className="h-7 w-7" />,
    value: 5.0,
    decimals: 1,
    label: "Rating promedio",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    value: 500,
    prefix: "+",
    label: "Clientas felices",
  },
  {
    icon: <Package className="h-7 w-7" />,
    value: 50,
    suffix: "+",
    label: "Marcas premium",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    value: 4,
    label: "Años de experiencia",
  },
]

function Counter({ target, decimals = 0 }: { target: number; decimals?: number }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true
            const duration = 1800
            const start = performance.now()
            const step = (now: number) => {
              const p = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              setValue(target * eased)
              if (p < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString("es-CO")}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative py-20 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-queens-gradient transition-all hover:scale-105"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="mb-3 rounded-full bg-white/60 p-3 text-[var(--gold-deep)] shadow-md transition-transform group-hover:rotate-12">
                {stat.icon}
              </div>
              <div className="font-display text-4xl md:text-5xl font-semibold text-ink" style={{ letterSpacing: "-0.03em" }}>
                {stat.prefix}
                <Counter target={stat.value} decimals={stat.decimals} />
                {stat.suffix}
              </div>
              <div className="mt-1 text-xs md:text-sm font-medium uppercase tracking-wider text-[var(--ink)]/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
