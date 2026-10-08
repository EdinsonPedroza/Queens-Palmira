"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { QueensLogo } from "./queens-logo"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { WA_SPA, WA_VISIT } from "@/lib/whatsapp"
import { NAV_LINKS, faceLinkProps, type Face } from "@/lib/site"

/*
 * One bar, three faces. The portal rides the split hero with
 * mix-blend-difference (black over the cosmetics half, white over the spa
 * half); /cosmetics goes rose-on-white; /spa goes gold-on-noir.
 */
const FACE_STYLES = {
  portal: {
    overHero: "bg-transparent mix-blend-difference text-white",
    scrolled: "bg-white/95 md:bg-white/90 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(255,105,180,0.25)]",
    link: "text-[var(--gold)] hover:[text-shadow:0_0_10px_rgba(212,175,55,0.8)]",
    underline: "bg-queens-gradient-intense",
    logo: "default",
    panel: "bg-white/98 text-[var(--ink)]",
    panelLink: "text-[var(--ink)] hover:bg-[var(--rose-pastel)]/30",
  },
  about: {
    overHero: "bg-transparent text-[var(--ink)]",
    scrolled: "bg-white/95 md:bg-white/90 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(255,105,180,0.25)]",
    link: "text-[var(--gold-deep)] hover:[text-shadow:0_0_10px_rgba(212,175,55,0.8)]",
    underline: "bg-queens-gradient-intense",
    logo: "default",
    panel: "bg-white/98 text-[var(--ink)]",
    panelLink: "text-[var(--ink)] hover:bg-[var(--rose-pastel)]/30",
  },
  cosmetics: {
    overHero: "bg-transparent text-[var(--ink)]",
    scrolled: "bg-white/95 md:bg-white/90 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(255,105,180,0.25)]",
    link: "text-[var(--gold-deep)] hover:[text-shadow:0_0_10px_rgba(212,175,55,0.8)]",
    underline: "bg-queens-gradient-intense",
    logo: "default",
    panel: "bg-white/98 text-[var(--ink)]",
    panelLink: "text-[var(--ink)] hover:bg-[var(--rose-pastel)]/30",
  },
  spa: {
    overHero: "bg-transparent text-white",
    scrolled: "bg-noir/92 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(0,0,0,0.6)]",
    link: "text-white/80 hover:text-[var(--gold)]",
    underline: "bg-[var(--gold)]",
    logo: "white",
    panel: "bg-noir/98 text-white border border-white/10",
    panelLink: "text-white/85 hover:bg-white/10",
  },
} as const

interface NavbarProps {
  face?: Face
}

export function Navbar({ face = "portal" }: NavbarProps) {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [overHero, setOverHero] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const s = FACE_STYLES[face]
  const links = NAV_LINKS[face]
  const showCart = face === "cosmetics"
  // The portal header carries only its two links — no reservation button
  const showCta = face !== "portal"
  const ctaHref = face === "spa" ? WA_SPA : WA_VISIT
  const ctaLabel = face === "spa" ? "Reservar cita" : "Visítanos"
  // Over the portal's blend-difference bar the logo must stay monochrome
  const logoVariant = overHero && face === "portal" ? "white" : s.logo

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const hero = document.getElementById("hero")
      setOverHero(hero ? hero.getBoundingClientRect().bottom > 80 : false)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-[background-color,box-shadow] duration-500",
          overHero ? s.overHero : scrolled ? s.scrolled : "bg-transparent",
        )}
      >
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 py-4">
          <Link href="/" aria-label="Queens — inicio">
            <QueensLogo variant={logoVariant} size={80} />
          </Link>

          {/* With only two links the portal centers them on the page, not between the logo and an empty right side */}
          <nav
            className={cn(
              "hidden lg:flex items-center gap-8",
              face === "portal" && "lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:gap-12",
            )}
          >
            {links.map((l, i) => (
              <NavItem
                key={l.href}
                href={l.href}
                label={l.label}
                className={cn(
                  "text-sm font-semibold transition-all relative group",
                  overHero ? "text-current" : s.link,
                  // Portal only: nudge "Quiénes somos" left, leaving "Ubicaciones" where it is
                  face === "portal" && i === 0 && "lg:-translate-x-3",
                )}
                underline={cn(
                  "absolute bottom-[-4px] left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full",
                  overHero ? "bg-current" : s.underline,
                )}
              />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {showCart && (
              <button
                type="button"
                onClick={openCart}
                className={cn(
                  "relative rounded-full p-2.5 transition cursor-pointer",
                  overHero ? "text-current hover:bg-current/10" : "text-ink hover:bg-(--rose-pastel)/30",
                )}
                aria-label={`Carrito con ${count} items`}
                data-testid="cart-trigger"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span
                    className={cn(
                      "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow-md animate-fade-up",
                      overHero ? "bg-current text-white" : "bg-[var(--rose-hot)] text-white",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            )}

            {showCta && (
              <Button
                asChild
                variant={overHero ? "outline" : "gold"}
                size="sm"
                className={cn(
                  "hidden md:inline-flex",
                  overHero && "border-current bg-transparent text-current backdrop-blur-none hover:bg-current/10",
                )}
              >
                <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                  {ctaLabel}
                </a>
              </Button>
            )}

            <button
              type="button"
              className={cn("lg:hidden rounded-full p-2 transition cursor-pointer", overHero ? "text-current" : s.link)}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-[72px] z-30 lg:hidden transition-all duration-400",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        <nav className={cn("mx-4 rounded-2xl p-5 shadow-2xl md:backdrop-blur-xl", s.panel)}>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <NavItem
                  href={l.href}
                  label={l.label}
                  onClick={() => setMobileOpen(false)}
                  className={cn("block rounded-xl px-4 py-3 text-base font-medium transition", s.panelLink)}
                />
              </li>
            ))}
            {showCta && (
              <li className="pt-3">
                <Button asChild variant="gold" size="lg" className="w-full">
                  <a href={ctaHref} target="_blank" rel="noopener noreferrer">
                    {ctaLabel}
                  </a>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  )
}

/** Route hrefs get prefetched client navigation; in-page hashes stay plain anchors. */
function NavItem({
  href,
  label,
  className,
  underline,
  onClick,
}: {
  href: string
  label: string
  className?: string
  underline?: string
  onClick?: () => void
}) {
  const body = (
    <>
      {label}
      {underline && <span className={underline} />}
    </>
  )

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...faceLinkProps(href)} className={className} onClick={onClick}>
        {body}
      </Link>
    )
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {body}
    </a>
  )
}
