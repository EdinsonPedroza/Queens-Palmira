"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { QueensLogo } from "./queens-logo"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { WA_VISIT } from "@/lib/whatsapp"

const NAV_LINKS = [
  { href: "#catalogo",          label: "Catálogo" },
  { href: "#catalogo-digital",  label: "Cat. Virtual" },
  { href: "#por-que",           label: "Por qué Queens" },
  { href: "#galeria",           label: "Galería" },
  { href: "#ubicacion",         label: "Ubicación" },
]

export function Navbar() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(255,105,180,0.25)]"
            : "bg-black/30 backdrop-blur-sm border-b border-white/10",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 py-4">
          <Link href="#hero" aria-label="Queens Cosmetics inicio">
            <QueensLogo />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm font-medium transition-colors relative group",
                  scrolled
                    ? "text-(--ink)/80 hover:text-gold-deep"
                    : "text-white/90 hover:text-gold drop-shadow-sm"
                )}
              >
                {l.label}
                <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 bg-queens-gradient-intense transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className={cn(
                "relative rounded-full p-2.5 transition",
                scrolled
                  ? "text-ink hover:bg-(--rose-pastel)/30"
                  : "text-white hover:bg-white/15"
              )}
              aria-label={`Carrito con ${count} items`}
              data-testid="cart-trigger"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--rose-hot)] text-[10px] font-bold text-white shadow-md animate-fade-up">
                  {count}
                </span>
              )}
            </button>

            <Button
              asChild
              variant="gold"
              size="sm"
              className="hidden md:inline-flex"
            >
              <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
                Visítanos
              </a>
            </Button>

            <button
              type="button"
              className={cn(
                "lg:hidden rounded-full p-2 transition",
                scrolled ? "text-ink" : "text-white"
              )}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
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
        <nav className="mx-4 rounded-2xl bg-white/95 backdrop-blur-xl p-5 shadow-2xl">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-[var(--ink)] hover:bg-[var(--rose-pastel)]/30"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-3">
              <Button asChild variant="gold" size="lg" className="w-full">
                <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
                  Visítanos
                </a>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
