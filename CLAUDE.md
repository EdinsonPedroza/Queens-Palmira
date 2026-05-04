# Queens Cosmetics — Configuración del proyecto

> **Hereda:** `../CLAUDE.md` (plantilla general del workspace de landings)
> **Ver:** `memory/PRD.md` para brief completo, paleta, secciones y catálogo

## Descripción

Landing page premium con carrito de compras para **Queens Cosmetics**, tienda de cosméticos en Unicentro Palmira. Estilo femenino luxury (rosa pastel + dorado). Checkout vía WhatsApp.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Lenguaje:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (tokens OKLCH en `@theme inline`)
- **UI:** Radix UI (dialog, tabs, accordion, tooltip, scroll-area)
- **Animaciones:** Framer Motion
- **Íconos:** Lucide React
- **Fuentes:** next/font → Playfair Display, Outfit, Inter, Cormorant Garamond
- **Estado:** React Context + localStorage (carrito persistente)
- **Package manager:** npm (sigue `package-lock.json`)

## Comandos

```bash
npm install      # Instalar dependencias
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Production build
npm start        # Correr build en local
npm run lint     # ESLint
```

## ⚠️ Gotcha conocido — env vars contaminadas

Este equipo tiene variables de entorno heredadas (via VS Code / Electron) que contaminan builds de Next.js:

- `__NEXT_PRIVATE_STANDALONE_CONFIG` (JSON de otro proyecto "codegpt-nextjs")
- `__NEXT_PRIVATE_ORIGIN`
- `NEXT_DEPLOYMENT_ID`
- `NODE_ENV=production` (hace que `npm install` omita devDependencies como `@tailwindcss/postcss`)

**Si `npm run build` falla con** `"generate is not a function"` **o** `"Cannot find module '@tailwindcss/postcss'"`, limpia el entorno:

```bash
unset __NEXT_PRIVATE_STANDALONE_CONFIG __NEXT_PRIVATE_ORIGIN NEXT_DEPLOYMENT_ID NODE_ENV
NODE_ENV=development npm install --include=dev
npm run build
```

## Estructura

```
Queens Palmira/
├── app/
│   ├── layout.tsx            # Fonts + metadata + CartProvider
│   ├── page.tsx              # Home (compone secciones con dynamic import)
│   └── globals.css           # Tailwind v4 + tokens OKLCH
├── components/
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── marquee.tsx
│   │   ├── stats.tsx
│   │   ├── catalog.tsx       # Tabs + product grid
│   │   ├── why-queens.tsx
│   │   ├── gallery.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── cta.tsx
│   │   ├── location.tsx
│   │   └── footer.tsx
│   ├── ui/                   # Radix primitivos (shadcn-style)
│   ├── navbar.tsx
│   ├── intro-screen.tsx
│   ├── cart-sidebar.tsx
│   ├── product-card.tsx
│   ├── whatsapp-button.tsx
│   └── scroll-progress.tsx
├── context/
│   └── cart-context.tsx      # useCart, addItem, removeItem, etc.
├── lib/
│   ├── utils.ts              # cn()
│   ├── products.ts           # Catálogo completo tipado
│   └── whatsapp.ts           # Helper para generar mensaje del carrito
├── public/
│   └── images/               # Productos, hero, gallery
├── memory/
│   └── PRD.md                # Brief del proyecto
├── CLAUDE.md                 # Este archivo
├── package.json
├── tsconfig.json
└── vercel.json
```

## Paleta (tokens)

Ver `memory/PRD.md` para HEX → OKLCH. Uso en Tailwind:

- `bg-primary` → rosa pastel `#FFB6C1`
- `bg-accent` / `text-accent` → dorado `#D4AF37`
- `text-foreground` → negro suave `#2C1810`
- `bg-background` → blanco `#FFFFFF`
- `bg-pink-hot` → rosa intenso `#FF69B4` (custom utility para CTAs urgentes)
- `bg-gradient-queens` → gradiente rosa→dorado (custom utility)

## Convenciones específicas

- **Todas las CTAs de compra** pasan por el carrito, excepto el botón "Contáctanos" que abre WhatsApp directo.
- **Precios en COP** siempre formateados con punto (`$45.000`), no coma.
- **`data-testid`** en botones de "Agregar al carrito", cart trigger y checkout.
- **Imágenes de producto:** formato cuadrado 1:1, mínimo 600px, `next/image` con `sizes`.
- **Placeholders:** Unsplash con query `cosmetics,beauty,makeup` hasta tener fotos reales.

## Deploy

Vercel. Sin backend. Push a `main` → auto-deploy.

## Notas

- El local está en Unicentro Palmira (Local 128). El mapa de la sección ubicación apunta a ese centro comercial.
- Instagram `@queenscosmeticss` es la fuente visual de referencia.
- El catálogo está inventado (ver PRD sección "Catálogo Inventado"). Remplazar con productos reales cuando la clienta los entregue.
