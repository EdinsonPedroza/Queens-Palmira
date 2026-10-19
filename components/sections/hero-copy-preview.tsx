"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { VENUES } from "@/lib/site"
import { WA_VISIT } from "@/lib/whatsapp"

/* TEMPORARY preview (noindex): the same cover photo with the copy in five different places, so the client can
 * pick one. Desktop only (lg+); under lg the page shows the real hero. When one is chosen, move its classes into
 * `cosmetics-hero.tsx` and delete this file and `app/cosmetics/portadas`. */

type Variant = "actual" | "derecha" | "centrado" | "dividido" | "piso"

const OPTIONS: { id: Variant; name: string; note: string }[] = [
  { id: "actual", name: "Actual", note: "Bloque a la izquierda dentro de la mitad derecha, centrado en vertical." },
  { id: "derecha", name: "A la derecha", note: "Todo alineado al borde derecho: el texto se apoya en el margen de la página." },
  { id: "centrado", name: "Centrado", note: "El bloque queda centrado en el espacio libre a la derecha de los productos." },
  { id: "dividido", name: "Dividido", note: "El título arriba y el párrafo con los botones abajo, a la altura del piso de los productos." },
  { id: "piso", name: "Al piso", note: "Todo el bloque baja y se apoya en la misma línea que los productos; arriba queda aire." },
]

const TITLE = "font-display uppercase leading-[0.88] tracking-[-0.025em] text-ink whitespace-nowrap"

function Title({ size = "text-[clamp(2.1rem,4.4vw,5.75rem)]" }: { size?: string }) {
  return (
    <h2 className={cn(TITLE, size)} style={{ lineHeight: 0.88 }}>
      <span className="block font-bold">La belleza</span>
      <span className="block font-bold">
        <span className="bg-clip-text text-transparent [background-image:linear-gradient(90deg,var(--ink),var(--face))]">que </span>
        <span className="text-[var(--face)]">mereces.</span>
      </span>
    </h2>
  )
}

function Eyebrow({ right, center }: { right?: boolean; center?: boolean }) {
  return (
    <p
      className={cn(
        "mb-[1.5vw] flex items-center gap-3 text-[clamp(10px,0.82vw,13px)] font-bold uppercase tracking-[0.32em] text-[color-mix(in_oklab,var(--face-deep)_68%,var(--ink))]",
        right && "flex-row-reverse",
        center && "justify-center",
      )}
    >
      <span className="h-px w-[3vw] bg-current opacity-60" />
      Queens Cosmetics
    </p>
  )
}

function Lead({ className }: { className?: string }) {
  return (
    <p className={cn("text-[clamp(0.95rem,1.22vw,1.375rem)] leading-[1.5] text-ink/70", className)}>
      Maquillaje, skincare, esmaltes y línea capilar. Marcas originales, asesoría y envíos al instante.
    </p>
  )
}

function Actions({ justify = "start" }: { justify?: "start" | "end" | "center" }) {
  return (
    <div
      className={cn(
        "flex flex-nowrap items-center gap-x-[2vw]",
        justify === "end" && "justify-end",
        justify === "center" && "justify-center",
      )}
    >
      <a
        href="#catalogo"
        className="inline-block bg-[var(--face)] px-[3vw] py-[1.15vw] text-[clamp(10px,1.05vw,14px)] font-bold uppercase tracking-[0.14em] text-[var(--ink)] transition-colors duration-200 hover:bg-[var(--face-deep)] hover:text-[var(--crema)]"
      >
        Ver catálogo
      </a>
      <a
        href={WA_VISIT}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[clamp(0.9rem,1.15vw,1.2rem)] font-semibold text-ink/75 underline decoration-[var(--face-deep)]/50 underline-offset-[6px] hover:text-ink"
      >
        Escríbenos
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  )
}

function Copy({ variant }: { variant: Variant }) {
  switch (variant) {
    case "actual":
      return (
        <div className="absolute right-[8.5vw] top-1/2 z-20 w-[30vw] -translate-y-[calc(44%+0.53vw)]">
          <Eyebrow />
          <Title />
          <Lead className="mt-[1.3vw]" />
          <div className="mt-[1.7vw]">
            <Actions />
          </div>
        </div>
      )
    case "derecha":
      return (
        <div className="absolute right-[5vw] top-1/2 z-20 w-[30vw] -translate-y-[calc(44%+0.53vw)] text-right">
          <Eyebrow right />
          <div className="flex justify-end">
            <Title />
          </div>
          <Lead className="ml-auto mt-[1.3vw] max-w-[26vw]" />
          <div className="mt-[1.7vw]">
            <Actions justify="end" />
          </div>
        </div>
      )
    case "centrado":
      return (
        <div className="absolute left-[60vw] top-1/2 z-20 w-[36vw] -translate-y-[calc(44%+0.53vw)] text-center">
          <Eyebrow center />
          <div className="flex justify-center">
            <Title />
          </div>
          <Lead className="mx-auto mt-[1.3vw] max-w-[28vw]" />
          <div className="mt-[1.7vw]">
            <Actions justify="center" />
          </div>
        </div>
      )
    case "dividido":
      return (
        <>
          <div className="absolute right-[8.5vw] top-[13%] z-20 w-[32vw]">
            <Eyebrow />
            <Title size="text-[clamp(2.3rem,5vw,6.5rem)]" />
          </div>
          <div className="absolute bottom-[22%] right-[8.5vw] z-20 w-[30vw]">
            <Lead />
            <div className="mt-[1.7vw]">
              <Actions />
            </div>
          </div>
        </>
      )
    case "piso":
      return (
        <div className="absolute bottom-[19%] right-[8.5vw] z-20 w-[30vw]">
          <Eyebrow />
          <Title />
          <Lead className="mt-[1.3vw]" />
          <div className="mt-[1.7vw]">
            <Actions />
          </div>
        </div>
      )
  }
}

export function HeroCopyPreview() {
  const [variant, setVariant] = useState<Variant>("actual")
  const current = OPTIONS.find((o) => o.id === variant)!

  return (
    <div className="hidden lg:block">
      {/* Same box proportions as the real hero (~2.03:1), same photo, same scale */}
      <section id="hero" className="relative mt-[var(--header-h)] aspect-[2.03/1] w-full overflow-hidden bg-white">
        <div aria-hidden className="absolute inset-0">
          <picture className="contents">
            <source
              srcSet="/images/cosmetics/hero-portada-1920.webp 1920w, /images/cosmetics/hero-portada-2880.webp 2880w, /images/cosmetics/hero-portada-3878.webp 3878w"
              sizes="120vw"
            />
            <img
              src="/images/cosmetics/hero-portada-2880.webp"
              alt=""
              className="absolute inset-0 h-full w-full origin-[0%_31%] scale-[1.03] object-cover object-[0%_50%] xl:scale-[1.04]"
            />
          </picture>
        </div>
        <Copy variant={variant} />
        <div
          className="absolute bottom-[1.6vw] left-[5vw] z-20 flex flex-row items-center gap-x-[2.4vw] text-[clamp(9px,0.72vw,11px)] font-semibold uppercase tracking-[0.26em] text-ink/90"
        >
          <span>{VENUES.cosmetics.address}</span>
          <span>{VENUES.cosmetics.hoursShort}</span>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--face-light)] bg-[var(--crema)]/95 px-6 py-3 backdrop-blur" data-testid="hero-copy-switcher">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setVariant(o.id)}
                aria-pressed={variant === o.id}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors",
                  variant === o.id ? "bg-[var(--ink)] text-[var(--crema)]" : "bg-[var(--face-light)]/60 text-[var(--ink)] hover:bg-[var(--face-light)]",
                )}
              >
                {o.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">{current.note}</p>
        </div>
      </div>
    </div>
  )
}
