"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MapPin, ShoppingBag, Menu, X, Search } from "lucide-react"
import { InstagramIcon } from "./instagram-icon"
import { WhatsAppIcon } from "./whatsapp-icon"
import { useOptionalCart } from "@/context/cart-context"
import { QueensLogo } from "./queens-logo"
import { cn, scrollBehavior } from "@/lib/utils"
import { WA_SPA } from "@/lib/whatsapp"
import { ANNOUNCEMENT, ANNOUNCEMENT_ABOUT, ANNOUNCEMENT_SPA, BUSINESS, CATALOG_FILTERS_ID, CATEGORY_ACTIVE_EVENT, CATEGORY_EVENT, NAV_LINKS, SEARCH_ACTIVE_EVENT, SEARCH_EVENT, VENUES, faceLinkProps, type Face, type NavLink } from "@/lib/site"

/*
 * One bar. Every page is crema, so the accent (links, underline, CTA) comes from
 * --face (lila on the store, gold on /spa).
 */
const FACE_STYLES = {
  about: {
    overHero: "bg-transparent text-[var(--ink)]",
    scrolled: "bg-white/95 md:bg-white/90 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_color-mix(in_oklab,var(--face)_25%,transparent)]",
    link: "text-[var(--face-deep)] hover:[text-shadow:0_0_10px_color-mix(in_oklab,var(--face)_80%,transparent)]",
    underline: "bg-queens-gradient-intense",
    logo: "lila",
    panel: "bg-white/98 text-[var(--ink)]",
    panelLink: "text-[var(--ink)] hover:bg-[var(--face-light)]/30",
  },
  cosmetics: {
    overHero: "bg-transparent text-[var(--ink)]",
    scrolled: "bg-white/95 md:bg-white/90 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_color-mix(in_oklab,var(--face)_25%,transparent)]",
    link: "text-[var(--face-deep)] hover:[text-shadow:0_0_10px_color-mix(in_oklab,var(--face)_80%,transparent)]",
    underline: "bg-queens-gradient-intense",
    logo: "lila",
    panel: "bg-white/98 text-[var(--ink)]",
    panelLink: "text-[var(--ink)] hover:bg-[var(--face-light)]/30",
  },
  spa: {
    overHero: "bg-transparent text-[var(--ink)]",
    scrolled: "bg-white/95 md:bg-white/90 md:backdrop-blur-xl shadow-[0_4px_24px_-12px_color-mix(in_oklab,var(--face)_25%,transparent)]",
    link: "text-[var(--face-deep)] hover:[text-shadow:0_0_10px_color-mix(in_oklab,var(--face)_80%,transparent)]",
    underline: "bg-queens-gradient-intense",
    logo: "default",
    panel: "bg-white/98 text-[var(--ink)]",
    panelLink: "text-[var(--ink)] hover:bg-[var(--face-light)]/30",
  },
} as const

interface NavbarProps {
  face?: Face
  /** The header is a solid bar of its own and the page starts below it (it never floats over the hero). */
  separate?: boolean
  /** A slim strip above the header (free-shipping note). It scrolls away; the header then slides up to the top. */
  announce?: boolean
}

export function Navbar({ face = "cosmetics", separate = false, announce = false }: NavbarProps) {
  // Only /cosmetics mounts the cart; everywhere else this is null and the button is not drawn
  const cart = useOptionalCart()
  const [scrolled, setScrolled] = useState(false)
  const [overHeroRaw, setOverHero] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("")
  // Galería / Ubicación: the section of the page that is on screen (its id), so its link keeps the bar like a category does
  const [activeSection, setActiveSection] = useState<string>("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const overHero = overHeroRaw && !separate
  const [mobileOpen, setMobileOpen] = useState(false)

  const s = FACE_STYLES[face]
  const links = NAV_LINKS[face]
  // The spa header has no "Reservar cita" button any more (the client asked for something like the store's icons): it carries Instagram, WhatsApp
  // (the booking chat) and the map pin as round icon buttons.
  const spaIcons = face === "spa"
  // The store's header carries ten links: the inline nav needs xl (1280 px); under that it is the hamburger menu
  const inlineNav = face === "cosmetics" ? "xl" : "lg"
  // `separate` (/cosmetics): the bar is always the crema version (lila logo and links). It used to be solid lila
  // (crema logo, ink links and button) until the page was scrolled; the client asked to keep the crema one at all
  // times. Set `LILA_AT_TOP` back to true to restore the lila-at-the-top behaviour.
  const LILA_AT_TOP = false
  const lilaTop = LILA_AT_TOP && separate && !scrolled
  const strip = face === "spa" ? ANNOUNCEMENT_SPA : face === "about" ? ANNOUNCEMENT_ABOUT : ANNOUNCEMENT
  const logoVariant = lilaTop ? "white" : s.logo
  const linkTone = lilaTop ? "text-[var(--ink)] hover:opacity-70" : s.link

  /* Category links: the browser scrolls to #catalogo, and the catalog is told which tab to open. */
  // Land on the catalog's filters row, not on the section's title: the products are right below it.
  const scrollToCatalog = () => {
    const target = document.getElementById(CATALOG_FILTERS_ID) ?? document.getElementById("catalogo")
    target?.scrollIntoView({ behavior: scrollBehavior(), block: "start" })
    return !!target
  }
  const openCategory = (l: NavLink, e: React.MouseEvent) => {
    if (!l.category) return
    window.dispatchEvent(new CustomEvent(CATEGORY_EVENT, { detail: l.category }))
    if (scrollToCatalog()) e.preventDefault()
  }

  /* The magnifier: a search box under the header. The catalog does the filtering (it searches every category). */
  const onSearchChange = (v: string) => {
    const wasEmpty = query.trim() === ""
    setQuery(v)
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: v }))
    if (wasEmpty && v.trim() !== "") scrollToCatalog()
  }
  useEffect(() => {
    const onActive = (e: Event) => setQuery((e as CustomEvent<string>).detail ?? "")
    window.addEventListener(SEARCH_ACTIVE_EVENT, onActive)
    return () => window.removeEventListener(SEARCH_ACTIVE_EVENT, onActive)
  }, [])
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
    // The open search box covers the strip under the header: the catalog's scroll target leaves room for it (--search-h). It is set on
    // that element alone (only the store has one), never on <html>: see the note on the refs above.
    if (face !== "cosmetics") return
    const target = document.getElementById(CATALOG_FILTERS_ID)
    if (searchOpen) target?.style.setProperty("--search-h", "5.4rem")
    else target?.style.removeProperty("--search-h")
  }, [searchOpen, face])
  // While a text search is on, no category is "the open one"
  // While one of those sections is on screen the category is not the "current place" any more
  const markedCategory = query.trim() === "" && activeSection === "" ? activeCategory : ""
  const sectionIds = links.filter((l) => !l.category && l.href.startsWith("#")).map((l) => l.href.slice(1))
  const sectionKey = sectionIds.join(",")
  useEffect(() => {
    const ids = sectionKey ? sectionKey.split(",") : []
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (els.length === 0) return
    const visible = new Set<string>()
    // The band between 35 % and 55 % of the screen height decides "where you are" (a section counts when it crosses it)
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id))
      setActiveSection(ids.find((id) => visible.has(id)) ?? "")
    }, { rootMargin: "-35% 0px -45% 0px" })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [sectionKey])

  useEffect(() => {
    const onActive = (e: Event) => setActiveCategory((e as CustomEvent<string>).detail)
    window.addEventListener(CATEGORY_ACTIVE_EVENT, onActive)
    return () => window.removeEventListener(CATEGORY_ACTIVE_EVENT, onActive)
  }, [])

  useEffect(() => {
    // The strip and the header move with the page by themselves (with `separate`, the strip is in the flow and the header is `sticky`), so
    // nothing here follows the scroll. They used to: a fixed header was moved from this handler on every scroll event, which on a phone runs
    // a frame behind the finger and made the header jump and flicker while scrolling up and down (client report, 19 Oct 2026).
    const onScroll = () => {
      const y = window.scrollY
      // `overHero` only matters while the header floats over the hero; the separate header never does.
      const heroBottom = separate ? null : (document.getElementById("hero")?.getBoundingClientRect().bottom ?? null)
      setScrolled(y > 40)
      if (!separate) setOverHero(heroBottom !== null ? heroBottom > 80 : false)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [separate])

  return (
    <>
      {announce && (
        <div
          className={cn(separate ? "relative" : "absolute inset-x-0 top-0", "z-30 flex h-[var(--bar-h)] items-center justify-center gap-3 overflow-hidden bg-[var(--ink)] px-4 text-center text-[12px] font-semibold tracking-[0.06em] text-[var(--face)] sm:text-[12.5px]")}
          data-testid="announcement"
        >
          <span aria-hidden className="hidden h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px] bg-[var(--crema)] sm:block" />
          <p className="truncate">
            <span className="hidden sm:inline">{strip.long}</span>
            <span className="sm:hidden">{strip.short}</span>
          </p>
          <span aria-hidden className="hidden h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px] bg-[var(--crema)] sm:block" />
        </div>
      )}
      {/* With `separate` the strip above is in the flow and the header is STICKY: the browser moves both with the finger, no script follows the scroll
          (the old fixed header moved from a scroll handler lagged a frame on phones and flickered). The search box and the phone menu hang from it. */}
      <header
        className={cn(
          "left-0 right-0 z-40 transition-[background-color,box-shadow] duration-500",
          separate ? "sticky top-0 h-[var(--nav-h)]" : "fixed top-0",
          overHero ? s.overHero : lilaTop ? "bg-[var(--face)]" : separate ? "bg-[var(--crema)] shadow-[0_4px_24px_-12px_color-mix(in_oklab,var(--face)_25%,transparent)]" : scrolled ? s.scrolled : "bg-transparent",
        )}
      >
        <div className={cn("relative mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8", separate ? "h-full py-1" : "py-4")}>
          {/* Phones: the lockup (214 px) plus four icons and the cart's "(0)" do not fit, so it shrinks with `zoom` (layout-aware, unlike scale) */}
          <Link href="/" aria-label="Queens — inicio" className={cn("max-[430px]:[zoom:0.7] max-[380px]:[zoom:0.62]", announce && "translate-y-1")}>
            <QueensLogo
              cosmetics={face === "cosmetics"}
              variant={logoVariant}
              size={89}
              priority
            />
          </Link>

          <nav
            aria-label="Principal"
            className={cn(
              "hidden items-center",
              face === "cosmetics" ? "xl:flex xl:-translate-x-6 xl:gap-4 min-[1440px]:gap-6" : "lg:flex lg:gap-5 xl:gap-8",
            )}
          >
            {links.map((l) => (
              <NavItem
                key={l.category ?? l.href}
                href={l.href}
                label={l.label}
                onClick={(e) => openCategory(l, e)}
                className={cn(
                  "text-sm font-semibold transition-all relative group whitespace-nowrap",
                  ((l.category && l.category === markedCategory) || (!l.category && l.href === `#${activeSection}`)) && "font-bold",
                  overHero ? "text-current" : linkTone,
                )}
                underline={cn(
                  "absolute bottom-[-4px] left-0 h-[2px] transition-all duration-300 group-hover:w-full",
                  (l.category && l.category === markedCategory) || (!l.category && l.href === `#${activeSection}`) ? "w-full" : "w-0",
                  overHero ? "bg-current" : lilaTop ? "bg-[var(--ink)]" : s.underline,
                )}
              />
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            {face === "cosmetics" && (
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  // Not on phones (client request): there the header keeps the search, the cart and the menu; Instagram is in the footer
                  "relative -mr-1.5 rounded-full p-2 sm:p-2.5 opacity-80 transition cursor-pointer hover:opacity-100 focus-visible:opacity-100 max-md:hidden",
                  overHero ? "text-current hover:bg-current/10" : lilaTop ? "text-ink hover:bg-ink/10" : "text-ink hover:bg-(--face-light)/30",
                )}
                aria-label={`Instagram ${BUSINESS.instagram}`}
                data-testid="header-instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {face === "cosmetics" && (
              <button
                type="button"
                onClick={() => setSearchOpen((o) => !o)}
                className={cn(
                  "relative rounded-full p-2 sm:p-2.5 transition cursor-pointer",
                  overHero ? "text-current hover:bg-current/10" : lilaTop ? "text-ink hover:bg-ink/10" : "text-ink hover:bg-(--face-light)/30",
                )}
                aria-label="Buscar productos"
                aria-expanded={searchOpen}
                data-testid="search-trigger"
              >
                <Search className="h-5 w-5" />
                {query.trim() !== "" && (
                  <span className={cn("absolute right-1.5 top-1.5 h-2 w-2 rounded-full", lilaTop ? "bg-[var(--ink)]" : "bg-[var(--face-deep)]")} />
                )}
              </button>
            )}
            {face === "cosmetics" && cart && (
              <button
                type="button"
                onClick={cart.openCart}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full p-2 sm:p-2.5 transition cursor-pointer",
                  overHero ? "text-current hover:bg-current/10" : lilaTop ? "text-ink hover:bg-ink/10" : "text-ink hover:bg-(--face-light)/30",
                )}
                aria-label={`Carrito con ${cart.count} items`}
                data-testid="cart-trigger"
                data-cart-target=""
              >
                <ShoppingBag className="h-5 w-5" />
                {/* The count sits beside the bag in parentheses, "(0)", always visible (client's reference) */}
                <span key={cart.count} aria-hidden className="translate-y-[2px] text-[15px] font-semibold leading-none [font-variant-numeric:lining-nums] motion-safe:animate-fade-up">
                  ({cart.count})
                </span>
              </button>
            )}

            {spaIcons && (
              <>
              <a
                href={VENUES.spa.gmaps}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-full p-2 sm:p-2.5 text-ink opacity-80 transition cursor-pointer hover:bg-(--face-light)/30 hover:opacity-100 focus-visible:opacity-100"
                aria-label={"Cómo llegar a Queens Spa en Google Maps"}
                data-testid="header-map"
              >
                <MapPin className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-full p-2 sm:p-2.5 text-ink opacity-80 transition cursor-pointer hover:bg-(--face-light)/30 hover:opacity-100 focus-visible:opacity-100"
                aria-label={`Instagram ${BUSINESS.instagram}`}
                data-testid="header-instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={WA_SPA}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-full p-2 sm:p-2.5 text-ink opacity-80 transition cursor-pointer hover:bg-(--face-light)/30 hover:opacity-100 focus-visible:opacity-100"
                aria-label={"Reservar cita por WhatsApp"}
                data-testid="header-cta"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              </>
            )}

            <button
              type="button"
              className={cn(inlineNav === "xl" ? "xl:hidden" : "lg:hidden", "rounded-full p-2 transition cursor-pointer sm:ml-2.5", overHero ? "text-current" : linkTone)}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

      {/* Search box (store only): drops under the header */}
      {face === "cosmetics" && (
        <div
          className={cn(
            "absolute inset-x-0 top-full z-30 bg-[var(--crema)] shadow-[0_18px_30px_-20px_rgba(30,15,34,0.35)] transition-all duration-300",
            searchOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-3 opacity-0 pointer-events-none",
          )}
          aria-hidden={!searchOpen}
        >
          <form
            role="search"
            className="mx-auto flex max-w-3xl items-center gap-2 px-5 py-4"
            onSubmit={(e) => { e.preventDefault(); scrollToCatalog() }}
          >
            <div className="relative flex-1 bg-[color-mix(in_oklab,var(--face-light)_28%,transparent)] focus-within:bg-[color-mix(in_oklab,var(--face-light)_50%,transparent)]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink)]/70" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false) }}
                placeholder="Busca en toda la tienda…"
                aria-label="Buscar productos"
                tabIndex={searchOpen ? 0 : -1}
                data-testid="search-input"
                className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm text-[var(--ink)] placeholder:text-[11.5px] placeholder:uppercase placeholder:tracking-[0.16em] placeholder:text-[var(--ink)]/55 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => (query ? onSearchChange("") : setSearchOpen(false))}
              tabIndex={searchOpen ? 0 : -1}
              className="cursor-pointer px-3 py-3.5 text-[11.5px] uppercase tracking-[0.16em] text-[var(--ink)] hover:opacity-70"
            >
              {query ? "Limpiar" : "Cerrar"}
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu. Closed it is only faded out, so `inert` keeps its links out of the Tab order and the screen-reader tree (like the search box above) */}
      <div
        inert={!mobileOpen}
        className={cn(
          "inset-x-0 z-30 transition-all duration-400",
          inlineNav === "xl" ? "xl:hidden" : "lg:hidden",
          separate ? "absolute top-full" : "fixed top-[72px]",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        <nav aria-label="Menú" className={cn("mx-4 max-h-[calc(100svh-var(--header-h)-1rem)] overflow-y-auto rounded-2xl p-5 shadow-2xl md:backdrop-blur-xl", s.panel)}>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.category ?? l.href}>
                <NavItem
                  href={l.href}
                  label={l.label}
                  onClick={(e) => { openCategory(l, e); setMobileOpen(false) }}
                  className={cn("block rounded-xl px-4 py-3 text-base font-medium transition", s.panelLink)}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </header>
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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
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
