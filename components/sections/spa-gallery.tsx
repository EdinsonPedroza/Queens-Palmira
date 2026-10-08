"use client"

import Image from "next/image"
import { m, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

/* Bento in black and white — each frame finds its color when you look closer. */
const FRAMES = [
  {
    src: "/images/spa/massage-bw.webp",
    alt: "Masaje relajante en Queens Spa",
    label: "Masajes",
    className: "col-span-2 row-span-2 aspect-square md:aspect-auto",
    overlay: "Respira.",
  },
  { src: "/images/spa/facial.webp", alt: "Tratamiento facial", label: "Faciales", className: "aspect-square md:aspect-auto" },
  { src: "/images/spa/stones.webp", alt: "Masaje con piedras calientes", label: "Piedras calientes", className: "aspect-square md:aspect-auto" },
  { src: "/images/spa/mask.webp", alt: "Mascarilla facial", label: "Mascarillas", className: "aspect-square md:aspect-auto" },
  { src: "/images/spa/oil.webp", alt: "Aceites esenciales", label: "Aromaterapia", className: "aspect-square md:aspect-auto" },
]

const EASE = [0.16, 1, 0.3, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: EASE } }),
}

export function SpaGallery() {
  return (
    <section
      id="galeria-spa"
      aria-labelledby="galeria-spa-title"
      className="relative scroll-mt-6 overflow-hidden bg-noir-soft py-24 text-white md:scroll-mt-0 md:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <m.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <m.p
              variants={fadeUp}
              className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]"
            >
              <span className="h-px w-10 bg-[var(--gold)]/60" />
              Galería
            </m.p>
            <m.h2
              id="galeria-spa-title"
              variants={fadeUp}
              custom={1}
              className="font-display uppercase leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
            >
              <span className="font-light">El </span>
              <span className="font-bold shimmer-gold">espacio.</span>
            </m.h2>
          </div>
          <m.p variants={fadeUp} custom={2} className="max-w-sm text-sm leading-relaxed text-white/55 md:text-base">
            Luz baja, aromas suaves y manos que saben. Así se siente bajar el ritmo en la Cra 25.
          </m.p>
        </m.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[220px] md:gap-4">
          {FRAMES.map((frame, i) => (
            <m.figure
              key={frame.src}
              initial={{ opacity: 0, y: 40, clipPath: "inset(18% 0 0 0)" }}
              whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
              className={cn("group relative overflow-hidden rounded-[var(--radius)] bg-noir", frame.className)}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                className="object-cover grayscale contrast-[1.15] brightness-[0.8] transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:grayscale-0 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-6">
                <span className="font-display text-lg font-semibold uppercase tracking-tight md:text-2xl">{frame.label}</span>
                <span className="font-display text-xs font-semibold text-[var(--gold)]">0{i + 1}</span>
              </figcaption>
              {frame.overlay && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-3 font-display font-bold uppercase leading-none tracking-[-0.05em] text-white/90 mix-blend-overlay md:left-6 md:top-4"
                  style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
                >
                  {frame.overlay}
                </span>
              )}
            </m.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
