"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUpRight,
  CalendarHeart,
  Check,
  Gift,
  Heart,
  MapPin,
  ShieldCheck,
  Smile,
  Sparkles,
} from "lucide-react"
import { Reveal } from "@/components/reveal"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps } from "@/lib/site"
import { WA_ADVICE } from "@/lib/whatsapp"

/*
 * "Quiénes somos", in the language of the store and the spa (client request): the header is its own bar under the strip and the page starts below it,
 * flat and square pieces with fine lines, small spaced-capitals eyebrows, one-colour titles, square near-black buttons and compact spacing. It stays the warm page:
 * the three shop photos are still left on the table like snapshots (white mat and a caption), now straight instead of tilted. Every claim comes from facts already on
 * the site (originals, advice, samples, exchanges, appointments); there is no founding story, year or name here until the client supplies one.
 * Every entrance is CSS (the hero's `hero-fade-up` / `hero-rise`, the rest `<Reveal>`): Framer's `initial`+`animate` blinked each block for a frame when it ended and, on an iPad, left the title and the buttons invisible (see CLAUDE.md).
 */

/* Fine lines, like the store's controls and the cart's: the `* { border-color }` rule of globals.css beats the utilities (see CLAUDE.md), so the colour goes inline. */
const HAIRLINE = "color-mix(in oklab, var(--ink) 12%, transparent)"
/** Cards drawn as one box whose cells are split by 1 px gaps (the gap shows the box's own colour), so the lines are right at every breakpoint.
 * The cell itself is static (white, with the hover); only what is INSIDE it is revealed, or the unrevealed cells would show the line colour as a solid block. */
const CELLS = "grid gap-px p-px bg-[color-mix(in_oklab,var(--ink)_12%,transparent)]"

/* ── Shop photos are real; the spa one is still a placeholder (plus: the team and the clients) ── */
const SNAPSHOTS = [
  {
    src: "/images/cosmetics/store-makeup.webp",
    caption: "Te asesoramos con calma",
    pos: "38% 46%",
    className: "mt-8 md:mt-12",
  },
  {
    src: "/images/cosmetics/store-neon-logo.webp",
    caption: "Pasa, estás en casa",
    pos: "50% 36%",
    className: "",
  },
  {
    src: "/images/cosmetics/store-counter.webp",
    caption: "Tu color favorito",
    pos: "50% 60%",
    className: "mt-4 md:mt-24",
  },
]

const VALUES = [
  {
    icon: Heart,
    title: "Cercanía",
    text: "Aquí no eres una venta más. Te saludamos, te escuchamos y te atendemos sin afán.",
  },
  {
    icon: ShieldCheck,
    title: "Honestidad",
    text: "Productos 100% originales y una recomendación sincera, aunque eso signifique llevarte menos.",
  },
  {
    icon: Sparkles,
    title: "Asesoría de verdad",
    text: "Te ayudamos con el tono, la rutina o lo que busques, sin costo y sin compromiso.",
  },
  {
    icon: Smile,
    title: "Cuidado con cariño",
    text: "Queremos que salgas sintiéndote bien, con ganas de volver y de contarle a una amiga.",
  },
]

const STEPS = [
  { title: "Llegas y te saludamos", text: "Sin presiones. Mira, prueba, pregunta lo que quieras." },
  { title: "Te escuchamos primero", text: "Antes de recomendarte algo, queremos entender qué necesitas." },
  { title: "Te decimos la verdad", text: "Lo que de verdad te sirve, con sus pros y sus contras." },
  { title: "Vuelves cuando quieras", text: "Para cambiar algo, resolver una duda o simplemente a saludar." },
]

const PROMISES = [
  { icon: ShieldCheck, text: "Productos 100% originales, de distribuidores autorizados" },
  { icon: Gift, text: "Muestras de regalo en tu primera compra" },
  { icon: Check, text: "Cambios dentro de los 7 días si no lo has usado" },
  { icon: CalendarHeart, text: "En el spa, cita previa para atenderte con todo el tiempo" },
]

const HOUSES = [
  {
    venue: VENUES.cosmetics,
    eyebrow: "La tienda",
    text: "Maquillaje, skincare y cuidado capilar. Pasa, prueba y te asesoramos.",
    image: "/images/cosmetics/store-interior.webp" as string | null,
    alt: "Interior de la tienda de Queens en Unicentro Palmira",
    cover: true,
    pos: "50% 47%",
    tone: "lila" as const,
  },
  {
    venue: VENUES.spa,
    eyebrow: "El spa",
    text: "Manicure, pedicure y uñas de diseño. Con cita previa.",
    // placeholder nail photo (Pexels): swap for the spa's own work when it arrives
    image: "/images/spa/nails-gold.webp" as string | null,
    alt: "Uñas con diseño sobre satín dorado en Queens Spa",
    cover: true,
    pos: "50% 36%",
    tone: "gold" as const,
  },
]

/** The store's section header: spaced-capitals eyebrow and a one-colour title. */
function SectionHeader({ id, eyebrow, title, text, center }: { id: string; eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <Reveal className={cn("mb-4 md:mb-5", center ? "mx-auto max-w-2xl text-center" : "max-w-2xl")}>
      <span className="mb-2.5 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">{eyebrow}</span>
      <h2
        id={id}
        className="font-display font-semibold text-ink"
        style={{ fontSize: "clamp(1.8rem, 3.8vw, 2.8rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
      >
        {title}
      </h2>
      {text && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/70 md:text-base">{text}</p>}
    </Reveal>
  )
}

/** A square box with an icon, outlined with a fine ring; it fills with ink when its card is hovered. */
function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center text-[var(--face-deep)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_22%,transparent)] transition-[background-color,color,box-shadow] duration-300 group-hover:bg-ink group-hover:text-[var(--face)] group-hover:shadow-[inset_0_0_0_1px_var(--ink)]">
      {children}
    </span>
  )
}

export function About() {
  return (
    <>
      {/* ═════ Hero ═════ */}
      <section
        id="hero"
        aria-labelledby="about-title"
        /* Starts below the strip + header (--header-h). lg+: fills the rest of the screen, like the store's and the spa's. */
        className="relative overflow-hidden bg-white lg:flex lg:min-h-[calc(100svh_-_var(--header-h))] lg:items-center"
      >
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:py-12">
          <div>
            <p
              className="hero-fade-up mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ink/80 lg:mb-[1vw] lg:text-[clamp(9px,0.85vw,13px)]"
              style={{ animationDelay: "0.4s" }}
            >
              Quiénes somos
            </p>

            <h1
              id="about-title"
              className="font-display text-[clamp(2.7rem,12.5vw,3.6rem)] uppercase leading-[0.88] tracking-[-0.025em] text-ink md:text-[clamp(3.4rem,9vw,5.2rem)] lg:text-[clamp(2.4rem,5vw,5.6rem)]"
            >
              <span className="block overflow-hidden pb-[0.04em]">
                <span className="hero-rise block font-bold" style={{ animationDelay: "0.15s" }}>
                  Hola, somos
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="hero-rise block font-bold" style={{ animationDelay: "0.25s" }}>
                  Queens.
                </span>
              </span>
            </h1>

            <p
              className="hero-fade-up mt-4 max-w-md text-[1rem] leading-relaxed text-ink/85 md:max-w-xl md:text-[1.05rem] lg:mt-[1.2vw] lg:max-w-lg lg:text-[clamp(0.95rem,1.22vw,1.375rem)] lg:leading-[1.5]"
              style={{ animationDelay: "0.5s" }}
            >
              Una casa de belleza en Palmira donde nos gusta que te sientas como en familia: bienvenida, escuchada y bien aconsejada.
            </p>

            <div
              className="hero-fade-up mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-[1.9vw] lg:flex-nowrap lg:gap-x-[1.8vw]"
              style={{ animationDelay: "0.6s" }}
            >
              <a
                href={WA_ADVICE}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="about-cta-whatsapp"
                className="inline-flex items-center gap-[1.4em] whitespace-nowrap bg-[var(--ink)] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--face)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ink) lg:px-[2.2vw] lg:py-[1.15vw] lg:text-[clamp(10px,0.95vw,14px)]"
              >
                Escríbenos
                <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
              </a>
              <span aria-hidden className="hidden h-[3vw] w-px bg-ink/25 lg:block" />
              <a
                href="#casas"
                className="tap-area inline-flex items-center gap-[1.2em] whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-70 lg:text-[clamp(10px,0.95vw,14px)]"
              >
                Conoce nuestras casas
                <ArrowDown className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Snapshots, left on the table: a white mat and a caption each, straight and staggered */}
          <div className="grid grid-cols-3 items-start gap-3 md:gap-5" aria-hidden>
            {SNAPSHOTS.map((s, i) => (
              <Reveal
                as="figure"
                key={s.src}
                delay={250 + i * 140}
                className={cn("bg-white p-1.5 md:p-2.5", s.className)}
                style={{ boxShadow: `0 0 0 1px ${HAIRLINE}, 0 22px 40px -22px rgba(70,38,73,0.4)` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[oklch(0.96_0.02_103)]">
                  <Image
                    src={s.src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 30vw, 17vw"
                    style={{ objectPosition: s.pos }}
                    className="object-cover"
                  />
                </div>
                <figcaption className="hidden px-1 pb-1 pt-3 text-center text-[10px] font-semibold uppercase leading-snug tracking-[0.18em] text-ink/65 md:block">
                  {s.caption}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ Lo que nos mueve ═════ */}
      <section aria-labelledby="values-title" className="relative bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeader id="values-title" eyebrow="Lo que nos mueve" title="Tratarte como nos gustaría que nos traten." />

          <div className={cn(CELLS, "sm:grid-cols-2 lg:grid-cols-4")}>
            {VALUES.map((v, i) => (
              <article
                key={v.title}
                className="group bg-white transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--face)_10%,var(--crema))]"
              >
                <Reveal delay={i * 80} className="p-6 md:p-7">
                  <IconBox>
                    <v.icon className="h-5 w-5" strokeWidth={1.5} />
                  </IconBox>
                  <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{v.text}</p>
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ Dos casas, una familia ═════ */}
      <section id="casas" aria-labelledby="casas-title" className="relative scroll-mt-[var(--nav-h)] overflow-hidden bg-white py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionHeader
            id="casas-title"
            eyebrow="Nuestras casas"
            title="Dos casas, la misma familia."
            text="La tienda para consentirte con lo que te gusta, y el spa para que tus uñas salgan impecables. Dos lugares, la misma manera de atenderte."
          />

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {HOUSES.map((h, i) => (
              <HouseCard key={h.venue.href} house={h} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═════ Cómo es venir ═════ */}
      <section aria-labelledby="steps-title" className="relative bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 py-8 md:py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] lg:self-start">
            <SectionHeader
              id="steps-title"
              eyebrow="Cómo es venir"
              title="Sin afán, con cariño."
              text="Esto es lo que queremos que sientas desde que cruzas la puerta."
            />
          </div>

          <ol className={cn(CELLS, "grid-cols-1")}>
            {STEPS.map((s, i) => (
              <li key={s.title} className="group bg-white transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--face)_10%,var(--crema))]">
                <Reveal delay={i * 80} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 px-5 py-5 md:grid-cols-[3.25rem_1fr] md:px-7 md:py-6">
                  <span aria-hidden className="text-[11px] font-bold tracking-[0.16em] text-[var(--face-deep)] [font-variant-numeric:lining-nums]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink md:text-[14px]">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════ Lo que prometemos ═════ */}
      <section aria-labelledby="promises-title" className="relative bg-white py-8 text-ink md:py-10">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <SectionHeader id="promises-title" eyebrow="Lo que prometemos" title="Puedes venir tranquila." center />

          <ul className={cn(CELLS, "sm:grid-cols-2")}>
            {PROMISES.map((p, i) => (
              <li key={p.text} className="group bg-white transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--face)_10%,var(--crema))]">
                <Reveal delay={i * 70} className="flex items-center gap-4 p-5">
                  <IconBox>
                    <p.icon className="h-5 w-5" strokeWidth={1.5} />
                  </IconBox>
                  <span className="text-sm leading-relaxed text-ink/80 md:text-base">{p.text}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════ Cierre ═════ */}
      <section aria-labelledby="visit-title" className="relative overflow-hidden bg-[var(--face)] py-12 md:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ background: "oklch(0.995 0.022 106.8 / 0.12)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center text-ink md:px-10">
          <Reveal>
            <h2
              id="visit-title"
              className="font-display font-semibold"
              style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.4rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Pasa a saludarnos.
            </h2>
          </Reveal>
          <Reveal as="p" delay={120} className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
            Nos encanta conocer a quienes nos visitan. Escríbenos o cuéntanos cuándo vienes y te esperamos.
          </Reveal>
          <Reveal delay={240} className="mt-8 flex flex-col items-center justify-center gap-x-8 gap-y-5 sm:flex-row">
            <a
              href={WA_ADVICE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 whitespace-nowrap bg-[var(--ink)] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--crema)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ink)]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
            <a
              href="#casas"
              className="tap-area group inline-flex items-center gap-[1.2em] whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-70"
            >
              <MapPin className="h-[1.2em] w-[1.2em]" strokeWidth={1.5} />
              Cómo llegar
              <ArrowUpRight className="h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.5} />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function HouseCard({ house, index }: { house: (typeof HOUSES)[number]; index: number }) {
  const { venue } = house
  const face = venue.href === "/spa" ? "face-spa" : "face-cosmetics"

  return (
    <Reveal delay={index * 120} className="h-full">
      <Link
        href={venue.href}
        {...faceLinkProps(venue.href)}
        data-testid={`about-house-${venue.href.replace("/", "")}`}
        style={{ boxShadow: `inset 0 0 0 1px ${HAIRLINE}` }}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden bg-white text-ink outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--face-deep)]",
          face,
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,oklch(0.96_0.02_103)_0%,oklch(0.98_0.009_90)_100%)]">
          {house.image ? (
            <Image
              src={house.image}
              alt={house.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectPosition: house.pos }}
              className={cn(
                "transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]",
                house.cover ? "object-cover" : "object-contain p-8",
              )}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-face-soft">
              <Image
                src="/images/brand/isotipo-dorado.webp"
                alt={house.alt}
                width={556}
                height={803}
                sizes="160px"
                className="h-3/4 w-auto transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 md:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">{house.eyebrow}</p>
          <h3 className="mt-2.5 font-display text-2xl font-bold tracking-[-0.01em] md:text-3xl">{venue.name}</h3>
          <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ink/70">{house.text}</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--face-deep)]" />
            {venue.address}
          </p>

          <span className="mt-auto flex items-center justify-between pt-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] transition-transform duration-500 group-hover:translate-x-1.5">Conocer</span>
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center text-ink shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ink)_25%,transparent)] transition-[background-color,color,box-shadow] duration-500 group-hover:bg-ink group-hover:text-[var(--face)] group-hover:shadow-[inset_0_0_0_1px_var(--ink)]"
            >
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
