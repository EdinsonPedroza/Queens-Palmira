"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSeen } from "@/hooks/use-seen"

// Photos of the store at Unicentro. `pos` is the object-position focal point:
// the shots are tall phone photos cropped into square-ish tiles.
interface GalleryImage {
  src: string
  pos: string
  alt: string
  span?: string
  caption?: string
  /** The tile is a link: where it goes and the pill label that shows it */
  href?: string
  cta?: string
}

const IMAGES: GalleryImage[] = [
  { src: "/images/cosmetics/store-andres.webp", pos: "50% 0%", alt: "Andrés, de Queens Cosmetics, aplicándose rubor con una brocha rosada", href: "/quienes-somos", cta: "Conoce más de Queens" },
  { src: "/images/cosmetics/store-neon-logo.webp", pos: "50% 34%", alt: "Isotipo de Queens en neón dentro de la tienda" },
  { src: "/images/cosmetics/store-shelves.webp", pos: "62% 42%", alt: "Estantes con maquillaje y skincare de marcas originales" },
  { src: "/images/cosmetics/store-counter.webp", pos: "50% 62%", alt: "Mostrador de la tienda con labiales y accesorios" },
  { src: "/images/cosmetics/store-makeup.webp", pos: "38% 46%", alt: "Estantes de maquillaje junto a la pared lila" },
]

/* Each photo flies in from its own direction (`tile-in` in globals.css reads these as --from-x / --from-y). The photos are visible in the HTML and the entrance is CSS: see hooks/use-seen.ts. */
const DIRS = [
  { x: -60, y: -30 },
  { x: 60,  y: -40 },
  { x: -40, y:  60 },
  { x: 50,  y:  50 },
  { x: -30, y:  40 },
]

/** The portrait that links to /quienes-somos: the photo IS the card (edge to edge), in a column as wide as the photo is, so nothing is cropped or blown up. A pill on it says it is a link. */
function AboutCard({ img, i, inView, mobile = false }: { img: GalleryImage; i: number; inView: boolean; mobile?: boolean }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-[scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:scale-[1.02]",
        tileIn(inView),
        mobile ? "mb-3 aspect-[893/1263] md:hidden" : "hidden md:col-span-1 md:row-span-2 md:block",
      )}
      style={tileStyle(i)}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        style={{ objectPosition: img.pos }}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t from-(--ink)/40 to-transparent" />
      <span className="pointer-events-none absolute bottom-2 left-2 z-20 inline-flex items-center gap-2 rounded-full bg-(--ink) px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-(--crema) shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5">
        {img.cta}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <Link
        href={img.href ?? "/quienes-somos"}
        aria-label={`${img.cta}: ir a Quiénes somos`}
        data-testid={mobile ? "gallery-about-link-mobile" : "gallery-about-link"}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-(--ink)"
      />
    </div>
  )
}

/** Visible until the page is running and the photo is still below the screen (then transparent until its turn); `backwards` keeps it from jumping back when it ends */
const tileIn = (inView: boolean) => (inView ? "motion-safe:animate-[tile-in_900ms_cubic-bezier(0.16,1,0.3,1)_backwards]" : "opacity-0")
const tileStyle = (i: number): React.CSSProperties =>
  ({ "--from-x": `${DIRS[i].x}px`, "--from-y": `${DIRS[i].y}px`, animationDelay: `${i * 120}ms` }) as React.CSSProperties

export function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const inView = useSeen(ref, 80)

  return (
    <section
      ref={ref}
      id="galeria"
      className="relative scroll-mt-[var(--nav-h)] pt-3 md:pt-4 pb-4 md:pb-5 bg-linear-to-b from-(--dorado-soft)/20 to-white overflow-hidden"
    >
      {/* Decorative orb. It breathes forever: a CSS loop (see "AMBIENT LOOPS" in globals.css), still on phones */}
      <div
        className="ambient-breathe ambient-desktop pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full blur-[120px]"
        style={
          {
            background: "color-mix(in oklab, var(--face-light) 18%, transparent)",
            "--breathe-x": 1.2,
            "--amb-dur": "8s",
          } as React.CSSProperties
        }
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-3 md:mb-4 overflow-hidden">
          <span
            className={cn(
              "inline-block text-xs font-semibold tracking-[0.3em] uppercase text-(--face-deep) mb-3",
              inView ? "motion-safe:animate-[reveal-up_600ms_cubic-bezier(0.16,1,0.3,1)_backwards]" : "opacity-0",
            )}
          >
            Conócenos
          </span>

          <div className="overflow-hidden">
            <h2
              className={cn(
                "font-display font-bold text-(--ink)",
                inView ? "motion-safe:animate-[title-rise_800ms_cubic-bezier(0.16,1,0.3,1)_100ms_backwards]" : "opacity-0",
              )}
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              Momentos Queens
            </h2>
          </div>
        </div>

        {/* Phones: the portrait card sits above the grid in normal flow, so its height follows the photo (the grid rows are fixed) */}
        {IMAGES.map((img, i) => img.href && <AboutCard key={i} img={img} i={i} inView={inView} mobile />)}

        <div className="grid grid-cols-2 md:grid-cols-[1.25fr_1fr_1fr] auto-rows-[200px] md:auto-rows-[260px] gap-3 md:gap-4">
          {IMAGES.map((img, i) => img.href ? (
            <AboutCard key={i} img={img} i={i} inView={inView} />
          ) : (
            <div
              key={i}
              className={cn(
                "group relative overflow-hidden rounded-2xl transition-[scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:z-10 hover:scale-[1.02]",
                tileIn(inView),
                img.span,
              )}
              style={tileStyle(i)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                // capped: the grid lives in max-w-7xl, so past ~1440px the tiles stop growing
                // (~418px each of the three columns; the caps leave room for the hover zoom)
                sizes="(max-width: 768px) 50vw, min(33vw, 430px)"
                style={{ objectPosition: img.pos }}
                className={cn("transition-transform duration-700", "object-cover group-hover:scale-115")}
              />

              {/* Everything below reacts to the TILE being hovered (group-hover). They used to carry
                  their own `whileHover`, but they are stacked on top of each other: the topmost layer
                  took the pointer, so the shade never showed and the caption only appeared if the
                  cursor landed on the caption itself. */}

              {/* shade, so the caption reads over the photo */}
              <div className="absolute inset-0 bg-linear-to-t from-(--ink)/60 via-transparent to-transparent opacity-0 transition-opacity duration-400 ease-in-out group-hover:opacity-100" />

              {/* shimmer on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {img.caption && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-5 text-white opacity-0 transition-[opacity,translate] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-serif italic text-lg">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
