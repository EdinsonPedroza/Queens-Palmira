"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { preload } from "react-dom"
import { IntroPlayer, INTRO_LOGO_SRC } from "@/components/intro/intro-player"
import { INTRO_VERSION_LIST, type IntroVersion, type IntroVersionId } from "@/components/intro/intro-versions"
import { cn } from "@/lib/utils"

const BTN =
  "inline-flex h-9 items-center justify-center px-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors"
const BTN_LINE = cn(
  BTN,
  "text-[var(--ink)] ring-1 ring-[color-mix(in_oklab,var(--ink)_30%,transparent)] hover:bg-[var(--ink)] hover:text-[var(--crema)]",
)
const BTN_SOLID = cn(BTN, "bg-[var(--ink)] text-[var(--crema)] hover:bg-[var(--ciruela)]")

const seconds = (v: IntroVersion) => `${((v.exitAt + v.exitMs) / 1000).toFixed(1).replace(".", ",")} s`

/* What is under the intro in a frame: a miniature of the portal (two crema halves with their arches), so the exit shows what it opens onto. */
function PortalMock() {
  return (
    <div aria-hidden className="absolute inset-0 bg-[var(--crema)] [container-type:inline-size]">
      <div className="absolute bottom-0 left-[9%] h-[78%] w-[24%] rounded-t-full bg-[var(--lila-soft)]" />
      <div className="absolute bottom-0 right-[9%] h-[78%] w-[24%] rounded-t-full bg-[color-mix(in_oklab,var(--dorado-soft)_30%,var(--crema))]" />
      <p className="absolute right-[53%] top-[46%] font-display text-[4.2cqw] font-bold leading-none text-[var(--lila)]">QUEENS</p>
      <p className="absolute left-[53%] top-[46%] font-display text-[4.2cqw] font-bold leading-none text-[var(--dorado)]">QUEENS</p>
    </div>
  )
}

function IntroTile({ version, index, recommended, onFull }: { version: IntroVersion; index: number; recommended?: string; onFull: (id: IntroVersionId) => void }) {
  const frame = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(() => {
    setRun((r) => r + 1)
    setPlaying(true)
  }, [])

  // Plays once by itself the first time it is on screen; "Repetir" does the rest.
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        play()
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [play])

  return (
    <article data-testid={`intro-version-${version.id}`} className="flex flex-col">
      <div ref={frame} className="relative aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-[var(--lila-light)]">
        <PortalMock />
        {playing && <IntroPlayer key={run} id={version.id} contained onDone={() => setPlaying(false)} />}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h2 className="text-xl md:text-2xl">
          <span className="mr-2 text-[var(--lila-deep)]">{index}.</span>
          {version.name}
        </h2>
        <span className="shrink-0 text-xs tracking-[0.12em] text-[var(--muted-foreground)]">{seconds(version)}</span>
      </div>
      {recommended && (
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--lila-deep)]">{recommended}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{version.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={BTN_LINE} onClick={play} data-testid={`intro-replay-${version.id}`}>
          Repetir
        </button>
        <button type="button" className={BTN_LINE} onClick={() => onFull(version.id)} data-testid={`intro-full-${version.id}`}>
          Pantalla completa
        </button>
        <Link href={`/?intro=${version.id}`} prefetch={false} className={BTN_SOLID} data-testid={`intro-portal-${version.id}`}>
          En el portal
        </Link>
      </div>
    </article>
  )
}

/* The one that is live today, for comparison: gold next to lila. */
function CurrentTile() {
  return (
    <article data-testid="intro-version-actual" className="flex flex-col">
      <div className="relative grid aspect-[16/10] grid-cols-2 overflow-hidden rounded-lg ring-1 ring-[var(--lila-light)]">
        <div className="bg-[var(--lila)]" />
        <div className="bg-[var(--dorado)]" />
        <Image
          src="/images/brand/isotipo-crema.webp"
          alt=""
          width={556}
          height={803}
          unoptimized
          className="absolute left-1/2 top-[46%] h-[48%] w-auto -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h2 className="text-xl md:text-2xl">
          <span className="mr-2 text-[var(--lila-deep)]">0.</span>
          Actual
        </h2>
        <span className="shrink-0 text-xs tracking-[0.12em] text-[var(--muted-foreground)]">3,2 s</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
        La que está hoy en el sitio: dos cortinas, lila y dorado, con el logo crema. Es la del dorado junto al lila que no convenció.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/?intro=actual" prefetch={false} className={BTN_SOLID} data-testid="intro-portal-actual">
          En el portal
        </Link>
      </div>
    </article>
  )
}

export function IntroVersionsPreview() {
  const [full, setFull] = useState<IntroVersionId | null>(null)

  // The logo is the same file for every version: ask for it once, up front.
  preload(INTRO_LOGO_SRC, { as: "image", crossOrigin: "anonymous" })

  return (
    <>
      <p className="mx-auto mt-2 max-w-2xl px-6 text-center text-sm text-[var(--muted-foreground)]">
        Cinco versiones solo con las dos combinaciones del logo: lila sobre crema y crema sobre lila. Cada una se reproduce sola al llegar a ella;
        “Pantalla completa” la muestra a tamaño real (clic para cerrarla) y “En el portal” la deja entrar a la página de verdad.
        Ninguna está aplicada en el sitio todavía.
      </p>
      <div className="mx-auto mt-10 grid max-w-6xl gap-x-8 gap-y-14 px-6 md:grid-cols-2">
        <CurrentTile />
        {INTRO_VERSION_LIST.map((v, i) => (
          <IntroTile
            key={v.id}
            version={v}
            index={i + 1}
            recommended={v.id === "dos-caras" ? "Mi recomendada" : v.id === "minima" ? "La que más cuida la venta" : undefined}
            onFull={setFull}
          />
        ))}
      </div>
      {full && <IntroPlayer key={full} id={full} onDone={() => setFull(null)} onClick={() => setFull(null)} />}
    </>
  )
}
