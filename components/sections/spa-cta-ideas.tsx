"use client"

/* TEMPORARY preview (noindex, /spa/ideas-cierre): five ways the spa's closing block ("Tus manos te van a dar las gracias.") could look. When the client chooses, build it in
 * `spa-cta.tsx` and delete this file and `app/spa/ideas-cierre`. */

import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { VENUES } from "@/lib/site"
import { WA_SPA } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"

const EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]"
const HAIR = "inset 0 0 0 1px color-mix(in oklab, var(--ink) 12%, transparent)"
const GREEN = "bg-[#25D366] hover:bg-[#1FBF5B]"
const EXT = { target: "_blank", rel: "noopener noreferrer" } as const

function Title({ className, size = "clamp(1.9rem, 4.4vw, 3.4rem)" }: { className?: string; size?: string }) {
  return (
    <h2 className={cn("font-display font-semibold text-[var(--ink)]", className)} style={{ fontSize: size, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
      Tus manos te van a dar las gracias.
    </h2>
  )
}
const Eyebrow = ({ className }: { className?: string }) => <p className={cn("text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)]/80", className)}>Reserva tu cita</p>
const Sub = ({ className }: { className?: string }) => (
  <p className={cn("text-base leading-relaxed text-[var(--ink)]/85 md:text-lg", className)}>
    Escríbenos y cuadramos tu cita. <span className="whitespace-nowrap">{VENUES.spa.address}, Palmira.</span>
  </p>
)

/* 1 · foto a todo el ancho con tarjeta de vidrio */
function PhotoBand() {
  return (
    <section className="relative overflow-hidden py-14 md:py-24">
      <Image src="/images/spa/portada-spa-1857.webp" alt="" fill sizes="100vw" className="object-cover object-[60%_50%]" />
      <div className="relative mx-auto max-w-3xl rounded-[2rem] bg-[color-mix(in_oklab,var(--crema)_84%,transparent)] px-6 py-10 text-center backdrop-blur-md md:px-12 md:py-14" style={{ boxShadow: HAIR }}>
        <Eyebrow className="mb-4" />
        <Title />
        <Sub className="mx-auto mt-5 max-w-xl" />
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={WA_SPA} {...EXT} className={cn("inline-flex h-13 items-center gap-2.5 rounded-full px-8 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition-colors duration-200", GREEN)}>
            <WhatsAppIcon className="h-4 w-4" />Reservar por WhatsApp
          </a>
          <Link href="/" className="inline-flex h-13 items-center gap-2.5 rounded-full px-8 text-xs font-medium uppercase tracking-[0.18em] text-[var(--ink)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--face)_26%,transparent)]" style={{ boxShadow: "inset 0 0 0 1.5px var(--ink)" }}>
            ¿Buscabas la tienda?<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* 2 · dividido: foto a un lado, texto al otro */
function Split() {
  return (
    <section className="bg-[var(--crema)] py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl items-stretch gap-6 px-6 md:grid-cols-2 md:gap-10 md:px-10">
        <div className="relative min-h-[320px] overflow-hidden rounded-3xl md:min-h-[440px]">
          <Image src="/images/spa/hero-manicura-1373.webp" alt="" fill sizes="(min-width: 768px) 600px, 100vw" className={cn("object-cover object-[72%_50%] transition-transform duration-[1400ms] hover:scale-[1.04]", EASE)} />
        </div>
        <div className="flex flex-col justify-center py-4 md:py-8">
          <Eyebrow className="mb-4 text-[var(--face-deep)]" />
          <Title size="clamp(2rem, 4vw, 3.2rem)" />
          <Sub className="mt-5 max-w-md" />
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href={WA_SPA} {...EXT} className="group inline-flex h-13 items-center gap-3 bg-[var(--face-deep)] px-8 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--face)] hover:text-[var(--ink)]">
              <WhatsAppIcon className="h-4 w-4" />Reservar por WhatsApp
            </a>
            <Link href="/" className="group relative inline-flex items-center gap-2 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink)]">
              ¿Buscabas la tienda?<ArrowRight className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", EASE)} strokeWidth={1.5} />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[var(--ink)]/35" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 3 · el mensaje como un chat */
function Chat() {
  return (
    <section className="bg-[var(--face-soft)] py-10 md:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 md:grid-cols-[1.1fr_1fr] md:gap-14 md:px-10">
        <div>
          <Eyebrow className="mb-4 text-[var(--face-deep)]" />
          <Title size="clamp(2rem, 4.2vw, 3.4rem)" />
          <Sub className="mt-5 max-w-md" />
          <Link href="/" className="group mt-7 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink)]">
            ¿Buscabas la tienda?<ArrowUpRight className={cn("h-4 w-4 transition-transform duration-300 group-hover:rotate-45", EASE)} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-[var(--crema)] shadow-[0_26px_50px_-30px_color-mix(in_oklab,var(--ink)_50%,transparent)]" style={{ boxShadow: HAIR }}>
          <div className="flex items-center gap-3 bg-[var(--face)] px-5 py-3.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--crema)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/isotipo-dorado-deep.webp" alt="" width={556} height={803} className="h-6 w-auto" />
            </span>
            <span><span className="block font-display text-lg font-bold leading-tight">Queens Spa</span><span className="block text-[12px] text-[var(--ink)]/80">en línea · responde pronto</span></span>
          </div>
          <div className="space-y-2 bg-[color-mix(in_oklab,var(--face)_12%,var(--crema))] px-4 py-6">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-[var(--crema)] px-4 py-2.5 text-[14.5px]" style={{ boxShadow: HAIR }}>¡Hola, reina! ¿Qué te gustaría hacerte hoy?</div>
            <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-[color-mix(in_oklab,#25D366_28%,var(--crema))] px-4 py-2.5 text-[14.5px]">
              Hola Queens Spa! Quiero reservar una cita, ¿qué horarios tienen disponibles?
              <span className="mt-1 flex items-center justify-end gap-0.5 text-[11px] text-[var(--ink)]/60"><Check className="h-3 w-3" /><Check className="-ml-1.5 h-3 w-3" /></span>
            </div>
          </div>
          <div className="p-4">
            <a href={WA_SPA} {...EXT} className={cn("flex h-13 w-full items-center justify-center gap-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink)] transition-colors duration-200", GREEN)}>
              <WhatsAppIcon className="h-4 w-4" />Enviar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 4 · tipografía grande y botón circular */
function BigType() {
  return (
    <section className="bg-[var(--crema)] py-14 text-center md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Eyebrow className="mb-5 text-[var(--face-deep)]" />
        <h2 className="font-display font-semibold text-[var(--ink)]" style={{ fontSize: "clamp(2.6rem, 8vw, 6.2rem)", lineHeight: 0.95, letterSpacing: "-0.035em" }}>
          Tus manos<br />te van a dar<br />las gracias.
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          <a href={WA_SPA} {...EXT} aria-label="Reservar por WhatsApp" className={cn("group grid h-32 w-32 place-items-center rounded-full text-[var(--ink)] shadow-[0_20px_36px_-18px_color-mix(in_oklab,#25D366_80%,black)] transition-[transform,background-color] duration-300 hover:scale-105 active:scale-[0.97]", GREEN, EASE)}>
            <span className="flex flex-col items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <WhatsAppIcon className="h-6 w-6" />Reservar
            </span>
          </a>
          <div className="text-left">
            <Sub className="max-w-xs text-[15px]" />
            <Link href="/" className="group relative mt-4 inline-flex items-center gap-2 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--ink)]">
              ¿Buscabas la tienda?<ArrowUpRight className={cn("h-4 w-4 transition-transform duration-300 group-hover:rotate-45", EASE)} strokeWidth={1.5} />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[var(--ink)]/30" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--face-deep)] transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* 5 · dos puertas grandes */
function Tile({ href, ext, className, children }: { href: string; ext?: boolean; className?: string; children: ReactNode }) {
  const props = ext ? EXT : {}
  const cls = cn("group relative flex min-h-[190px] flex-col justify-between rounded-3xl p-6 text-[var(--ink)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_color-mix(in_oklab,var(--ink)_50%,transparent)] md:p-8", EASE, className)
  return ext ? <a href={href} {...props} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>
}
function Doors() {
  return (
    <section className="bg-[var(--face-soft)] py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8 text-center"><Eyebrow className="mb-4 text-[var(--face-deep)]" /><Title /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <Tile href={WA_SPA} ext className="bg-[#25D366]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--crema)]"><WhatsAppIcon className="h-6 w-6" /></span>
            <span>
              <span className="block font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]">Reservar por WhatsApp</span>
              <span className="mt-1 block text-sm text-[var(--ink)]/80">Escríbenos y cuadramos tu cita.</span>
            </span>
            <ArrowUpRight aria-hidden className={cn("absolute right-6 top-6 h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1", EASE)} strokeWidth={1.5} />
          </Tile>
          <Tile href="/" className="bg-[var(--crema)]">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-[var(--face-deep)]">La tienda</span>
            <span>
              <span className="block font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]">¿Buscabas la tienda?</span>
              <span className="mt-1 block text-sm text-[var(--ink)]/80">Queens Cosmetics · Unicentro Palmira.</span>
            </span>
            <ArrowUpRight aria-hidden className={cn("absolute right-6 top-6 h-6 w-6 text-[var(--ink)]/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1", EASE)} strokeWidth={1.5} />
          </Tile>
        </div>
      </div>
    </section>
  )
}

const IDEAS: { id: string; title: string; note: string; node: () => ReactNode }[] = [
  { id: "1", title: "1 · Foto y vidrio", note: "La foto panorámica a todo el ancho y el mensaje en una tarjeta de vidrio, como el hero. Botones en píldora: WhatsApp verde y la tienda con contorno.", node: () => <PhotoBand /> },
  { id: "2", title: "2 · Dividido", note: "Foto de las manos a un lado y el texto en crema al otro. Botón dorado oscuro cuadrado y la tienda como enlace con flecha que se corre.", node: () => <Split /> },
  { id: "3", title: "3 · Chat", note: "El cierre como una conversación de WhatsApp con el mensaje ya escrito y un botón verde «Enviar por WhatsApp». Explica lo que pasa al tocar.", node: () => <Chat /> },
  { id: "4", title: "4 · Tipografía grande", note: "Sin caja: el título enorme en tres líneas y un botón circular verde que crece al pasar el cursor. La tienda, como enlace con línea que se dibuja.", node: () => <BigType /> },
  { id: "5", title: "5 · Dos puertas", note: "Dos tarjetas grandes lado a lado: WhatsApp en verde y la tienda en crema, cada una con su flecha. Quien llega elige a dónde ir.", node: () => <Doors /> },
]

export function SpaCtaIdeas() {
  const [id, setId] = useState("1")
  const idea = IDEAS.find((i) => i.id === id) ?? IDEAS[0]
  return (
    <>
      <div className="sticky top-0 z-40 bg-[var(--crema)]/95 backdrop-blur" style={{ boxShadow: HAIR }}>
        <div className="mx-auto max-w-7xl px-6 py-3 md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista previa · bloque de cierre</p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist">
            {IDEAS.map((i) => (
              <button key={i.id} type="button" role="tab" aria-selected={i.id === id} onClick={() => setId(i.id)}
                className={cn("shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors", i.id === id ? "bg-[var(--face)] text-[var(--ink)]" : "text-[var(--ink)]/75 hover:bg-[color-mix(in_oklab,var(--face)_20%,transparent)]")}
                style={{ boxShadow: i.id === id ? "inset 0 0 0 1.5px var(--ink)" : HAIR }}>{i.title}</button>
            ))}
          </div>
          <p className="mt-2 max-w-3xl text-[12.5px] leading-snug text-[var(--ink)]/80">{idea.note}</p>
        </div>
      </div>
      <div key={id}>{idea.node()}</div>
    </>
  )
}
