"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { m, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Plus, ShoppingBag } from "lucide-react"
import {
  ProductCard, ToneMenu, InCartChip, PriceLine, RatingRow, useCardState, type CardState,
} from "@/components/product-card"
import { useCart } from "@/context/cart-context"
import { flyToCart } from "@/lib/cart-fx"
import { CATEGORIES, getProductsByCategory, type Product, type ProductCategory } from "@/lib/products"
import { CATEGORY_ACTIVE_EVENT, CATEGORY_EVENT } from "@/lib/site"
import { cn, formatCOP } from "@/lib/utils"

/*
 * Vista temporal: cinco DISEÑOS del catálogo (cómo se organiza, no solo el color). Todos usan los
 * productos, el carrito y los tonos reales. Cuando el cliente elija uno, se pasa a catalog.tsx y se
 * borran este archivo, catalog-layout-preview.tsx y app/cosmetics/disenos.
 */

const PAGE = 12
const LINE = "color-mix(in oklab, var(--ink) 16%, transparent)"
const EASE = [0.16, 1, 0.3, 1] as const

/* ─── Piezas comunes ───────────────────────────────────────── */
function useCategory() {
  const [active, setActive] = useState<ProductCategory>("labiales")
  const [shown, setShown]   = useState(PAGE)
  const select = useCallback((id: ProductCategory) => { setActive(id); setShown(PAGE) }, [])

  /* Los enlaces del header piden una categoría */
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<ProductCategory>).detail
      if (CATEGORIES.some((c) => c.id === id)) select(id)
    }
    window.addEventListener(CATEGORY_EVENT, on)
    return () => window.removeEventListener(CATEGORY_EVENT, on)
  }, [select])
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(CATEGORY_ACTIVE_EVENT, { detail: active }))
  }, [active])

  const list = useMemo(() => getProductsByCategory(active), [active])
  const cat  = CATEGORIES.find((c) => c.id === active)!
  return { active, cat, select, list, visible: list.slice(0, shown), more: shown < list.length, showMore: () => setShown((n) => n + PAGE) }
}

/* Una ficha propia: trae su estado y el desplegable de tonos, así cada diseño dibuja solo lo suyo. */
function Tile({ product, children }: { product: Product; children: (s: CardState) => ReactNode }) {
  const s = useCardState(product)
  return (
    <>
      {children(s)}
      {(product.variants?.length ?? 0) > 1 && (
        <ToneMenu variants={product.variants!} selected={s.selected} counts={s.inCart.byTone} onSelect={s.pick} open={s.open} onClose={s.close} triggerRef={s.triggerRef} />
      )}
    </>
  )
}

function Heading({ eyebrow = "Nuestro catálogo", children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">{eyebrow}</span>
      <h2 className="font-display font-semibold text-ink" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}>{children}</h2>
    </div>
  )
}

/* Pestañas de texto con una línea que se dibuja bajo la activa. */
function TextTabs({ active, onSelect }: { active: ProductCategory; onSelect: (id: ProductCategory) => void }) {
  return (
    <div role="tablist" aria-label="Categorías" className="mb-8 flex flex-wrap justify-center gap-x-7 gap-y-2 md:mb-10">
      {CATEGORIES.map((c) => {
        const on = active === c.id
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onSelect(c.id)}
            data-testid={`category-${c.id}`}
            className={cn(
              "relative cursor-pointer pb-2 text-[12px] uppercase tracking-[0.18em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--face)",
              on ? "text-[var(--ink)]" : "text-[var(--muted-foreground)] hover:text-[var(--ink)]",
            )}
          >
            {c.label}
            <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[var(--face)] transition-transform duration-300" style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }} />
          </button>
        )
      })}
    </div>
  )
}

function MoreButton({ onClick, left }: { onClick: () => void; left: number }) {
  return (
    <div className="mt-12 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="flex cursor-pointer items-center gap-2 bg-[var(--face)] px-9 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--crema)]"
      >
        <ChevronDown className="h-4 w-4" /> Ver {Math.min(left, PAGE)} más
      </button>
    </div>
  )
}

/* Botón redondo "+" (mismo comportamiento que el botón principal: elige tono o agrega). */
function RoundAdd({ s, product, className }: { s: CardState; product: Product; className?: string }) {
  const { triggerRef, onAction, canAdd, open, selected, justAdded } = s
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={onAction}
      aria-haspopup={!canAdd ? "listbox" : undefined}
      aria-expanded={!canAdd ? open : undefined}
      aria-label={!canAdd ? `Elegir tono de ${product.name}` : `Agregar ${product.name}${selected ? ` — ${selected}` : ""} al carrito`}
      data-testid={`add-${product.name}`}
      className={cn(
        "grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--face)",
        justAdded ? "bg-[var(--ink)] text-[var(--crema)]" : "bg-[var(--face)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--crema)]",
        className,
      )}
    >
      {justAdded ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Plus className={cn("h-4 w-4 transition-transform", open && "rotate-45")} strokeWidth={2} />}
    </button>
  )
}

/* ═══ 1 · CARRILES ═══════════════════════════════════════════
 * Todas las categorías a la vista, una debajo de otra, cada una en un carril que se desliza de lado.
 * Colores: las franjas alternan crema y lila suave. "Ver todo" abre la categoría completa. */
function Rail({ index, id }: { index: number; id: ProductCategory }) {
  const cat = CATEGORIES.find((c) => c.id === id)!
  const all = useMemo(() => getProductsByCategory(id), [id])
  const [open, setOpen] = useState(false)
  const row = useRef<HTMLDivElement>(null)
  const tinted = index % 2 === 1

  const slide = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" })

  return (
    <section
      id={`carril-${id}`}
      className="relative py-10 md:py-14"
      style={{ background: tinted ? "color-mix(in oklab, var(--face-light) 32%, var(--crema))" : "transparent" }}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">{String(index + 1).padStart(2, "0")} · {all.length} productos</p>
            <h3 className="mt-1 font-display font-bold text-ink" style={{ fontSize: "clamp(1.7rem, 3.6vw, 2.6rem)", letterSpacing: "-0.02em" }}>{cat.label}</h3>
            <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{cat.tagline}</p>
          </div>
          <div className="flex items-center gap-2">
            {!open && (
              <div className="hidden gap-1.5 md:flex">
                <button type="button" onClick={() => slide(-1)} aria-label="Anterior" className="grid h-10 w-10 cursor-pointer place-items-center bg-[var(--ink)] text-[var(--crema)] transition-colors hover:bg-[var(--face)] hover:text-[var(--ink)]"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={() => slide(1)} aria-label="Siguiente" className="grid h-10 w-10 cursor-pointer place-items-center bg-[var(--ink)] text-[var(--crema)] transition-colors hover:bg-[var(--face)] hover:text-[var(--ink)]"><ChevronRight className="h-5 w-5" /></button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="cursor-pointer px-1 py-2 text-[12px] uppercase tracking-[0.16em] text-[var(--ink)] underline decoration-[var(--face)] decoration-2 underline-offset-[6px] hover:decoration-[var(--ink)]"
            >
              {open ? "Ver menos" : "Ver todo"}
            </button>
          </div>
        </div>

        {open ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
            {all.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div
            ref={row}
            className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 gap-3 overflow-x-auto px-6 pb-3 md:-mx-10 md:scroll-pl-10 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {all.slice(0, 10).map((p) => (
              <div key={p.id} className="w-[44vw] max-w-[230px] shrink-0 snap-start sm:w-[230px]"><ProductCard product={p} /></div>
            ))}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid w-[44vw] max-w-[230px] shrink-0 cursor-pointer snap-start place-items-center bg-[var(--face)] p-6 text-center text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--crema)] sm:w-[230px]"
            >
              <span className="flex flex-col items-center gap-3">
                <ArrowRight className="h-6 w-6" />
                <span className="font-display text-xl font-bold leading-tight">Ver las {all.length} de {cat.label}</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export function LayoutRails() {
  return (
    <section id="catalogo" className="scroll-mt-[var(--nav-h)] pb-10 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10"><Heading>Todo Queens, <span className="text-queens-gradient">de un vistazo</span></Heading></div>
      {CATEGORIES.map((c, i) => <Rail key={c.id} index={i} id={c.id} />)}
    </section>
  )
}

/* ═══ 2 · MOSAICO ════════════════════════════════════════════
 * Rejilla tipo bento: cada siete fichas hay una grande (2×2) en un bloque de color sólido —
 * lila, luego tinta—, y las demás son fichas normales. El color marca el ritmo de la rejilla. */
function BigTile({ product, dark }: { product: Product; dark: boolean }) {
  return (
    <Tile product={product}>
      {(s) => {
        const bg = dark ? "var(--ink)" : "var(--face)"
        const fg = dark ? "var(--crema)" : "var(--ink)"
        return (
          <article
            className="group relative flex h-full min-h-[28rem] flex-col gap-4 p-5 md:p-7"
            style={{ background: bg, color: fg }}
            data-testid={`product-${product.id}`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-80">
              {s.discount > 0 ? `Ahorra ${s.discount}%` : s.badge?.text ?? "Destacado"}
            </span>
            <div className="relative min-h-[15rem] flex-1">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 520px"
                className="object-contain drop-shadow-[0_14px_16px_rgba(30,12,36,0.35)] transition-transform duration-700 group-hover:scale-[1.05]"
                style={product.imageStyle}
              />
              <InCartChip count={s.inCart.total} className="right-0 top-0" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl" style={{ letterSpacing: "-0.02em" }}>{product.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm opacity-85">{product.description}</p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                {s.discount > 0 && <p className="text-xs line-through opacity-70">{formatCOP(product.originalPrice!)}</p>}
                <p className="font-display text-2xl font-bold">{formatCOP(product.price)}</p>
              </div>
              <button
                ref={s.triggerRef}
                type="button"
                onClick={s.onAction}
                aria-haspopup={!s.canAdd ? "listbox" : undefined}
                aria-expanded={!s.canAdd ? s.open : undefined}
                data-testid={`add-${product.name}`}
                className="flex cursor-pointer items-center gap-2 px-5 py-3 text-[11.5px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-85"
                style={{ background: fg, color: bg }}
              >
                {s.justAdded && !s.open ? <><Check className="h-4 w-4 shrink-0" strokeWidth={2.5} /><span className="truncate">Agregado{s.lastTone ? ` · ${s.lastTone}` : ""}</span></> : !s.canAdd ? <>Elige un tono<ChevronDown className="h-4 w-4" /></> : <><ShoppingBag className="h-4 w-4" />Agregar</>}
              </button>
            </div>
          </article>
        )
      }}
    </Tile>
  )
}

export function LayoutMosaic() {
  const c = useCategory()
  return (
    <section id="catalogo" className="scroll-mt-[var(--nav-h)] pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Heading>{c.cat.tagline}</Heading>
        <TextTabs active={c.active} onSelect={c.select} />
        <AnimatePresence mode="wait">
          <m.div
            key={c.active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid grid-flow-dense grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4"
          >
            {c.visible.map((p, i) =>
              i % 7 === 0 ? (
                <div key={p.id} className="col-span-2 row-span-2"><BigTile product={p} dark={Math.floor(i / 7) % 2 === 1} /></div>
              ) : (
                <div key={p.id}><ProductCard product={p} /></div>
              ),
            )}
          </m.div>
        </AnimatePresence>
        {c.more && <MoreButton onClick={c.showMore} left={c.list.length - c.visible.length} />}
      </div>
    </section>
  )
}

/* ═══ 3 · CARTA ══════════════════════════════════════════════
 * Como la carta de un restaurante: filas con miniatura, nombre, línea punteada y precio, y un "+".
 * Compacta y rápida de recorrer en celular. El color: lila en el título gigante, en el "+" y al pasar el mouse. */
function MenuRow({ product }: { product: Product }) {
  return (
    <Tile product={product}>
      {(s) => (
        <li
          className="group flex items-center gap-3.5 px-2 py-3.5 transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--face-light)_30%,transparent)] md:gap-4 md:px-3"
          style={{ borderBottom: `1px solid ${LINE}` }}
          data-testid={`product-${product.id}`}
        >
          <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden bg-[color-mix(in_oklab,var(--face-light)_38%,var(--crema))] md:h-20 md:w-20">
            <Image src={product.image} alt={product.name} fill sizes="80px" className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-110" style={product.imageStyle} />
            <InCartChip count={s.inCart.total} className="right-0.5 top-0.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline">
              <h3 className="line-clamp-2 min-w-0 text-[12.5px] font-bold uppercase leading-snug tracking-[0.03em] text-[var(--ink)]">{product.name}</h3>
              <span className="mx-2 mb-1 min-w-4 flex-1 self-end" style={{ borderBottom: "1.5px dotted color-mix(in oklab, var(--ink) 40%, transparent)" }} aria-hidden />
              <span className="shrink-0 text-[14px] font-semibold text-[var(--ink)]">{formatCOP(product.price)}</span>
            </div>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[var(--muted-foreground)]">{product.description}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3">
              {s.badge && <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--face-deep)]">{s.discount > 0 ? `Ahorra ${s.discount}%` : s.badge.text}</span>}
              {product.rating != null && <RatingRow rating={product.rating} reviews={product.reviews} />}
            </div>
          </div>
          <RoundAdd s={s} product={product} />
        </li>
      )}
    </Tile>
  )
}

export function LayoutMenu() {
  const c = useCategory()
  return (
    <section id="catalogo" className="scroll-mt-[var(--nav-h)] pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <TextTabs active={c.active} onSelect={c.select} />
        <AnimatePresence mode="wait">
          <m.div key={c.active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
              <h2
                className="font-display font-bold text-[var(--face-deep)]"
                style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
              >
                {c.cat.label}
              </h2>
              <p className="pb-2 text-sm uppercase tracking-[0.14em] text-[var(--ink)]">{c.cat.tagline} · {c.list.length} productos</p>
            </div>
            <div style={{ borderTop: "2px solid var(--ink)" }} />
            <ul className="grid gap-x-12 md:grid-cols-2">
              {c.visible.map((p) => <MenuRow key={p.id} product={p} />)}
            </ul>
          </m.div>
        </AnimatePresence>
        {c.more && <MoreButton onClick={c.showMore} left={c.list.length - c.visible.length} />}
      </div>
    </section>
  )
}

/* ═══ 4 · VITRINA ════════════════════════════════════════════
 * Un producto a la vez, grande, como en un escaparate: foto en arco, datos, todos los tonos a la vista
 * como fichas y una tira de miniaturas para cambiar. El color: arco lila, botón lila, miniatura activa con aro lila. */
function Spotlight({ product, label, index, total, onStep }: { product: Product; label: string; index: number; total: number; onStep: (d: 1 | -1) => void }) {
  const { addItem, items } = useCart()
  const [selected, setSelected] = useState(product.variants?.length === 1 ? product.variants[0] : "")
  const [added, setAdded] = useState(false)
  const hasVariants = (product.variants?.length ?? 0) > 0
  const canAdd = !hasVariants || selected !== ""
  const discount = product.originalPrice && product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  const inCartTotal = items.reduce((sum, l) => (l.product.id === product.id ? sum + l.qty : sum), 0)

  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canAdd) return
    addItem(product.id, selected || undefined)
    flyToCart(e.currentTarget)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14" data-testid={`product-${product.id}`}>
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem]">
        <div className="absolute inset-0 rounded-t-full" style={{ border: "1px solid var(--face)" }} aria-hidden />
        <div className="absolute inset-[9px] overflow-hidden rounded-t-full bg-[color-mix(in_oklab,var(--face-light)_45%,var(--crema))]">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 80vw, 420px" priority className="object-contain px-10 pb-12 pt-14 drop-shadow-[0_14px_14px_rgba(60,25,70,0.28)]" style={product.imageStyle} />
        </div>
        <InCartChip count={inCartTotal} className="right-[8%] top-[24%]" />
        {(product.badge || discount > 0) && (
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[var(--ink)] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[var(--crema)]">
            {discount > 0 ? `Ahorra ${discount}%` : product.badge === "nuevo" ? "Nuevo" : product.badge === "bestseller" ? "Bestseller" : "Oferta"}
          </span>
        )}
      </div>

      <div className="text-center md:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">{label} · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
        <h3 className="mt-2 font-display font-bold text-ink" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.05, letterSpacing: "-0.025em" }}>{product.name}</h3>
        <p className="mt-3 max-w-md text-[15px] text-[var(--muted-foreground)] md:max-w-none">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-start">
          <PriceLine product={product} discount={discount} className="[&_span]:text-2xl" />
          {product.rating != null && <RatingRow rating={product.rating} reviews={product.reviews} />}
        </div>

        {hasVariants && (product.variants?.length ?? 0) > 1 && (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">Tono{selected ? `: ${selected}` : ""}</p>
            <div className="flex max-h-32 flex-wrap justify-center gap-1.5 overflow-y-auto md:justify-start">
              {product.variants!.map((v) => {
                const on = selected === v
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelected(v)}
                    aria-pressed={on}
                    style={{ boxShadow: `inset 0 0 0 1px ${on ? "var(--ink)" : LINE}` }}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 text-[11px] uppercase leading-none tracking-[0.06em] transition-colors",
                      on ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--face-light)_45%,transparent)]",
                    )}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <button
            type="button"
            onClick={add}
            disabled={!canAdd}
            data-testid={`add-${product.name}`}
            className={cn(
              "flex min-w-[15rem] cursor-pointer items-center justify-center gap-2 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed",
              added ? "bg-[var(--ink)] text-[var(--crema)]" : canAdd ? "bg-[var(--face)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--crema)]" : "bg-[color-mix(in_oklab,var(--face-light)_50%,var(--crema))] text-[var(--ink)]/60",
            )}
          >
            {added ? <><Check className="h-4 w-4" strokeWidth={2.5} />Agregado</> : <><ShoppingBag className="h-4 w-4" />{canAdd ? "Agregar al carrito" : "Elige un tono"}</>}
          </button>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => onStep(-1)} aria-label="Producto anterior" className="grid h-[3.25rem] w-[3.25rem] cursor-pointer place-items-center bg-[var(--ink)] text-[var(--crema)] transition-colors hover:bg-[var(--face)] hover:text-[var(--ink)]"><ArrowLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => onStep(1)} aria-label="Producto siguiente" className="grid h-[3.25rem] w-[3.25rem] cursor-pointer place-items-center bg-[var(--ink)] text-[var(--crema)] transition-colors hover:bg-[var(--face)] hover:text-[var(--ink)]"><ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LayoutShowcase() {
  const c = useCategory()
  const [i, setI] = useState(0)
  const strip = useRef<HTMLDivElement>(null)
  // Back to the first product whenever the category changes (adjusted while rendering, not in an effect: no extra commit)
  const [seenCategory, setSeenCategory] = useState(c.active)
  if (seenCategory !== c.active) { setSeenCategory(c.active); setI(0) }
  const product = c.list[Math.min(i, c.list.length - 1)]
  const step = (d: 1 | -1) => setI((n) => (n + d + c.list.length) % c.list.length)

  /* Centra la miniatura activa moviendo solo la tira (no la página) */
  useEffect(() => {
    const row = strip.current
    const el = row?.children[i] as HTMLElement | undefined
    if (!row || !el) return
    const a = row.getBoundingClientRect()
    const b = el.getBoundingClientRect()
    row.scrollTo({ left: row.scrollLeft + (b.left - a.left) - (a.width - b.width) / 2, behavior: "smooth" })
  }, [i, c.active])

  return (
    <section id="catalogo" className="scroll-mt-[var(--nav-h)] pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <TextTabs active={c.active} onSelect={c.select} />
        {product && (
          <AnimatePresence mode="wait">
            <m.div key={product.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>
              <Spotlight product={product} label={c.cat.label} index={i} total={c.list.length} onStep={step} />
            </m.div>
          </AnimatePresence>
        )}
        <div ref={strip} className="mt-10 flex gap-2.5 overflow-x-auto p-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="listbox" aria-label="Productos de la categoría">
          {c.list.map((p, n) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={n === i}
              aria-label={p.name}
              onClick={() => setI(n)}
              style={{ boxShadow: n === i ? "0 0 0 2px var(--face)" : "none" }}
              className={cn(
                "relative h-[5.5rem] w-[5.5rem] shrink-0 cursor-pointer bg-[color-mix(in_oklab,var(--face-light)_38%,var(--crema))] transition-opacity",
                n === i ? "opacity-100" : "opacity-70 hover:opacity-100",
              )}
            >
              <Image src={p.image} alt="" fill sizes="88px" className="object-contain p-1.5" style={p.imageStyle} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══ 5 · PORTADA DE CATEGORÍA ═══════════════════════════════
 * Cada categoría abre con una losa lila grande: el nombre en tamaño enorme, la frase, las pestañas en crema
 * y tres productos asomando. Debajo, la rejilla sobre crema. El color se concentra arriba, el catálogo respira. */
export function LayoutCover() {
  const c = useCategory()
  const peek = c.list.slice(0, 3)
  return (
    <section id="catalogo" className="scroll-mt-[var(--nav-h)] pb-20">
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-[var(--face)] md:rounded-b-[4rem]">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 pb-10 pt-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:px-10 md:pb-14 md:pt-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--ink)]">Nuestro catálogo</p>
            <AnimatePresence mode="wait">
              <m.div key={c.active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
                <h2 className="mt-2 font-display font-bold text-[var(--ink)]" style={{ fontSize: "clamp(3.2rem, 11vw, 8.5rem)", lineHeight: 0.92, letterSpacing: "-0.035em" }}>{c.cat.label}</h2>
                <p className="mt-3 text-lg text-[var(--ink)] md:text-xl">{c.cat.tagline} <span className="opacity-70">· {c.list.length} productos</span></p>
              </m.div>
            </AnimatePresence>
            <div role="tablist" aria-label="Categorías" className="mt-7 flex flex-wrap gap-2">
              {CATEGORIES.map((k) => {
                const on = c.active === k.id
                return (
                  <button
                    key={k.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => c.select(k.id)}
                    data-testid={`category-${k.id}`}
                    className={cn(
                      "cursor-pointer px-4 py-2.5 text-[11.5px] uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]",
                      on ? "bg-[var(--ink)] text-[var(--crema)]" : "bg-[var(--crema)] text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--crema)_70%,var(--face-light))]",
                    )}
                  >
                    {k.label}
                  </button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <m.div key={c.active} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="hidden items-end justify-center gap-2 md:flex" aria-hidden>
              {peek.map((p, n) => (
                <div key={p.id} className="relative h-[17rem] w-[9rem]" style={{ transform: `rotate(${(n - 1) * 7}deg) translateY(${n === 1 ? "-14px" : "6px"})` }}>
                  <Image src={p.image} alt="" fill sizes="144px" className="object-contain drop-shadow-[0_16px_14px_rgba(40,15,50,0.4)]" style={p.imageStyle} />
                </div>
              ))}
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10 md:px-10 md:pt-14">
        <AnimatePresence mode="wait">
          <m.div
            key={c.active + "-grid"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-5 xl:mx-auto xl:max-w-[1200px]"
          >
            {c.visible.map((p) => <ProductCard key={p.id} product={p} />)}
          </m.div>
        </AnimatePresence>
        {c.more && <MoreButton onClick={c.showMore} left={c.list.length - c.visible.length} />}
      </div>
    </section>
  )
}
