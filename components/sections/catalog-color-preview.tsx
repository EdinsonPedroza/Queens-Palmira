"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Catalog } from "@/components/sections/catalog"

/*
 * Vista temporal para comparar DÓNDE van los colores en el catálogo (la paleta es la misma).
 * No toca catalog.tsx ni product-card.tsx: cada idea es una capa de CSS que se activa con
 * data-ct en el contenedor. Cuando el cliente elija una, se pasa a los componentes y se borran
 * este archivo y app/cosmetics/colores.
 */
type ThemeId = "actual" | "losa" | "noche" | "banda" | "tarjetas" | "tinta" | "lavado"

const THEMES: { id: ThemeId; label: string; note: string }[] = [
  { id: "actual",   label: "Actual",          note: "Como está hoy: fondo crema, barra lila suave, activa en tinta, foto sobre seda rosa." },
  { id: "losa",     label: "Losa lila",       note: "Todo el catálogo sobre una losa lila. Las fichas son tarjetas crema; la barra y los campos, crema." },
  { id: "noche",    label: "Noche ciruela",   note: "Fondo oscuro (el del footer) con fichas en ciruela suave; lila como acento y botón. Es un bloque oscuro nuevo en la tienda." },
  { id: "banda",    label: "Banda lila",      note: "Solo la zona de control (barra, buscador, orden) va en una banda lila de lado a lado; abajo, crema limpio." },
  { id: "tarjetas", label: "Fichas lila",     note: "Crema de fondo; la foto del producto sobre un panel lila liso, etiqueta en tinta y botón lila relleno." },
  { id: "tinta",    label: "Tinta protagonista", note: "Controles y botones en tinta oscura; el lila queda solo como activo y acento. Contraste editorial." },
  { id: "lavado",   label: "Lavado suave",    note: "Fondo con un lavado lila muy claro y fichas crema elevadas con sombra suave; activo y botón en lila." },
]

const P = '.ct:not([data-ct="actual"])'
const CARD = `${P} [data-testid^="product-"]`

const BASE = `
${P} #catalogo { background: var(--t-bg); }
${P} #catalogo > div[aria-hidden] { display: var(--t-blobs); }
${P} #catalogo > .relative > div:first-child > span { color: var(--t-eyebrow); }
${P} #catalogo h2 { color: var(--t-h2); }
${P} #catalogo h2 .text-queens-gradient { background: none; color: var(--t-h2em); -webkit-text-fill-color: var(--t-h2em); }

${P} [role="tablist"] { background: var(--t-bar-bg); }
${P} [role="tablist"] button { background: transparent; color: var(--t-bar-text); }
${P} [role="tablist"] button:hover { background: var(--t-bar-hover); }
${P} [role="tablist"] button[aria-selected="true"] { background: var(--t-tab-on-bg); color: var(--t-tab-on-text); }

${P} [data-testid="category-subtitle"] { color: var(--t-meta); }
${P} #catalogo-filtros span[class*="text-xs"] { color: var(--t-meta); }
${P} #catalogo-filtros button.underline { color: var(--t-meta); }
${P} #catalogo-filtros div:has(> [data-testid="category-search"]) { background: var(--t-field-bg); }
${P} #catalogo-filtros div:has(> [data-testid="category-search"]) svg { color: var(--t-field-text); }
${P} [data-testid="category-search"] { color: var(--t-field-text); }
${P} [data-testid="category-search"]::placeholder { color: var(--t-field-text); opacity: .6; }
${P} #catalogo-filtros button[aria-haspopup="listbox"] { background: var(--t-field-bg); color: var(--t-field-text); }

${CARD} { background: var(--t-card-bg); padding: var(--t-card-pad); box-shadow: var(--t-card-shadow); }
${CARD} > div:first-child { background: var(--t-photo-bg); }
${CARD} > div:first-child > img[aria-hidden],
${CARD} > div:first-child > span[aria-hidden] { display: var(--t-stage); }
${CARD} > div:not(:first-child):not(.flex-1) { background: var(--t-strip-bg); color: var(--t-strip-text); }
${CARD} > div.flex-1 { padding-inline: var(--t-card-px); }
${CARD} h3 { color: var(--t-card-text); }
${CARD} p { color: var(--t-card-muted); }
${CARD} span[class*="text-[14px]"] { color: var(--t-price); }
${CARD} [data-testid^="add-"] { background: var(--t-btn-bg); color: var(--t-btn-text); }
${CARD} [data-testid^="add-"]:hover { background: var(--t-btn-hover-bg); color: var(--t-btn-hover-text); }

${P} #catalogo button.rounded-2xl { background: var(--t-more-bg); color: var(--t-more-text); }
`

const CREMA = "var(--crema)"
const INK = "var(--ink)"
const FACE = "var(--face)"
const NIGHT = "var(--ciruela-deep)"
const NIGHT_SOFT = "var(--ciruela-soft)"

/* Valores por defecto = el aspecto actual; cada idea pisa solo lo que cambia. */
const DEFAULTS = `
  --t-bg: ${CREMA}; --t-blobs: none;
  --t-eyebrow: var(--face-deep); --t-h2: ${INK}; --t-h2em: var(--face-deep);
  --t-bar-bg: color-mix(in oklab, var(--face-light) 28%, transparent); --t-bar-text: ${INK};
  --t-bar-hover: color-mix(in oklab, var(--face-light) 50%, transparent);
  --t-tab-on-bg: ${INK}; --t-tab-on-text: ${CREMA};
  --t-meta: var(--face-deep); --t-field-bg: color-mix(in oklab, var(--face-light) 28%, transparent); --t-field-text: ${INK};
  --t-card-bg: transparent; --t-card-pad: 0; --t-card-px: 0; --t-card-shadow: none; --t-photo-bg: transparent; --t-stage: block;
  --t-card-text: ${INK}; --t-card-muted: color-mix(in oklab, ${INK} 80%, transparent); --t-price: ${INK};
  --t-strip-bg: color-mix(in oklab, var(--face-light) 55%, ${CREMA}); --t-strip-text: var(--face-deep);
  --t-btn-bg: transparent; --t-btn-text: ${INK}; --t-btn-hover-bg: ${INK}; --t-btn-hover-text: ${CREMA};
  --t-more-bg: ${FACE}; --t-more-text: ${INK};
`

const BOXED = `--t-card-bg: ${CREMA}; --t-card-pad: 0 0 14px; --t-card-px: 12px;`

const THEME_CSS = `
.ct { ${DEFAULTS} }

.ct[data-ct="losa"] {
  --t-bg: ${FACE}; --t-eyebrow: ${INK}; --t-h2em: ${CREMA};
  --t-bar-bg: ${CREMA}; --t-bar-hover: color-mix(in oklab, var(--face-light) 45%, ${CREMA});
  --t-meta: ${INK}; --t-field-bg: ${CREMA};
  ${BOXED} --t-card-shadow: 0 10px 24px -14px rgba(30,15,34,.45);
  --t-btn-hover-bg: ${INK};
  --t-more-bg: ${INK}; --t-more-text: ${CREMA};
}

.ct[data-ct="noche"] {
  --ink: oklch(0.995 0.022 106.8);
  --muted-foreground: color-mix(in oklab, oklch(0.995 0.022 106.8) 72%, transparent);
  --face-deep: var(--lila-light);
  --t-bg: ${NIGHT}; --t-blobs: block;
  --t-eyebrow: var(--lila-light); --t-h2: oklch(0.995 0.022 106.8); --t-h2em: var(--lila-light);
  --t-bar-bg: ${NIGHT_SOFT}; --t-bar-text: oklch(0.995 0.022 106.8); --t-bar-hover: color-mix(in oklab, ${FACE} 30%, ${NIGHT_SOFT});
  --t-tab-on-bg: ${FACE}; --t-tab-on-text: ${NIGHT};
  --t-meta: var(--lila-light); --t-field-bg: ${NIGHT_SOFT}; --t-field-text: oklch(0.995 0.022 106.8);
  --t-card-bg: ${NIGHT_SOFT}; --t-card-pad: 0 0 14px; --t-card-px: 12px;
  --t-card-text: oklch(0.995 0.022 106.8); --t-card-muted: color-mix(in oklab, oklch(0.995 0.022 106.8) 72%, transparent); --t-price: oklch(0.995 0.022 106.8);
  --t-strip-bg: ${FACE}; --t-strip-text: ${NIGHT};
  --t-btn-bg: ${FACE}; --t-btn-text: ${NIGHT}; --t-btn-hover-bg: oklch(0.995 0.022 106.8); --t-btn-hover-text: ${NIGHT};
  --t-more-bg: ${FACE}; --t-more-text: ${NIGHT};
}
.ct[data-ct="noche"] [data-testid^="product-"] > div:first-child > div span { color: ${NIGHT}; }
.ct[data-ct="noche"] #catalogo-filtros button[aria-haspopup="listbox"] { background: ${NIGHT_SOFT}; }

.ct[data-ct="banda"] {
  --t-bar-bg: ${CREMA}; --t-bar-hover: color-mix(in oklab, var(--face-light) 45%, ${CREMA});
  --t-meta: ${INK}; --t-field-bg: ${CREMA};
}
.ct[data-ct="banda"] #catalogo-filtros {
  background: ${FACE}; box-shadow: 0 0 0 100vmax ${FACE}; clip-path: inset(0 -100vmax); padding-block: 22px 2px;
}
.ct[data-ct="banda"] #catalogo-filtros + div { margin-top: 3rem; }

.ct[data-ct="tarjetas"] {
  --t-bar-bg: transparent; --t-bar-hover: color-mix(in oklab, var(--face-light) 45%, transparent);
  --t-tab-on-bg: ${FACE}; --t-tab-on-text: ${INK};
  --t-field-bg: color-mix(in oklab, var(--face-light) 40%, transparent);
  --t-stage: none; --t-photo-bg: var(--face-light);
  --t-strip-bg: ${INK}; --t-strip-text: ${CREMA};
  --t-btn-bg: ${FACE}; --t-btn-text: ${INK}; --t-btn-hover-bg: ${INK}; --t-btn-hover-text: ${CREMA};
}

.ct[data-ct="tinta"] {
  --t-bar-bg: ${INK}; --t-bar-text: ${CREMA}; --t-bar-hover: ${NIGHT_SOFT};
  --t-tab-on-bg: ${FACE}; --t-tab-on-text: ${INK};
  --t-field-bg: ${INK}; --t-field-text: ${CREMA};
  --t-strip-bg: ${INK}; --t-strip-text: ${CREMA};
  --t-btn-bg: ${INK}; --t-btn-text: ${CREMA}; --t-btn-hover-bg: ${FACE}; --t-btn-hover-text: ${INK};
  --t-more-bg: ${INK}; --t-more-text: ${CREMA};
}

.ct[data-ct="lavado"] {
  --t-bg: color-mix(in oklab, var(--face-light) 38%, ${CREMA});
  --t-bar-bg: ${CREMA}; --t-bar-hover: color-mix(in oklab, var(--face-light) 45%, ${CREMA});
  --t-tab-on-bg: ${FACE}; --t-tab-on-text: ${INK};
  --t-field-bg: ${CREMA};
  ${BOXED} --t-card-shadow: 0 14px 30px -18px rgba(70,38,73,.5);
  --t-btn-bg: ${FACE}; --t-btn-text: ${INK}; --t-btn-hover-bg: ${INK}; --t-btn-hover-text: ${CREMA};
}
`

export function CatalogColorPreview() {
  const [theme, setTheme] = useState<ThemeId>("actual")
  const current = THEMES.find((t) => t.id === theme)!

  return (
    <>
      <style>{BASE + THEME_CSS}</style>
      <div className="ct" data-ct={theme}>
        <Catalog />
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-[var(--crema)]/95 backdrop-blur-md"
        style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
        data-testid="color-switcher"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-3">
          <div role="tablist" aria-label="Idea de color" className="flex flex-wrap justify-center gap-1.5">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={theme === t.id}
                onClick={() => setTheme(t.id)}
                data-testid={`color-${t.id}`}
                style={{ borderColor: theme === t.id ? "var(--ink)" : "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                className={cn(
                  "cursor-pointer border px-3.5 py-1.5 text-[11.5px] uppercase tracking-[0.1em] transition-colors",
                  theme === t.id ? "bg-[var(--ink)] text-[var(--crema)]" : "text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--ink)_8%,transparent)]",
                )}
              >
                {i} · {t.label}
              </button>
            ))}
          </div>
          <p className="text-center text-[12px] text-[var(--muted-foreground)]">{current.note}</p>
        </div>
      </div>
    </>
  )
}
