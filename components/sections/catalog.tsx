"use client"

import { useState, useMemo, useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { m, AnimatePresence, useReducedMotion } from "framer-motion"
import { Search, ChevronDown, ArrowUpDown, X } from "lucide-react"
import { ProductCard, CARD_GRID, type CardStyle } from "@/components/product-card"
import { SubcategoryNav } from "@/components/subcategory-nav"
import { SUBCATEGORIES, subcategoryOf } from "@/lib/subcategories"
import { CATEGORIES, PRODUCTS, getProductsByCategory, type ProductCategory } from "@/lib/products"
import { CATEGORY_ACTIVE_EVENT, CATEGORY_EVENT, CATALOG_FILTERS_ID, SEARCH_ACTIVE_EVENT, SEARCH_EVENT } from "@/lib/site"
import { cn, scrollBehavior } from "@/lib/utils"

const PAGE_SIZE = 15

type SortOrder = "default" | "price-asc" | "price-desc"

const SORT_LABELS: Record<SortOrder, string> = {
  default:    "Relevancia",
  "price-asc":  "Menor precio",
  "price-desc": "Mayor precio",
}

/* Controles del catálogo (barra de categorías, buscador, orden): rectángulos rectos, sin líneas, con un
 * fondo lila suave. El estado activo se rellena en tinta con texto crema. */
export const CONTROL_TEXT  = "text-[11.5px] uppercase tracking-[0.16em]"
export const CONTROL_BG    = "bg-[var(--lila)]"
export const CONTROL_HOVER = "hover:bg-[color-mix(in_oklab,var(--lila)_88%,var(--ink))]"
/** Estado activo / elegido: el lila del logo, más oscuro (--lila-deep) con texto crema (≥5:1). Los controles en reposo son el lila del logo (#A48BA6) con texto casi negro. */
/** El buscador y el orden se quedan en el lila suave (pedido del cliente); solo la barra de categorías va en el lila del logo. */
export const CONTROL_SOFT_BG    = "bg-[var(--lila-soft)]"
export const CONTROL_SOFT_HOVER = "hover:bg-[var(--lila-light)]/45"
export const CONTROL_ON    = "bg-[var(--lila-deep)] text-[var(--crema)]"

/* Barra de categorías "subrayado editorial" (elegida por el cliente entre seis versiones): solo texto sobre el crema, con una línea fina
 * lila abajo y, bajo la categoría abierta, una línea gruesa del lila del logo que SE DESLIZA de una a otra (220 ms, ease-in-out fuerte;
 * solo transform) y la categoría en lila oscuro y negrita. Sin números de cantidad (el cliente los quitó). En celular se desplaza de lado y,
 * para que se entienda que hay más (el cliente: «no se entiende si se pueden mover hacia la izquierda»; eligió «se asoma y se difumina»), la categoría
 * siguiente queda medio cortada y el borde se funde con el crema: el difuminado solo sale del lado donde hay más (el derecho al inicio, el izquierdo al
 * desplazarte) y desaparece al llegar al final o cuando todo cabe. Con una búsqueda en toda la tienda no hay categoría activa y la línea gruesa se desvanece. Con "reducir movimiento" no se desliza. */
const TAB_SLIDE = "220ms cubic-bezier(0.77, 0, 0.175, 1)"

export function CategoryBar({ active, onSelect, className }: {
  active: ProductCategory | null
  /** Ya no se muestra (el cliente quitó los números); se acepta para no romper a quien lo pasa. */
  counts?: Record<string, number>
  onSelect: (id: ProductCategory) => void
  className?: string
}) {
  const reduce = useReducedMotion()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const inner = useRef<HTMLDivElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })   // is there more to the left / to the right?
  const last = useRef<ProductCategory>(active ?? CATEGORIES[0].id)  // the line stays where it was while it fades out
  const [bar, setBar] = useState({ x: 0, w: 0 })
  const [ready, setReady] = useState(false)    // no slide on first paint

  const measure = useCallback(() => {
    if (active) last.current = active
    const el = refs.current[last.current]
    if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth })
  }, [active])
  const measureEdges = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const left = el.scrollLeft > 4
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
    setEdges((e) => (e.left === left && e.right === right ? e : { left, right }))
  }, [])
  useLayoutEffect(measure, [measure])
  useLayoutEffect(measureEdges, [measureEdges])
  useEffect(() => {
    const box = inner.current
    const row = scroller.current
    // the fonts loading or the window resizing move the tabs (and change how much fits)
    const ro = new ResizeObserver(() => { measure(); measureEdges() })
    if (box) ro.observe(box)
    if (row) ro.observe(row)
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
    return () => { ro.disconnect(); cancelAnimationFrame(id) }
  }, [measure, measureEdges])

  return (
    <div className={cn("relative mx-auto mb-2 max-w-[940px]", className)}>
    <div
      ref={scroller}
      onScroll={measureEdges}
      role="tablist"
      aria-label="Categorías"
      className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div ref={inner} className="relative flex w-max min-w-full gap-5 pr-14 sm:gap-8 min-[1360px]:pr-0">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--lila-light)]" />
        {CATEGORIES.map((cat) => {
          const on = active === cat.id
          return (
            <button
              key={cat.id}
              ref={(el) => { refs.current[cat.id] = el }}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={(e) => {
                onSelect(cat.id)
                // Centra la elegida moviendo solo esta fila: scrollIntoView también desplazaría
                // la sección y <main> (ambos recortan con overflow).
                const row = e.currentTarget.closest<HTMLElement>('[role="tablist"]')
                if (row) {
                  const c = row.getBoundingClientRect()
                  const r = e.currentTarget.getBoundingClientRect()
                  row.scrollTo({ left: row.scrollLeft + (r.left - c.left) - (c.width - r.width) / 2, behavior: scrollBehavior() })
                }
              }}
              data-testid={`category-${cat.id}`}
              // The same editorial text + sliding line on phones and on computers (the client first picked square bordered tabs for phones, then asked for no boxes: "no les hagas
              // esos recuadros", and less space between them). On phones the row scrolls sideways and the next tab peeks out (see the note above).
              className={cn(
                "flex-none cursor-pointer select-none whitespace-nowrap px-0 pb-3 pt-2.5 text-[1rem] normal-case leading-none tracking-normal transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--face)",
                on ? "font-bold text-[var(--ciruela)]" : "font-semibold text-[var(--lila-deep)] hover:text-[var(--ciruela)]",
              )}
            >
              {cat.label}
            </button>
          )
        })}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-px origin-left bg-[var(--ciruela)]"
          style={{
            transform: `translateX(${bar.x}px) scaleX(${bar.w})`,
            opacity: active ? 1 : 0,
            transition: ready && !reduce ? `transform ${TAB_SLIDE}, opacity 150ms ease-out` : "none",
          }}
        />
      </div>
    </div>
    {/* The soft edges: they only show on the side where there is more (see the note above) */}
    <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--crema)] to-transparent transition-opacity duration-200", edges.right ? "opacity-100" : "opacity-0")} />
    <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--crema)] to-transparent transition-opacity duration-200", edges.left ? "opacity-100" : "opacity-0")} />
    </div>
  )
}

export function Catalog({ cardStyle = "editorial" }: { cardStyle?: CardStyle }) {
  const [active, setActive]         = useState<ProductCategory>("labiales")
  const [search, setSearch]         = useState("")      // the header's magnifier: the whole store
  const [localQuery, setLocalQuery] = useState("")      // the little box in this row: the open category only
  const [sortOrder, setSortOrder]   = useState<SortOrder>("default")
  const [sortOpen, setSortOpen]     = useState(false)
  const [visibleCount, setVisible]  = useState(PAGE_SIZE)
  const [group, setGroup]           = useState<string>("todo")   // subcategory of the open category ("Índice")
  const [searchOpen, setSearchOpen] = useState(false)     // phones: the little search is a magnifier button until it is tapped
  const searchRef = useRef<HTMLInputElement>(null)

  const activeCategory = CATEGORIES.find((c) => c.id === active)!

  /* cantidad por categoría: va en la barra de categorías */
  const categoryCounts = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, getProductsByCategory(c.id).length])),
    [],
  )

  /* Línea Capilar's subcategories (the index to the left of the grid): how many products each one has */
  const defs = SUBCATEGORIES[active]
  const groupItems = useMemo(() => {
    const list = getProductsByCategory(active)
    return [
      { id: "todo", label: "Todo", count: list.length },
      ...(defs ?? []).map((g) => ({ id: g.id, label: g.label, count: list.filter((p) => subcategoryOf(p) === g.id).length })),
    ]
  }, [active, defs])

  /* productos filtrados + ordenados */
  const filtered = useMemo(() => {
    const q    = search.trim().toLowerCase()
    const text = q || localQuery.trim().toLowerCase()   // the store-wide search wins over the category one
    const raw  = q ? PRODUCTS : getProductsByCategory(active)
    const hit  = text
      ? raw.filter((p) => p.name.toLowerCase().includes(text) || p.description.toLowerCase().includes(text))
      : defs && group !== "todo"
        ? raw.filter((p) => subcategoryOf(p) === group)   // a subcategory; any text search looks across the whole category instead
        : raw
    if (sortOrder === "price-asc")  return [...hit].sort((a, b) => a.price - b.price)
    if (sortOrder === "price-desc") return [...hit].sort((a, b) => b.price - a.price)
    return hit
  }, [active, search, localQuery, sortOrder, group, defs])

  const hasGroups = !!defs && !search
  const groupTagline = hasGroups && !localQuery.trim() && group !== "todo" ? defs?.find((g) => g.id === group)?.tagline : undefined

  const visible    = filtered.slice(0, visibleCount)
  const hasMore    = visibleCount < filtered.length
  const remaining  = filtered.length - visibleCount

  const handleCategoryChange = useCallback((id: ProductCategory) => {
    setActive(id)
    setVisible(PAGE_SIZE)
    setSearch("")
    setLocalQuery("")
    setGroup("todo")
  }, [])

  const handleGroup = useCallback((id: string) => {
    setGroup(id)
    setLocalQuery("")
    setVisible(PAGE_SIZE)
  }, [])

  /* Tell the header which category is open (it marks that link) */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(CATEGORY_ACTIVE_EVENT, { detail: active }))
  }, [active])

  /* The header's category links ask for a tab */
  useEffect(() => {
    const onCategory = (e: Event) => {
      const id = (e as CustomEvent<ProductCategory>).detail
      if (CATEGORIES.some((c) => c.id === id)) handleCategoryChange(id)
    }
    window.addEventListener(CATEGORY_EVENT, onCategory)
    return () => window.removeEventListener(CATEGORY_EVENT, onCategory)
  }, [handleCategoryChange])

  const handleSearch = useCallback((val: string) => {
    setSearch(val)
    setVisible(PAGE_SIZE)
  }, [])

  /* The header's search box (the magnifier) types here; and the header mirrors whatever the search text is */
  useEffect(() => {
    const onSearch = (e: Event) => handleSearch((e as CustomEvent<string>).detail ?? "")
    window.addEventListener(SEARCH_EVENT, onSearch)
    return () => window.removeEventListener(SEARCH_EVENT, onSearch)
  }, [handleSearch])
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SEARCH_ACTIVE_EVENT, { detail: search }))
  }, [search])

  /* Tapping the phone's magnifier opens the box and puts the cursor in it */
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleLocalSearch = useCallback((val: string) => {
    setLocalQuery(val)
    setVisible(PAGE_SIZE)
  }, [])

  const clearSearch = useCallback(() => {
    setSearch("")
    setLocalQuery("")
    setVisible(PAGE_SIZE)
  }, [])

  const handleSort = useCallback((s: SortOrder) => {
    setSortOrder(s)
    setSortOpen(false)
    setVisible(PAGE_SIZE)
  }, [])

  return (
    <section
      id="catalogo"
      className="relative scroll-mt-[var(--nav-h)] pt-4 md:pt-5 pb-3 md:pb-4 bg-gradient-to-b from-white to-[var(--dorado-soft)]/20 overflow-clip"
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 -left-20 h-64 w-64 rounded-full bg-[var(--face-light)]/30 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--face)]/20 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">

        {/* ── Header ── */}
        <div className="max-w-3xl text-left mb-4 sm:mb-3">
          {/* On phones (client request): no "Nuestro catálogo" line and the title is just "Categorías", so the tabs under it read as what they are. From md up: as always. */}
          <span className="hidden text-xs font-semibold tracking-[0.3em] uppercase text-[var(--face-deep)] mb-2.5 sm:inline-block">
            Nuestro catálogo
          </span>
          <h2
            className="font-display font-semibold text-ink whitespace-nowrap"
            style={{ fontSize: "clamp(1.45rem, 3vw, 2.2rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
          >
            <span className="sm:hidden">Categorías</span>
            <span className="hidden sm:inline">Productos para reinas</span>
          </h2>
        </div>

        {/* The categories, right above what they show: this is where the header's links land (the bar and the row under it together) */}
        <div id={CATALOG_FILTERS_ID} className="scroll-mt-[calc(var(--nav-h)+var(--search-h,0px)+1rem)]">
          {/* ── The categories (left) and, on the right of the same row, the little search and the sort order. Under 1360px the bar takes the whole row and they drop below it. ── */}
          <div className="flex flex-col gap-3 min-[1360px]:flex-row min-[1360px]:items-end min-[1360px]:justify-between">
            <CategoryBar
              active={search ? null : active}
              counts={categoryCounts}
              onSelect={handleCategoryChange}
              className="mx-0 mb-0 max-w-none min-[1360px]:min-w-0 min-[1360px]:flex-none"
            />
            <div className="flex w-full items-end gap-3 max-sm:items-center max-sm:justify-end max-sm:pt-1 sm:justify-end min-[1360px]:w-auto min-[1360px]:shrink-0">
              {/* Phones: "13 productos" sits at the LEFT of this row, level with the magnifier and the sort button (client request); it steps aside while the search box is open */}
              {!(searchOpen || localQuery) && (
                <span key={filtered.length} className="mr-auto text-xs text-[var(--muted-foreground)] [--in-y:0px] motion-safe:animate-[enter-up_200ms_ease-out_backwards] sm:hidden">
                  {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
              {/* Phones: the search is a magnifier button next to the sort one; tapping it opens the box (below). It stays open while it has text. */}
              {!search && (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label={`Buscar en ${activeCategory.label.toLowerCase()}`}
                  aria-expanded={searchOpen || !!localQuery}
                  data-testid="category-search-toggle"
                  className={cn(
                    "grid h-10 w-10 shrink-0 cursor-pointer place-items-center text-[var(--ciruela)] transition-colors duration-200 hover:bg-[var(--ciruela)]/8 sm:hidden",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--face)",
                    (searchOpen || localQuery) && "hidden",
                  )}
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>
              )}
              {/* The little search: this category only. It steps aside while the header's store-wide search is on. On phones it only shows once the magnifier was tapped. */}
              {!search && (
                <div
                  className={cn(
                    "relative h-10 min-w-0 flex-1 transition-colors duration-200 sm:w-64 sm:flex-none",
                    // The box: a full outline from md up; on phones only a fine line under the text (no box, client request)
                    "shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--ciruela)_38%,transparent)] max-sm:shadow-[inset_0_-1px_0_color-mix(in_oklab,var(--ciruela)_38%,transparent)]",
                    "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--face) max-sm:focus-within:outline-none",
                    !(searchOpen || localQuery) && "max-sm:hidden",
                  )}
                >
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ciruela)]" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={localQuery}
                    onChange={(e) => handleLocalSearch(e.target.value)}
                    onBlur={() => { if (!localQuery) setSearchOpen(false) }}
                    onKeyDown={(e) => { if (e.key === "Escape") handleLocalSearch("") }}
                    placeholder="Buscar…"
                    aria-label={`Buscar en ${activeCategory.label.toLowerCase()}`}
                    data-testid="category-search"
                    className={cn(
                      "h-full w-full bg-transparent pl-10 pr-9 text-sm text-[var(--ink)] focus:outline-none",
                      "placeholder:text-[11.5px] placeholder:uppercase placeholder:tracking-[0.16em] placeholder:text-[var(--ciruela)]/70",
                      "[&::-webkit-search-cancel-button]:hidden",
                    )}
                  />
                  {localQuery && (
                    <button
                      type="button"
                      onClick={() => handleLocalSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--ink)]/60 transition-colors hover:text-[var(--ink)]"
                      aria-label="Limpiar búsqueda"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}


              {/* Sort dropdown */}
              <div className="relative flex">
                <button
                  type="button"
                  onClick={() => setSortOpen((o) => !o)}
                  className={cn(
                    CONTROL_TEXT,
                    "flex h-10 cursor-pointer select-none items-center gap-2.5 whitespace-nowrap px-3.5 transition-colors duration-200 sm:px-4",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--face)",
                    sortOrder !== "default" ? "bg-[var(--ciruela)] font-bold text-[var(--crema)]" : "font-semibold text-[var(--ciruela)] hover:bg-[var(--ciruela)]/8",
                  )}
                  style={{ boxShadow: sortOrder !== "default" ? "none" : "inset 0 0 0 1px color-mix(in oklab, var(--ciruela) 38%, transparent)" }}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  aria-label={`Ordenar: ${SORT_LABELS[sortOrder]}`}
                >
                  <ArrowUpDown className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{SORT_LABELS[sortOrder]}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <m.div
                      role="listbox"
                      aria-label="Ordenar"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[190px] bg-[var(--crema)] shadow-[0_18px_40px_-14px_rgba(30,15,34,0.45)]"
                    >
                      {(Object.entries(SORT_LABELS) as [SortOrder, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          role="option"
                          aria-selected={sortOrder === key}
                          onClick={() => handleSort(key)}
                          className={cn(
                            CONTROL_TEXT,
                            "w-full cursor-pointer px-5 py-3.5 text-left transition-colors",
                            sortOrder === key ? CONTROL_ON : ["text-[var(--ink)]", CONTROL_HOVER],
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* ── Metadata row: the category's phrase, and how many products ── */}
          {/* On phones the row is empty unless there is a search (the count moved up to the controls row), so it is gone then */}
          <div className={cn("mb-6 mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 max-sm:mt-3 max-sm:mb-4", !(search || localQuery.trim()) && "max-sm:hidden")}>
            {/* The category's phrase, in semi-bold. Its name is the highlighted tab right above, so no title is repeated here (client request, final). */}
            <div className={cn("flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1", !(search || localQuery.trim()) && "max-sm:hidden")}>
              {/* On phones the phrase ("Besos de seda y color"…) is gone (client request); the results line still shows when there is a search */}
              <AnimatePresence mode="wait">
                <m.p
                  key={active + search + localQuery + group + "-tag"}
                  // The entrance is CSS (see "enter-up" in globals.css): Framer's own one blinked for a frame when it ended. Framer keeps the exit.
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--face-deep)] [--in-y:4px] motion-safe:animate-[enter-up_200ms_ease-out_backwards]"
                  data-testid="category-subtitle"
                >
                  {search || localQuery.trim()
                    ? `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} para "${search || localQuery.trim()}"`
                    : groupTagline ?? activeCategory.tagline}
                </m.p>
              </AnimatePresence>
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="cursor-pointer text-xs uppercase tracking-[0.16em] text-[var(--ink)] underline underline-offset-4 decoration-[var(--face-deep)]/50 hover:decoration-[var(--face-deep)]"
                >
                  Limpiar
                </button>
              )}
            </div>

            <span key={filtered.length} className="text-xs text-[var(--muted-foreground)] [--in-y:0px] motion-safe:animate-[enter-up_200ms_ease-out_backwards] max-sm:hidden">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </span>


          </div>
        </div>

        {/* ── Grid animado ── */}
        {/* Cambiar de categoría es de las acciones más repetidas: la rejilla se reemplaza al instante (sin esperar a que salga la
            anterior) y solo las tarjetas entran, escalonadas y rápidas. */}
        {/* Línea Capilar: the subcategory index sits to the left of the grid (chips under the header on phones) and the grid shows one subcategory at a time */}
        <div className={cn(hasGroups && "lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-8")}>
          {hasGroups && <SubcategoryNav items={groupItems} value={localQuery.trim() ? null : group} onChange={handleGroup} />}
          <div className="min-w-0">
          {visible.length === 0 ? (
            <div key="empty" className="py-24 text-center [--in-y:0px] motion-safe:animate-[enter-up_200ms_cubic-bezier(0.23,1,0.32,1)_backwards]">
              <Search className="mx-auto mb-4 h-10 w-10 text-[var(--muted-foreground)]" />
              <p className="font-display text-xl font-semibold text-[var(--ink)] mb-2">
                Sin resultados
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Intenta con otro término o{" "}
                <button
                  type="button"
                  className="text-[var(--face-deep)] underline underline-offset-2 cursor-pointer"
                  onClick={clearSearch}
                >
                  limpia la búsqueda
                </button>
              </p>
            </div>
          ) : (
            <div key={active + group + "-grid"} className={cn("grid", CARD_GRID[cardStyle], hasGroups && "lg:grid-cols-4 xl:grid-cols-4")}>
              {visible.map((p, i) => (
                <div
                  key={p.id}
                  // The cards enter in a quick stagger (30 ms apart, the first eight). CSS, not Framer: see "enter-up" in globals.css.
                  className="motion-safe:animate-[enter-up_250ms_cubic-bezier(0.23,1,0.32,1)_backwards]"
                  style={{ animationDelay: `${Math.min(i, 7) * 30}ms` }}
                >
                  <ProductCard product={p} cardStyle={cardStyle} />
                </div>
              ))}
              {/* "Ver más" is one more square of the grid: translucent lila (see-through, ink text), the number of products left, nothing else (client's pick, "ficha tinta") */}
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisible((n) => n + PAGE_SIZE)}
                  aria-label={`Ver ${Math.min(remaining, PAGE_SIZE)} productos más`}
                  data-testid="load-more"
                  style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--lila) 45%, transparent)" }}
                  className="group relative aspect-square w-full cursor-pointer self-start bg-[color-mix(in_oklab,var(--lila)_26%,transparent)] text-[var(--ink)] backdrop-blur-sm transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--lila)_42%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--face)"
                >
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <span className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-none transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110">+{remaining}</span>
                    <span className="text-[10.5px] uppercase tracking-[0.22em]">productos</span>
                  </span>
                </button>
              )}
            </div>
          )}
          </div>
        </div>

      </div>
    </section>
  )
}
