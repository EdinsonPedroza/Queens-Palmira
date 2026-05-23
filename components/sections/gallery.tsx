"use client"

import { useRef } from "react"
import Image from "next/image"
import { m, useInView } from "framer-motion"

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85&auto=format&fit=crop", alt: "Colección de cosméticos premium", span: "md:col-span-2 md:row-span-2", caption: "Nuestra colección signature" },
  { src: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&q=85&auto=format&fit=crop", alt: "Maquillaje profesional" },
  { src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=85&auto=format&fit=crop", alt: "Brochas y herramientas de belleza" },
  { src: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=85&auto=format&fit=crop", alt: "Rutina de skincare" },
  { src: "https://images.unsplash.com/photo-1583241475880-083f84372725?w=600&q=85&auto=format&fit=crop", alt: "Labiales en exhibición" },
]

const DIRS = [
  { x: -60, y: -30 },
  { x: 60,  y: -40 },
  { x: -40, y:  60 },
  { x: 50,  y:  50 },
  { x: -30, y:  40 },
]

export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      id="galeria"
      className="relative py-20 md:py-28 bg-linear-to-b from-(--rose-pastel)/15 to-white overflow-hidden"
    >
      {/* Decorative orb */}
      <m.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={{ background: "oklch(0.84 0.065 15 / 15%)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-12 overflow-hidden">
          <m.span
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-(--gold-deep) mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Galería
          </m.span>

          <div className="overflow-hidden">
            <m.h2
              className="font-display font-bold text-(--ink)"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
              initial={{ y: 80, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Momentos{" "}
              <em className="font-serif italic font-light text-queens-gradient">Queens</em>
            </m.h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-3 md:gap-4">
          {IMAGES.map((img, i) => (
            <m.div
              key={i}
              className={`group relative overflow-hidden rounded-2xl ${img.span ?? ""}`}
              initial={{ opacity: 0, x: DIRS[i].x, y: DIRS[i].y, scale: 0.88 }}
              animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-115"
              />

              {/* overlay */}
              <m.div
                className="absolute inset-0 bg-linear-to-t from-(--ink)/60 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* shimmer on hover */}
              <m.div
                className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              {img.caption && (
                <m.div
                  className="absolute inset-x-0 bottom-0 p-5 text-white"
                  initial={{ opacity: 0, y: 16 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-serif italic text-lg">{img.caption}</p>
                </m.div>
              )}
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
