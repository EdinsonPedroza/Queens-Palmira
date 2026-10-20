"use client"

import { useRef } from "react"
import { m, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowUp, MapPin } from "lucide-react"
import { InstagramIcon } from "@/components/instagram-icon"
import { QueensLogo } from "@/components/queens-logo"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { WA_DEFAULT, WA_NEWS } from "@/lib/whatsapp"
import { CATEGORIES, type ProductCategory } from "@/lib/categories"
import { BUSINESS, CATALOG_FILTERS_ID, CATEGORY_EVENT, VENUES, faceLinkProps, type Face } from "@/lib/site"
import { cn } from "@/lib/utils"

const colVariants = {
  hidden: { opacity: 0, y: 32 },
  show:   (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

/* The six letters of the logo's "Queens", cut from the original imagotipo (public/images/brand/queens-letter-0..5.webp, white with an alpha channel). x/y/w/h are
 * their exact boxes inside the 1520×413 lettering, so together they redraw it pixel for pixel; each one is animated on its own. */
const LETTERS_W = 1520
const LETTERS_H = 413
const LETTERS = [
  { x: 3,    y: 3,  w: 361, h: 407 },   // Q
  { x: 350,  y: 91, w: 241, h: 240 },   // u
  { x: 606,  y: 92, w: 222, h: 238 },   // e
  { x: 842,  y: 92, w: 222, h: 238 },   // e
  { x: 1076, y: 91, w: 249, h: 235 },   // n
  { x: 1337, y: 92, w: 180, h: 238 },   // s
]

interface FooterLink {
  label: string
  href: string
  /** A product category: the link opens that tab of the catalog (same as the header's category links). */
  category?: ProductCategory
}

/* Small spaced capitals for every column title (the same voice as the cart drawer's titles). */
const HEADING = "mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--face)]"
const HAIRLINE = "color-mix(in oklab, var(--crema) 20%, transparent)"

/* Two link columns per face. In-page hashes stay on the current page; anything
 * starting with "/" crosses over to the other personality. */
const COLUMNS: Record<Face, [{ title: string; links: FooterLink[] }, { title: string; links: FooterLink[] }]> = {
  // "Quiénes somos" is its own page: every link points back at the home or at the spa
  about: [
    {
      title: "Cosmetics",
      links: [
        { label: "Catálogo",   href: "/#catalogo" },
        { label: "Conócenos",  href: "/#galeria" },
        { label: "Ubicación",  href: "/#ubicacion" },
      ],
    },
    {
      title: "Spa",
      links: [
        { label: "Servicios",    href: "/spa#servicios" },
        { label: "Agendar cita", href: "/spa#agendar" },
        { label: "Experiencias", href: "/spa#testimonios-spa" },
        { label: "Preguntas",    href: "/spa#faq-spa" },
      ],
    },
  ],
  // The store's footer takes from the references the client sent (Montoc, Atenea, Hourglass): the product categories as a column of their own
  // (each opens its tab of the catalog), and a help column with the shop's rules (shipping, exchanges) one tap away.
  cosmetics: [
    {
      title: "Categorías",
      links: CATEGORIES.map((c) => ({ label: c.label, href: "#catalogo", category: c.id })),
    },
    {
      title: "Ayuda",
      links: [
        { label: "Conócenos",              href: "#galeria" },
        { label: "Preguntas frecuentes",   href: "#faq" },
        { label: "Ubicación",              href: "#ubicacion" },
        { label: "Envíos y entregas",      href: "/terminos#envios" },
        { label: "Cambios y devoluciones", href: "/terminos#cambios" },
        { label: "Queens Spa",             href: "/spa" },
      ],
    },
  ],
  spa: [
    {
      title: "Spa",
      links: [
        { label: "Servicios",    href: "#servicios" },
        { label: "Agendar cita", href: "#agendar" },
        { label: "Experiencias", href: "#testimonios-spa" },
        { label: "Preguntas",    href: "#faq-spa" },
      ],
    },
    {
      title: "Queens",
      links: [
        { label: "Queens Cosmetics", href: "/" },
        { label: "Catálogo",         href: "/#catalogo" },
        { label: "Ubicación",        href: "#ubicacion" },
        { label: "Inicio",           href: "/" },
      ],
    },
  ],
}

/** `tone="crema"`: a light footer (the spa's, client request): the logo is the coloured one (gold, or lila in the store) instead of the crema one. Default "ink" is the dark block. */
export function Footer({ face = "cosmetics", tone = "ink" }: { face?: Face; tone?: "ink" | "crema" }) {
  const year = new Date().getFullYear()
  // The big lettering starts when it scrolls into view: this flag only switches the CSS animation on (Framer's own entrance blinked for a frame when it ended)
  const wordRef = useRef<HTMLDivElement>(null)
  const wordIn = useInView(wordRef, { once: true, margin: "-80px" })
  const [colA, colB] = COLUMNS[face]

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
                  <QueensLogo variant={tone === "crema" ? (face === "cosmetics" ? "lila" : "default") : "white"} cosmetics={face === "cosmetics"} />
                  <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-xs">
                    Cosmética premium y spa en Palmira. Dos personalidades, una
                    sola reina: tú.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <SocialLink href={BUSINESS.instagramUrl} icon={<InstagramIcon className="h-5 w-5" />} label="Instagram" />
                    <SocialLink href={WA_DEFAULT} icon={<WhatsAppIcon className="h-5 w-5" />} label="WhatsApp" />
                  </div>
                  {/* From Hourglass's newsletter block: there is no backend here, so instead of an email box the way to hear first is WhatsApp (a ready-made message) */}
                  <div className="mt-7 max-w-xs border-t pt-5" style={{ borderColor: HAIRLINE }}>
                    <h4 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--face)]">Novedades y ofertas</h4>
                    <p className="text-sm leading-snug text-white/70">Entérate primero de los lanzamientos y las promociones.</p>
                    <a
                      href={WA_NEWS}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="footer-news"
                      style={{ borderColor: "var(--face)" }}
                      className="mt-3 inline-flex h-10 items-center gap-2.5 border px-4 text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--face)] transition-colors duration-200 hover:bg-[var(--face)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--face)]"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      Unirme por WhatsApp
                    </a>
                  </div>
                </>
              )}
              {i === 1 && <FooterCol title={colA.title} links={colA.links} />}
              {i === 2 && <FooterCol title={colB.title} links={colB.links} />}
              {i === 3 && (
                <div>
                  <h4 className={HEADING}>Contacto</h4>
                  <ul className="space-y-4 text-sm text-white/80">
                    {/* Two venues — spell both out so nobody shows up at the wrong one. Each one carries its hours and a "Cómo llegar" link (Atenea's "tiendas y ubicaciones"). */}
                    {[VENUES.cosmetics, VENUES.spa].map((v) => (
                      <li key={v.href} className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[var(--face)]" />
                        <span>
                          <span className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                            {v.name.replace("Queens ", "")}
                          </span>
                          {v.address}
                          <span className="mt-0.5 block text-xs text-white/55">{v.hoursShort}</span>
                          <a
                            href={v.gmaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs uppercase tracking-[0.14em] text-[var(--face)] underline decoration-[var(--face)]/40 underline-offset-4 transition-colors hover:decoration-[var(--face)]"
                          >
                            Cómo llegar
                          </a>
                        </span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2">
                      <WhatsAppIcon className="h-4 w-4 shrink-0 mt-0.5 text-[var(--face)]" />
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-white/50">Servicio al cliente</span>
                        <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--face)] transition">
                          {BUSINESS.phoneDisplay}
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <InstagramIcon className="h-4 w-4 shrink-0 mt-0.5 text-[var(--face)]" />
                      <a href={BUSINESS.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--face)] transition">
                        {BUSINESS.instagram}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </m.div>
          ))}
        </div>

        {/* ── QUEENS lettering (the logo's) ── */}
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
            {/* Breathes forever, so it is a CSS loop (see "AMBIENT LOOPS" in globals.css), not Framer */}
            <div
              className="ambient-breathe h-56 w-3/4 rounded-full blur-[90px]"
              style={
                {
                  background: "linear-gradient(90deg, color-mix(in oklab, var(--face-light) 20%, transparent), color-mix(in oklab, var(--face) 25%, transparent), oklch(0.325 0.073 323.9 / 15%))",
                  "--breathe-x": 1.15,
                  "--breathe-y": 1,
                  "--breathe-from": 0.5,
                  "--breathe-to": 1,
                  "--amb-dur": "4s",
                } as React.CSSProperties
              }
            />
          </m.div>

          {/* The lettering of the official logo (the "Queens" cut out of the imagotipo, never retyped in a font) in the palette's accent colour: the footer is the
              near-black block, so it takes --face (lila in the store, gold in the spa). It is a mask (public/images/brand/wordmark-mask.webp, 1520 px wide) filled with
              the colour, so it stays sharp at this size and follows the face. */}
          <div
            ref={wordRef}
            role="img"
            aria-label="Queens"
            data-testid="footer-wordmark"
            className="relative mx-auto w-[min(78%,940px)]"
            style={{ aspectRatio: `${LETTERS_W} / ${LETTERS_H}` }}
          >
            {LETTERS.map((l, i) => (
              <span
                key={i}
                aria-hidden
                data-testid="footer-letter"
                className={cn(
                  "absolute bg-[var(--face)] transition-[translate,scale] duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[0.9%] hover:scale-[1.12]",
                  wordIn ? "motion-safe:animate-[footer-letter-in_900ms_cubic-bezier(0.34,1.56,0.64,1)_backwards]" : "opacity-0",
                )}
                style={{
                  left: `${(l.x / LETTERS_W) * 100}%`,
                  top: `${(l.y / LETTERS_H) * 100}%`,
                  width: `${(l.w / LETTERS_W) * 100}%`,
                  height: `${(l.h / LETTERS_H) * 100}%`,
                  animationDelay: `${i * 80}ms`,
                  WebkitMaskImage: `url(/images/brand/queens-letter-${i}.webp)`,
                  maskImage: `url(/images/brand/queens-letter-${i}.webp)`,
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <m.div
          className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex items-center gap-4">
            {/* From Montoc's footer: a way back to the top */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Volver arriba"
              data-testid="footer-top"
              style={{ borderColor: HAIRLINE }}
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center border text-white/80 transition-colors duration-200 hover:border-[var(--face)] hover:bg-[var(--face)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--face)]"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <p>© {year} Queens Cosmetics. Todos los derechos reservados.</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/quienes-somos" className="hover:text-[var(--face)] transition-colors">
              Quiénes somos
            </Link>
            <Link href="/terminos" className="hover:text-[var(--face)] transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-[var(--face)] transition-colors">
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-[var(--face)] hover:text-[var(--ink)] hover:border-[var(--face)]"
    >
      {icon}
    </m.a>
  )
}

/* Like the header's category links: tell the catalog which tab to open and scroll to its filters row (the browser's own jump to #catalogo is the fallback). */
function openCategory(category: ProductCategory, e: React.MouseEvent) {
  window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: category }))
  const target = document.getElementById(CATALOG_FILTERS_ID) ?? document.getElementById("catalogo")
  if (target) {
    e.preventDefault()
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className={HEADING}>{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l, i) => (
          <m.li
            key={l.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {l.category ? (
              <a href={l.href} onClick={(e) => openCategory(l.category!, e)} className="text-white/70 hover:text-[var(--face)] transition">
                {l.label}
              </a>
            ) : l.href.startsWith("/") ? (
              <Link href={l.href} {...faceLinkProps(l.href)} className="text-white/70 hover:text-[var(--face)] transition">
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className="text-white/70 hover:text-[var(--face)] transition">
                {l.label}
              </a>
            )}
          </m.li>
        ))}
      </ul>
    </div>
  )
}
