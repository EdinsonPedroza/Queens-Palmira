"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CATALOG_FILTERS_ID } from "@/lib/site"

/*
 * La portada del INICIO (el cliente la eligió el 19 oct 2026, ver CLAUDE.md): la foto de la tienda a pantalla completa entonada en ciruela, el titular grande
 * y las dos puertas del sitio como botones de contorno: «Ver catálogo» (la tienda, que es esta misma página) y «Agenda tu cita» (el spa, /spa#agendar).
 * Empieza bajo la franja de anuncio y el encabezado (`--header-h`), como las demás páginas.
 *
 * El tono de la foto no es solo un velo: filtro de saturación y contraste, un multiply ciruela, resplandores cálidos (ámbar en las lámparas, rosa-lila en el
 * neón) y un degradado ciruela casi negro (`--ink`) que pesa más a la izquierda, donde va el texto. En celular el texto va sobre TODA la foto, así que el
 * degradado es vertical y más fuerte. Los botones llevan un brillo suave y ESTÁTICO (un `box-shadow`, nunca animado): lila vivo para la tienda y dorado para el spa.
 */

const PHOTO = {
  src: "/images/cosmetics/store-interior.webp",
  y: "38%",
  alt: "Interior de la tienda Queens Cosmetics en Unicentro Palmira, con el letrero de neón",
}

const PLUM = (a: number) => `color-mix(in oklab, var(--ink) ${a}%, transparent)`
const FADE = `linear-gradient(90deg, ${PLUM(94)} 0%, ${PLUM(84)} 32%, ${PLUM(40)} 58%, ${PLUM(6)} 85%, transparent 100%), linear-gradient(0deg, ${PLUM(70)} 0%, transparent 36%)`
const FADE_PHONE = `linear-gradient(180deg, ${PLUM(70)} 0%, ${PLUM(90)} 30%, ${PLUM(90)} 72%, ${PLUM(70)} 100%)`
const LIGHTS =
  "radial-gradient(ellipse 22% 14% at 58% 10%, oklch(0.78 0.16 62 / 0.55), transparent 70%), radial-gradient(ellipse 16% 9% at 44% 24%, oklch(0.78 0.16 62 / 0.4), transparent 70%), radial-gradient(ellipse 14% 22% at 66% 40%, oklch(0.72 0.17 340 / 0.45), transparent 70%), radial-gradient(ellipse 24% 30% at 97% 55%, oklch(0.74 0.14 70 / 0.35), transparent 70%)"

const IN = "motion-safe:animate-[reveal-up_900ms_cubic-bezier(0.16,1,0.3,1)_backwards]"

type Tone = "cosmetics" | "spa"
const GLOW: Record<Tone, (a: number) => string> = {
  // the lilac glow is a livelier tint of the logo lila (the plain lila is too muted to read as a glow over the dark photo)
  cosmetics: (a) => `oklch(0.7 0.15 320 / ${Math.min(1, a * 1.35).toFixed(2)})`,
  spa: (a) => `color-mix(in oklab, var(--dorado) ${Math.round(a * 100)}%, transparent)`,
}
const LINE: Record<Tone, string> = {
  cosmetics: "color-mix(in oklab, var(--lila-light) 75%, transparent)",
  spa: "color-mix(in oklab, var(--dorado) 75%, transparent)",
}

const DOORS: { tone: Tone; testId: string; href: string; name: string; label: string }[] = [
  { tone: "cosmetics", testId: "home-door-cosmetics", href: `#${CATALOG_FILTERS_ID}`, name: "Queens Cosmetics", label: "Ver catálogo" },
  { tone: "spa", testId: "home-door-spa", href: "/spa#agendar", name: "Queens Spa", label: "Agenda tu cita" },
]

export function HomeHero() {
  return (
    <section
      id="hero"
      aria-labelledby="home-title"
      className="relative flex min-h-[calc(100svh_-_var(--header-h))] flex-col justify-center overflow-hidden bg-[var(--ink)]"
    >
      <Image
        src={PHOTO.src}
        alt={PHOTO.alt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: `50% ${PHOTO.y}`, filter: "brightness(0.96) saturate(1.35) contrast(1.14)" }}
      />
      <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ background: "color-mix(in oklab, var(--ciruela) 38%, transparent)" }} />
      <div aria-hidden className="absolute inset-0 mix-blend-screen" style={{ background: LIGHTS }} />
      <div aria-hidden className="absolute inset-0 hidden md:block" style={{ background: FADE }} />
      <div aria-hidden className="absolute inset-0 md:hidden" style={{ background: FADE_PHONE }} />

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-16 md:px-12 md:py-14">
        <div className="max-w-4xl">
          <p className={cn("mb-3 text-lg font-medium text-[var(--crema)] md:text-2xl", IN)} style={{ animationDelay: "150ms" }}>
            Hola, somos
          </p>
          <h1
            id="home-title"
            className={cn("font-display font-bold leading-[0.9] tracking-[-0.03em] text-[var(--crema)]", IN)}
            style={{ animationDelay: "250ms", fontSize: "clamp(3.4rem, min(11.5vw, 19svh), 9.5rem)" }}
          >
            Queens.
          </h1>
          <div className={cn("mt-6 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:gap-6", IN)} style={{ animationDelay: "450ms" }}>
            {DOORS.map((d) => (
              <div key={d.testId}>
                <p className="mb-2 text-[12.5px] font-bold uppercase tracking-[0.2em] text-[var(--crema)]/80 md:text-[13px]">{d.name}</p>
                <Link
                  href={d.href}
                  data-testid={d.testId}
                  style={{ boxShadow: `inset 0 0 0 1.5px ${LINE[d.tone]}, 0 0 12px ${GLOW[d.tone](0.18)}, 0 0 28px ${GLOW[d.tone](0.07)}` }}
                  className="group relative inline-flex items-center gap-6 overflow-hidden px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-300 hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--crema)]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-[var(--crema)] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100"
                  />
                  <span className="relative">{d.label}</span>
                  <ArrowUpRight className="relative h-4 w-4" strokeWidth={1.75} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
