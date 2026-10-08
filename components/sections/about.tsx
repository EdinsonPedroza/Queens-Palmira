"use client"

import Image from "next/image"
import Link from "next/link"
import { m, type Variants } from "framer-motion"
import {
  ArrowUpRight,
  CalendarHeart,
  Check,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Smile,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VENUES, faceLinkProps } from "@/lib/site"
import { WA_ADVICE } from "@/lib/whatsapp"

/*
 * "Quiénes somos": the warm page. Where the portal is a split screen, this is
 * the opposite — soft light, rounded corners, snapshot-style photos tilted like
 * they were left on a table. Every claim comes from facts already on the site
 * (originals, advice, samples, exchanges, appointments); there is no founding
 * story, year or name here until the client supplies one.
 */

const EASE = [0.16, 1, 0.3, 1] as const

const rise: Variants = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({ y: "0%", transition: { duration: 0.95, delay: i * 0.1, ease: EASE } }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: EASE } }),
}

const VIEW = { once: true, margin: "-80px" } as const

/* ── Placeholder photos: swap for real ones of the shop, the team and the clients ── */
const SNAPSHOTS = [
  {
    src: "/images/spa/facial.webp",
    alt: "Un facial en Queens Spa",
    caption: "Tu rato de calma",
    className: "left-0 top-6 w-[46%] -rotate-6 md:top-10",
    cover: true,
  },
  {
    src: "/images/spa/mask.webp",
    alt: "Mascarilla facial",
    caption: "Manos que saben",
    className: "right-0 top-0 w-[44%] rotate-5",
    cover: true,
  },
  {
    src: "/images/products/Brillo Labial Essence Juicy Bomb.webp",
    alt: "Brillos labiales de la tienda",
    caption: "Tu color favorito",
    className: "bottom-0 left-[26%] w-[48%] -rotate-2",
    cover: false,
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
    image: "/images/products/Maybelline Superstay Matte Ink.webp",
    cover: false,
    tone: "light" as const,
  },
  {
    venue: VENUES.spa,
    eyebrow: "El spa",
    text: "Faciales, masajes y rituales para desconectarte. Con cita previa.",
    image: "/images/spa/stones.webp",
    cover: true,
    tone: "noir" as const,
  },
]

function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.p
      variants={fadeUp}
      className={cn(
        "mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold-deep)]",
        className,
      )}
    >
      <span className="h-px w-10 bg-[var(--gold-deep)]/50" />
      {children}
    </m.p>
  )
}

export function About() {
  return (
    <>
      {/* ═════ Hero ═════ */}
      <m.section
        id="hero"
        aria-labelledby="about-title"
        initial="hidden"
        animate="show"
        className="relative overflow-hidden bg-[linear-gradient(180deg,oklch(0.96_0.028_15)_0%,oklch(0.99_0.008_30)_100%)] pb-20 pt-32 md:pb-28 md:pt-40"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-[34rem] w-[34rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.84 0.065 15 / 0.35) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.85 0.09 85 / 0.22) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <m.p
              variants={fadeUp}
              custom={0}
              className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold-deep)]"
            >
              <span className="h-px w-10 bg-[var(--gold-deep)]/50" />
              Quiénes somos
            </m.p>

            <h1
              id="about-title"
              className="font-display leading-[0.95] tracking-[-0.04em] text-ink"
              style={{ fontSize: "clamp(2.8rem, 7.5vw, 6rem)" }}
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <m.span variants={rise} custom={0} className="block font-light">
                  Hola, somos
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.12em]">
                <m.span variants={rise} custom={1} className="block font-bold text-queens-gradient">
                  Queens.
                </m.span>
              </span>
            </h1>

            <m.p variants={fadeUp} custom={2} className="mt-7 max-w-lg text-lg leading-relaxed text-ink/70 md:text-xl">
              Una casa de belleza en Palmira donde nos gusta que te sientas como en familia: bienvenida, escuchada y
              bien aconsejada.
            </m.p>

            <m.div variants={fadeUp} custom={3} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button asChild size="lg" data-testid="about-cta-whatsapp">
                <a href={WA_ADVICE} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Escríbenos, te contamos todo
                </a>
              </Button>
              <a
                href="#casas"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 underline decoration-[var(--rose-hot)]/50 underline-offset-[6px] transition hover:text-ink hover:decoration-[var(--rose-hot)]"
              >
                Conoce nuestras casas
              </a>
            </m.div>
          </div>

          {/* Snapshots, left on the table */}
          <m.div variants={fadeUp} custom={2} className="relative mx-auto aspect-[5/5.2] w-full max-w-[34rem]" aria-hidden>
            {SNAPSHOTS.map((s, i) => (
              <m.figure
                key={s.src}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.15, ease: EASE }}
                className={cn(
                  "absolute rounded-md bg-white p-2.5 pb-10 shadow-[0_18px_40px_-14px_rgba(44,24,16,0.35)]",
                  s.className,
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[oklch(0.96_0.02_15)]">
                  <Image
                    src={s.src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 40vw, 18vw"
                    className={s.cover ? "object-cover" : "object-contain p-3"}
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-2.5 text-center font-serif text-sm italic text-ink/60">
                  {s.caption}
                </figcaption>
              </m.figure>
            ))}
          </m.div>
        </div>
      </m.section>

      {/* ═════ Lo que nos mueve ═════ */}
      <section aria-labelledby="values-title" className="relative bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <m.div initial="hidden" whileInView="show" viewport={VIEW} className="mx-auto max-w-2xl text-center">
            <SectionLabel className="justify-center">Lo que nos mueve</SectionLabel>
            <h2
              id="values-title"
              className="font-display leading-[1] tracking-[-0.035em] text-ink"
              style={{ fontSize: "clamp(2.1rem, 5vw, 3.8rem)" }}
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <m.span variants={rise} className="block font-light">
                  Tratarte como
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <m.span variants={rise} custom={1} className="block font-bold text-queens-gradient">
                  nos gustaría que nos traten.
                </m.span>
              </span>
            </h2>
          </m.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {VALUES.map((v, i) => (
              <m.article
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                className="group rounded-3xl border border-[oklch(0.84_0.065_15/0.35)] bg-[linear-gradient(180deg,oklch(0.985_0.012_15)_0%,white_100%)] p-7 transition-shadow duration-500 hover:shadow-[0_18px_40px_-18px_rgba(255,105,180,0.4)]"
              >
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--rose-pastel-soft)_0%,oklch(0.88_0.07_85)_100%)] text-[var(--gold-deep)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{v.text}</p>
              </m.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ Dos casas, una familia ═════ */}
      <section
        id="casas"
        aria-labelledby="casas-title"
        className="relative scroll-mt-20 overflow-hidden bg-[oklch(0.975_0.014_15)] py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <m.div initial="hidden" whileInView="show" viewport={VIEW} className="mb-14 max-w-2xl">
            <SectionLabel>Nuestras casas</SectionLabel>
            <h2
              id="casas-title"
              className="font-display leading-[1] tracking-[-0.035em] text-ink"
              style={{ fontSize: "clamp(2.1rem, 5vw, 3.8rem)" }}
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <m.span variants={rise} className="block font-light">
                  Dos casas,
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <m.span variants={rise} custom={1} className="block font-bold text-queens-gradient">
                  la misma familia.
                </m.span>
              </span>
            </h2>
            <m.p variants={fadeUp} custom={2} className="mt-5 text-base leading-relaxed text-ink/65 md:text-lg">
              La tienda para consentirte con lo que te gusta, y el spa para que te tomes un respiro. Dos lugares, la
              misma manera de atenderte.
            </m.p>
          </m.div>

          <div className="grid gap-6 md:grid-cols-2">
            {HOUSES.map((h, i) => (
              <HouseCard key={h.venue.href} house={h} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═════ Cómo es venir ═════ */}
      <section aria-labelledby="steps-title" className="relative bg-white py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <m.div initial="hidden" whileInView="show" viewport={VIEW} className="lg:sticky lg:top-32 lg:self-start">
            <SectionLabel>Cómo es venir</SectionLabel>
            <h2
              id="steps-title"
              className="font-display leading-[1] tracking-[-0.035em] text-ink"
              style={{ fontSize: "clamp(2.1rem, 5vw, 3.8rem)" }}
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <m.span variants={rise} className="block font-light">
                  Sin afán,
                </m.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <m.span variants={rise} custom={1} className="block font-bold text-queens-gradient">
                  con cariño.
                </m.span>
              </span>
            </h2>
            <m.p variants={fadeUp} custom={2} className="mt-5 max-w-sm text-base leading-relaxed text-ink/65 md:text-lg">
              Esto es lo que queremos que sientas desde que cruzas la puerta.
            </m.p>
          </m.div>

          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <m.li
                key={s.title}
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.75, delay: i * 0.08, ease: EASE }}
                className="flex items-start gap-5 rounded-3xl border border-[oklch(0.84_0.065_15/0.3)] bg-[oklch(0.985_0.01_15)] p-6 md:gap-7 md:p-8"
              >
                <span
                  aria-hidden
                  className="font-display text-4xl font-bold leading-none tracking-tight text-queens-gradient md:text-5xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65 md:text-base">{s.text}</p>
                </div>
              </m.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═════ Lo que prometemos ═════ */}
      <section aria-labelledby="promises-title" className="relative overflow-hidden bg-noir py-24 text-white md:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.75 0.135 85 / 0.14) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-6 md:px-10">
          <m.div initial="hidden" whileInView="show" viewport={VIEW} className="text-center">
            <m.p
              variants={fadeUp}
              className="mb-5 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--gold)]"
            >
              <span className="h-px w-10 bg-[var(--gold)]/60" />
              Lo que prometemos
              <span className="h-px w-10 bg-[var(--gold)]/60" />
            </m.p>
            <m.h2
              id="promises-title"
              variants={fadeUp}
              custom={1}
              className="font-display leading-[1] tracking-[-0.035em]"
              style={{ fontSize: "clamp(2rem, 4.6vw, 3.4rem)" }}
            >
              <span className="font-light">Puedes venir </span>
              <span className="font-bold shimmer-gold">tranquila.</span>
            </m.h2>
          </m.div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {PROMISES.map((p, i) => (
              <m.li
                key={p.text}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEW}
                transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)]">
                  <p.icon className="h-5 w-5" />
                </span>
                <span className="text-sm leading-relaxed text-white/80 md:text-base">{p.text}</span>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════ Cierre ═════ */}
      <section aria-labelledby="visit-title" className="relative overflow-hidden py-24 md:py-28">
        <div aria-hidden className="absolute inset-0 bg-queens-gradient-intense" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 h-[26rem] w-[26rem] rounded-full blur-3xl"
          style={{ background: "oklch(1 0 0 / 0.12)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center text-white md:px-10">
          <m.div initial="hidden" whileInView="show" viewport={VIEW}>
            <m.h2
              id="visit-title"
              variants={fadeUp}
              className="font-display font-semibold leading-tight tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              Pasa a saludarnos.
            </m.h2>
            <m.p variants={fadeUp} custom={1} className="mx-auto mt-5 max-w-xl text-base text-white/85 md:text-lg">
              Nos encanta conocer a quienes nos visitan. Escríbenos o cuéntanos cuándo vienes y te esperamos.
            </m.p>
            <m.div variants={fadeUp} custom={2} className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild variant="whatsapp" size="xl">
                <a href={WA_ADVICE} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-6 w-6" />
                  Escríbenos por WhatsApp
                </a>
              </Button>
              <Button asChild size="xl" className="border-white bg-white text-ink shadow-xl hover:bg-white/90">
                <Link href="/#ubicaciones">
                  <MapPin className="h-5 w-5" />
                  Cómo llegar
                </Link>
              </Button>
            </m.div>
          </m.div>
        </div>
      </section>
    </>
  )
}

function HouseCard({ house, index }: { house: (typeof HOUSES)[number]; index: number }) {
  const isNoir = house.tone === "noir"
  const { venue } = house

  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
    >
      <Link
        href={venue.href}
        {...faceLinkProps(venue.href)}
        data-testid={`about-house-${venue.href.replace("/", "")}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isNoir
            ? "bg-noir text-white focus-visible:ring-[var(--gold)]"
            : "border border-[oklch(0.84_0.065_15/0.4)] bg-white text-ink focus-visible:ring-[var(--rose-hot)]",
        )}
      >
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden",
            isNoir ? "bg-noir-soft" : "bg-[linear-gradient(135deg,oklch(0.96_0.03_15)_0%,oklch(0.98_0.012_85)_100%)]",
          )}
        >
          <Image
            src={house.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              "transition duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]",
              house.cover ? "object-cover" : "object-contain p-8",
              isNoir && "grayscale contrast-[1.1] brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100",
            )}
          />
          {isNoir && <div className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-transparent" />}
        </div>

        <div className="flex flex-1 flex-col p-7 md:p-9">
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.3em]",
              isNoir ? "text-[var(--gold)]" : "text-[var(--gold-deep)]",
            )}
          >
            {house.eyebrow}
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">{venue.name}</h3>
          <p className={cn("mt-3 max-w-sm text-base leading-relaxed", isNoir ? "text-white/65" : "text-ink/65")}>
            {house.text}
          </p>
          <p
            className={cn(
              "mt-5 flex items-center gap-2 text-sm",
              isNoir ? "text-white/55" : "text-ink/55",
            )}
          >
            <MapPin className={cn("h-4 w-4 shrink-0", isNoir ? "text-[var(--gold)]" : "text-[var(--gold-deep)]")} />
            {venue.address}
          </p>

          <span className="mt-auto flex items-center justify-between pt-8">
            <span className="font-display text-lg font-semibold uppercase tracking-tight transition-transform duration-500 group-hover:translate-x-1.5">
              Conocer
            </span>
            <span
              aria-hidden
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border transition duration-500 group-hover:rotate-45",
                isNoir
                  ? "border-white/25 group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-noir"
                  : "border-ink/20 group-hover:border-[var(--rose-hot)] group-hover:bg-[var(--rose-hot)] group-hover:text-white",
              )}
            >
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </span>
        </div>
      </Link>
    </m.div>
  )
}
