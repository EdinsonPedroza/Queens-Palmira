"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { m, AnimatePresence } from "framer-motion"
import { ArrowUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard, CARD_GRID } from "@/components/product-card"
import { CategoryBar, CONTROL_BG, CONTROL_HOVER, CONTROL_TEXT } from "@/components/sections/catalog"
import { CATEGORIES, getProductsByCategory, type Product, type ProductCategory } from "@/lib/products"
import { cn } from "@/lib/utils"

/*
 * Vista temporal: qué hacer al final de la rejilla cuando hay MUCHOS productos (Línea Capilar tiene 75).
 * Cuando el cliente elija, se pasa a catalog.tsx y se borran este archivo y app/cosmetics/ver-mas.
 */
type VariantId = "actual" | "barra" | "paginas" | "auto" | "tipos"

/* 20 por tanda: con 5 columnas (y con 2 en celular) las filas quedan completas; con 12 la última fila quedaba con 2 fichas. "Actual" conserva los 12 de hoy. */
const PAGE = 20
const CURRENT_PAGE = 12
const AUTO_BATCHES = 2
const stepOf = (v: VariantId) => (v === "actual" ? CURRENT_PAGE : PAGE)
const EASE = [0.16, 1, 0.3, 1] as const

const VARIANTS: { id: VariantId; label: string; note: string }[] = [
  { id: "actual",  label: "Actual",     note: "Como está hoy: barrita redondeada de progreso y un botón redondo con sombra. Con 75 productos son 6 clics y la página crece sin parar." },
  { id: "barra",   label: "Barra",      note: "El mismo \"Ver más\" con el estilo del resto de controles: barra recta lila suave, contador y progreso pegado al borde. Al final, \"Ya viste todo\"." },
  { id: "paginas", label: "Páginas",    note: "Páginas numeradas: la página no crece, el pie siempre queda cerca y se puede saltar de una a otra. Al cambiar de página sube a la rejilla." },
  { id: "auto",    label: "Automático", note: "Las primeras tandas cargan solas al llegar al final (hasta 40); después aparece la barra, para que el pie de página no quede lejísimos." },
  { id: "tipos",   label: "Por tipo",   note: "Para categorías grandes: filtros por tipo de producto (Shampoo, Tintes…) sobre la rejilla, más la barra. Se llega rápido a lo que se busca." },
]

/* Tipos de producto de la vista previa, deducidos del nombre (y de la descripción si el nombre no basta). Gana la primera regla que coincida. */
const TYPE_RULES: Partial<Record<ProductCategory, { id: string; label: string; re: RegExp }[]>> = {
  capilar: [
    { id: "shampoo", label: "Shampoo",        re: /shampoo|champ/i },
    { id: "acond",   label: "Acondicionador", re: /acondicionador/i },
    { id: "tintes",  label: "Tintes y color", re: /tinte|decolor|oxigenada|oxy cream|recamier deco|color 1|cubre canas|bleach/i },
    { id: "trat",    label: "Tratamientos",   re: /tratamiento|mascarilla|ampolleta|cristal|nikols|cpc|t[óo]nico|keratin|hidratante|repair|detox/i },
    { id: "peinado", label: "Peinado",        re: /laca|crema para peinar|espuma|encrespador|fijaci/i },
    { id: "acc",     label: "Accesorios",     re: /cepillo|kanekalon|ganchos|ligas|rulos|kit/i },
  ],
  rostro: [
    { id: "base",      label: "Bases",             re: /^base/i },
    { id: "corrector", label: "Correctores",       re: /^corrector/i },
    { id: "polvos",    label: "Polvos",            re: /^polvo (suelto|compacto)/i },
    { id: "rubor",     label: "Rubor y contorno",  re: /rubor|blush|contorno|bronzer|ilumin|highlighter|hadas/i },
    { id: "acc",       label: "Fijador y brochas", re: /fijador|blender|brocha|kit/i },
  ],
  ojos: [
    { id: "cejas",    label: "Cejas",                re: /cejas|henna|pomada/i },
    { id: "pest",     label: "Pestañinas",           re: /pesta[ñn]ina/i },
    { id: "postizas", label: "Pestañas y pegantes",  re: /pesta[ñn]as|pestana|pegante/i },
    { id: "delin",    label: "Delineador y sombras", re: /delineador|l[áa]piz|paleta|sombras/i },
  ],
  skincare: [
    { id: "facial", label: "Cuidado facial",   re: /micelar|exfoliante|t[óo]nico|mascarilla|gel facial|hialur[óo]nico|vit[úu]|vibrante/i },
    { id: "solar",  label: "Solar y bronceado", re: /protector solar|bronceador|autobronceador/i },
    { id: "cuerpo", label: "Cuerpo",            re: /antistr|depilatoria|piel de oro/i },
    { id: "barber", label: "Barbería",          re: /barber|afeitar|talco|after shave/i },
  ],
}

function typeOf(cat: ProductCategory, p: Product): string {
  const rules = TYPE_RULES[cat] ?? []
  const hit = rules.find((r) => r.re.test(p.name)) ?? rules.find((r) => r.re.test(`${p.name} ${p.description}`))
  return hit?.id ?? "otros"
}

/* 1 … 4 5 6 … 12: always the first, the last and the neighbours of the current page. */
function pageNumbers(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const out: (number | "…")[] = [1]
  const from = Math.max(2, page - 1)
  const to = Math.min(pages - 1, page + 1)
  if (from > 2) out.push("…")
  for (let n = from; n <= to; n++) out.push(n)
  if (to < pages - 1) out.push("…")
  out.push(pages)
  return out
}

/* ─── Pies de la rejilla ───────────────────────────────────── */
/* Como está hoy, para comparar. */
function CurrentMore({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  const step = CURRENT_PAGE
  return (
    <div className="mt-12 flex flex-col items-center gap-3">
      <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-[var(--face-light)]/40">
        <m.div className="h-full rounded-full bg-queens-gradient-intense" animate={{ width: `${(shown / total) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">Mostrando {shown} de {total}</p>
      <button
        type="button"
        onClick={onMore}
        data-testid="more-current"
        className="flex cursor-pointer items-center gap-2 rounded-2xl bg-[var(--face)] px-10 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[var(--face-deep)]"
      >
        <ChevronDown className="h-5 w-5" />
        Ver {Math.min(total - shown, step)} más
      </button>
    </div>
  )
}

/* "Ver más" con el estilo de los controles del catálogo: recto, lila suave, la acción en tinta. */
function MoreBar({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  return (
    <div className="mx-auto mt-12 max-w-[940px]">
      <div className={cn("relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5 pl-5 pr-3.5 sm:pl-6", CONTROL_BG)}>
        <p className="text-[12px] uppercase tracking-[0.14em] text-[var(--ink)]">
          Viendo <strong className="font-bold tabular-nums">{shown}</strong> de <span className="tabular-nums">{total}</span>
          <span className="hidden sm:inline"> productos</span>
        </p>
        <button
          type="button"
          onClick={onMore}
          data-testid="more-bar"
          className={cn(
            CONTROL_TEXT,
            "flex w-full cursor-pointer items-center justify-center gap-2.5 bg-[var(--ink)] px-6 py-3.5 text-[var(--crema)] transition-colors hover:bg-[var(--face-deep)] sm:w-auto",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]",
          )}
        >
          Ver {Math.min(total - shown, PAGE)} más
          <ChevronDown className="h-4 w-4" />
        </button>
        {/* Progress: a thin line along the bottom edge of the bar */}
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-[color-mix(in_oklab,var(--ink)_9%,transparent)]">
          <m.span className="block h-full bg-[var(--face)]" initial={false} animate={{ width: `${(shown / total) * 100}%` }} transition={{ duration: 0.4, ease: EASE }} />
        </span>
      </div>
    </div>
  )
}

function EndNote({ total, onTop }: { total: number; onTop: () => void }) {
  return (
    <div className="mx-auto mt-12 max-w-[940px]">
      <div className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5 pl-5 pr-3.5 sm:pl-6", CONTROL_BG)}>
        <p className="text-[12px] uppercase tracking-[0.14em] text-[var(--ink)]">
          Ya viste los <strong className="font-bold tabular-nums">{total}</strong> productos
        </p>
        <button
          type="button"
          onClick={onTop}
          data-testid="more-top"
          className={cn(CONTROL_TEXT, "flex cursor-pointer items-center gap-2.5 px-5 py-3.5 text-[var(--ink)] transition-colors", CONTROL_HOVER)}
        >
          Volver arriba
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function Pager({ page, pages, total, onPage }: { page: number; pages: number; total: number; onPage: (n: number) => void }) {
  const cell = "grid h-12 min-w-12 cursor-pointer place-items-center px-3 text-[12px] tabular-nums tracking-[0.1em] text-[var(--ink)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-(--face)"
  return (
    <nav aria-label="Páginas del catálogo" className="mt-12 flex flex-col items-center gap-3">
      <div className={cn("flex max-w-full overflow-x-auto [scrollbar-width:none]", CONTROL_BG)}>
        <button type="button" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Página anterior" data-testid="page-prev" className={cn(cell, CONTROL_HOVER, "disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent")}>
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageNumbers(page, pages).map((n, i) =>
          n === "…" ? (
            <span key={`gap-${i}`} aria-hidden className="grid h-12 min-w-8 place-items-center text-[var(--ink)]/60">…</span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPage(n)}
              aria-label={`Página ${n}`}
              aria-current={n === page ? "page" : undefined}
              data-testid={`page-${n}`}
              className={cn(cell, n === page ? "bg-[var(--ink)] text-[var(--crema)]" : CONTROL_HOVER)}
            >
              {n}
            </button>
          ),
        )}
        <button type="button" onClick={() => onPage(page + 1)} disabled={page === pages} aria-label="Página siguiente" data-testid="page-next" className={cn(cell, CONTROL_HOVER, "disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent")}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">
        Mostrando <span className="tabular-nums">{(page - 1) * PAGE + 1}–{Math.min(page * PAGE, total)}</span> de {total}
      </p>
    </nav>
  )
}

/* Las primeras tandas cargan solas; después la barra, para que el pie de página siga al alcance. */
function AutoMore({ shown, total, onMore, onTop }: { shown: number; total: number; onMore: () => void; onTop: () => void }) {
  const sentinel = useRef<HTMLDivElement>(null)
  const auto = shown < Math.min(total, PAGE * AUTO_BATCHES)

  useEffect(() => {
    const el = sentinel.current
    if (!auto || !el) return
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) onMore() }, { rootMargin: "500px 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [auto, shown, onMore])

  if (shown >= total) return <EndNote total={total} onTop={onTop} />
  if (!auto) return <MoreBar shown={shown} total={total} onMore={onMore} />
  return (
    <div ref={sentinel} role="status" aria-label="Cargando más productos" className="mt-12 flex items-center justify-center gap-2.5 py-6">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2.5 w-2.5 animate-pulse bg-[var(--face)]" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
      <span className={cn(CONTROL_TEXT, "ml-1 text-[var(--ink)]/70")}>Cargando más</span>
    </div>
  )
}

function TypeChips({ types, value, total, onChange }: { types: { id: string; label: string; n: number }[]; value: string; total: number; onChange: (id: string) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Tipo de producto"
      className="mx-auto mb-2 mt-3 flex max-w-[940px] gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible"
    >
      {[{ id: "todo", label: "Todo", n: total }, ...types].map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          data-testid={`type-${t.id}`}
          className={cn(
            "flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[11px] uppercase tracking-[0.12em] transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-(--face)",
            value === t.id ? "bg-[var(--ink)] text-[var(--crema)]" : [CONTROL_BG, CONTROL_HOVER, "text-[var(--ink)]"],
          )}
        >
          {t.label}
          <span className="text-[10px] tabular-nums opacity-55">{t.n}</span>
        </button>
      ))}
    </div>
  )
}

/* ─── Vista previa ─────────────────────────────────────────── */
export function CatalogMorePreview() {
  const [variant, setVariant] = useState<VariantId>("barra")
  const [cat, setCat]         = useState<ProductCategory>("capilar")
  const [shown, setShown]     = useState(PAGE)
  const [page, setPage]       = useState(1)
  const [type, setType]       = useState("todo")
  const topRef  = useRef<HTMLDivElement>(null)
  const barRef  = useRef<HTMLDivElement>(null)
  const current = VARIANTS.find((v) => v.id === variant)!

  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c.id, getProductsByCategory(c.id).length])), [])
  const list = useMemo(() => getProductsByCategory(cat), [cat])
  const types = useMemo(() => {
    const rules = TYPE_RULES[cat]
    if (!rules) return []
    const by = new Map<string, number>()
    for (const p of list) by.set(typeOf(cat, p), (by.get(typeOf(cat, p)) ?? 0) + 1)
    return [...rules.map((r) => ({ id: r.id, label: r.label })), { id: "otros", label: "Otros" }]
      .map((t) => ({ ...t, n: by.get(t.id) ?? 0 }))
      .filter((t) => t.n > 0)
  }, [cat, list])
  const filtered = useMemo(() => (variant === "tipos" && type !== "todo" ? list.filter((p) => typeOf(cat, p) === type) : list), [variant, type, list, cat])

  const total = filtered.length
  const pages = Math.ceil(total / PAGE)
  const items = variant === "paginas" ? filtered.slice((page - 1) * PAGE, page * PAGE) : filtered.slice(0, shown)
  const step  = stepOf(variant)
  const more  = useCallback(() => setShown((n) => n + step), [step])
  const reset = (v: VariantId = variant) => { setShown(stepOf(v)); setPage(1); setType("todo") }
  const toGrid = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  const toTop  = () => barRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  let footer: ReactNode = null
  if (variant === "actual") footer = shown < total ? <CurrentMore shown={shown} total={total} onMore={more} /> : null
  else if (variant === "barra" || variant === "tipos") footer = total > step ? (shown < total ? <MoreBar shown={shown} total={total} onMore={more} /> : <EndNote total={total} onTop={toTop} />) : null
  else if (variant === "paginas") footer = pages > 1 ? <Pager page={page} pages={pages} total={total} onPage={(n) => { setPage(n); toGrid() }} /> : null
  else if (variant === "auto") footer = total > step ? <AutoMore shown={shown} total={total} onMore={more} onTop={toTop} /> : null

  return (
    <>
      <section id="catalogo" className="relative overflow-hidden bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 pb-24 pt-8 md:pt-10">
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div ref={barRef} className="mx-auto mb-5 max-w-2xl scroll-mt-[calc(var(--nav-h)+1rem)] text-center md:mb-6">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Nuestro catálogo</span>
            <h2 className="font-display font-semibold text-ink" style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}>
              Productos que te harán <span className="text-queens-gradient">sentir única</span>
            </h2>
          </div>

          <CategoryBar active={cat} counts={counts} onSelect={(id) => { setCat(id); reset() }} />
          {variant === "tipos" && types.length > 0 && (
            <TypeChips types={types} value={type} total={list.length} onChange={(id) => { setType(id); setShown(step) }} />
          )}

          <div ref={topRef} className="scroll-mt-[calc(var(--nav-h)+1rem)] pt-6" />
          <AnimatePresence mode="wait">
            <m.div
              key={`${cat}-${type}-${variant === "paginas" ? page : 0}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={`grid ${CARD_GRID.editorial}`}
            >
              {items.map((p, i) => (
                <m.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % PAGE) * 0.04, duration: 0.35, ease: EASE }}>
                  <ProductCard product={p} />
                </m.div>
              ))}
            </m.div>
          </AnimatePresence>

          {footer}
        </div>
      </section>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--crema)]/95 backdrop-blur-md"
        style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
        data-testid="more-switcher"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3">
          <div role="tablist" aria-label="Qué hacer al final de la rejilla" className="flex flex-wrap justify-center gap-1.5">
            {VARIANTS.map((v, i) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={variant === v.id}
                onClick={() => { setVariant(v.id); reset(v.id) }}
                data-testid={`more-${v.id}`}
                style={{ borderColor: variant === v.id ? "var(--ink)" : "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                className={cn(
                  "cursor-pointer border px-3.5 py-1.5 text-[11.5px] uppercase tracking-[0.1em] transition-colors",
                  variant === v.id ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_8%,transparent)]",
                )}
              >
                {i} · {v.label}
              </button>
            ))}
          </div>
          <p className="text-center text-[12px] text-[var(--muted-foreground)]">{current.note}</p>
        </div>
      </div>
    </>
  )
}
