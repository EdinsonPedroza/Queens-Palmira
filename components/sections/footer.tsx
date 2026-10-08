"use client"

import { m } from "framer-motion"
import Link from "next/link"
import { Instagram, MessageCircle, MapPin } from "lucide-react"
import { QueensLogo } from "@/components/queens-logo"
import { WA_DEFAULT } from "@/lib/whatsapp"
import { BUSINESS, VENUES, faceLinkProps, type Face } from "@/lib/site"

const colVariants = {
  hidden: { opacity: 0, y: 32 },
  show:   (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const letterVariants = {
  hidden: { opacity: 0, y: 90, rotateX: -90, scale: 0.55 },
  show:   (i: number) => ({
    opacity: 1, y: 0, rotateX: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 160, damping: 13, delay: i * 0.08 },
  }),
}

interface FooterLink {
  label: string
  href: string
}

/* Two link columns per face. In-page hashes stay on the current page; anything
 * starting with "/" crosses over to the other personality. */
const COLUMNS: Record<Exclude<Face, "about">, [{ title: string; links: FooterLink[] }, { title: string; links: FooterLink[] }]> = {
  portal: [
    {
      title: "Cosmetics",
      links: [
        { label: "Catálogo",       href: "/cosmetics#catalogo" },
        { label: "Cat. Virtual",   href: "/cosmetics#catalogo-digital" },
        { label: "Por qué Queens", href: "/cosmetics#por-que" },
        { label: "Galería",        href: "/cosmetics#galeria" },
      ],
    },
    {
      title: "Spa",
      links: [
        { label: "Rituales",     href: "/spa#rituales" },
        { label: "Galería",      href: "/spa#galeria-spa" },
        { label: "Experiencias", href: "/spa#testimonios-spa" },
        { label: "Preguntas",    href: "/spa#faq-spa" },
      ],
    },
  ],
  cosmetics: [
    {
      title: "Tienda",
      links: [
        { label: "Catálogo",     href: "#catalogo" },
        { label: "Cat. Virtual", href: "#catalogo-digital" },
        { label: "Galería",      href: "#galeria" },
        { label: "Preguntas",    href: "#faq" },
      ],
    },
    {
      title: "Queens",
      links: [
        { label: "Queens Spa",     href: "/spa" },
        { label: "Por qué Queens", href: "#por-que" },
        { label: "Ubicación",      href: "#ubicacion" },
        { label: "Inicio",         href: "/" },
      ],
    },
  ],
  spa: [
    {
      title: "Spa",
      links: [
        { label: "Rituales",     href: "#rituales" },
        { label: "Galería",      href: "#galeria-spa" },
        { label: "Experiencias", href: "#testimonios-spa" },
        { label: "Preguntas",    href: "#faq-spa" },
      ],
    },
    {
      title: "Queens",
      links: [
        { label: "Queens Cosmetics", href: "/cosmetics" },
        { label: "Catálogo",         href: "/cosmetics#catalogo" },
        { label: "Ubicación",        href: "#ubicacion" },
        { label: "Inicio",           href: "/" },
      ],
    },
  ],
}

export function Footer({ face = "portal" }: { face?: Face }) {
  const year = new Date().getFullYear()
  // "Quiénes somos" is a portal-level page, so it shares the portal's columns
  const [colA, colB] = COLUMNS[face === "about" ? "portal" : face]

  return (
    <footer className="relative bg-[var(--ink)] text-white overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-queens-gradient-intense" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-16">

        {/* ── Columnas — entran en stagger ── */}
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 mb-14">
          {[0, 1, 2, 3].map((i) => (
            <m.div
              key={i}
              custom={i}
              variants={colVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
            >
              {i === 0 && (
                <>
                  <QueensLogo variant="white" />
                  <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-xs">
                    Cosmética premium y spa en Palmira. Dos personalidades, una
                    sola reina: tú.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <SocialLink href={BUSINESS.instagramUrl} icon={<Instagram className="h-5 w-5" />} label="Instagram" />
                    <SocialLink href={WA_DEFAULT} icon={<MessageCircle className="h-5 w-5" />} label="WhatsApp" />
                  </div>
                </>
              )}
              {i === 1 && <FooterCol title={colA.title} links={colA.links} />}
              {i === 2 && <FooterCol title={colB.title} links={colB.links} />}
              {i === 3 && (
                <div>
                  <h4 className="font-display font-semibold text-[var(--gold)] mb-4 tracking-wide">Contacto</h4>
                  <ul className="space-y-3 text-sm text-white/80">
                    {/* Two venues — spell both out so nobody shows up at the wrong one */}
                    {[VENUES.cosmetics, VENUES.spa].map((v) => (
                      <li key={v.href} className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[var(--gold)]" />
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                            {v.name.replace("Queens ", "")}
                          </span>
                          {v.address}
                        </span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 shrink-0 mt-0.5 text-[var(--gold)]" />
                      <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] transition">
                        {BUSINESS.phoneDisplay}
                      </a>
                    </li>
                    <li className="flex items-start gap-2">
                      <Instagram className="h-4 w-4 shrink-0 mt-0.5 text-[var(--gold)]" />
                      <a href={BUSINESS.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--gold)] transition">
                        {BUSINESS.instagram}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </m.div>
          ))}
        </div>

        {/* ── QUEENS wordmark ── */}
        <div className="relative border-t border-white/10 pt-12 overflow-hidden">

          {/* Glow de fondo pulsante */}
          <m.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            aria-hidden
          >
            <m.div
              className="h-56 w-3/4 rounded-full blur-[90px]"
              style={{ background: "linear-gradient(90deg, oklch(0.84 0.065 15 / 20%), oklch(0.75 0.135 85 / 25%), oklch(0.70 0.195 355 / 15%))" }}
              animate={{ scaleX: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </m.div>

          {/* Letras — flip 3D + spring bounce */}
          <m.h3
            className="relative font-display text-center font-black select-none leading-none"
            style={{ fontSize: "clamp(3.5rem, 18vw, 18rem)", letterSpacing: "0.02em" }}
          >
            {"QUEENS".split("").map((char, i) => (
              <m.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="inline-block text-queens-gradient"
                style={{ transformPerspective: 700 }}
                whileHover={{
                  scale: 1.22,
                  y: -18,
                  transition: { type: "spring", stiffness: 700, damping: 16 },
                }}
              >
                {char}
              </m.span>
            ))}
          </m.h3>

          {/* Shimmer sweep tras la entrada */}
          <m.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)",
              backgroundSize: "300% 100%",
            }}
            initial={{ backgroundPosition: "300% 0" }}
            whileInView={{ backgroundPosition: "-200% 0" }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 + 6 * 0.08, duration: 1.1, ease: "easeInOut" }}
            aria-hidden
          />
        </div>

        {/* Copyright */}
        <m.div
          className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p>© {year} Queens Cosmetics. Todos los derechos reservados.</p>
          <nav className="flex items-center gap-4">
            <Link href="/quienes-somos" className="hover:text-[var(--gold)] transition-colors">
              Quiénes somos
            </Link>
            <Link href="/terminos" className="hover:text-[var(--gold)] transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-[var(--gold)] transition-colors">
              Privacidad
            </Link>
          </nav>
          <p>Palmira, Valle del Cauca · Colombia</p>
        </m.div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <m.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.15, y: -3 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-[var(--gold)] hover:text-[var(--ink)] hover:border-[var(--gold)]"
    >
      {icon}
    </m.a>
  )
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-[var(--gold)] mb-4 tracking-wide">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l, i) => (
          <m.li
            key={l.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {l.href.startsWith("/") ? (
              <Link href={l.href} {...faceLinkProps(l.href)} className="text-white/70 hover:text-[var(--gold)] transition">
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className="text-white/70 hover:text-[var(--gold)] transition">
                {l.label}
              </a>
            )}
          </m.li>
        ))}
      </ul>
    </div>
  )
}
