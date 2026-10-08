# Queens Cosmetics — Configuración del proyecto

> **Hereda:** `../CLAUDE.md` (plantilla general del workspace de landings)
> **Ver:** `memory/PRD.md` para brief completo, paleta, secciones y catálogo

## Descripción

Sitio premium de **Queens** en Palmira. La marca tiene **dos personalidades en dos sedes distintas**, y el sitio está armado como un portal de dos puertas:

| Ruta | Cara | Sede | Estética | Conversión |
|---|---|---|---|---|
| `/` | **Portal** | — | Split rosa/noir | Elegir puerta |
| `/cosmetics` | **Lado A** — tienda | Local 128, Unicentro Palmira | Blanco / rosa / dorado | Carrito → checkout WhatsApp |
| `/spa` | **Lado B** — spa | Cra 25 #11-23 | Noir / dorado, editorial | Reserva directa por WhatsApp |

El portal solo muestra el hero partido (cada mitad es una puerta clickeable) y **las dos ubicaciones** en un mapa único con dos pines. **No lleva carrito ni catálogo.**

**Header del portal: solo "Quiénes somos" y "Ubicaciones"**, sin botón de reserva (el cliente sintió ruido visual). No le agregues links ni CTA. `/quienes-somos` es la página cálida (luz suave, fotos tipo instantánea, `face="about"`); vive en la misma pestaña, mientras que `/spa` y `/cosmetics` abren en pestaña nueva (`faceLinkProps` en `lib/site.ts`).

> ⚠️ **No son el mismo local.** Hubo una versión del sitio que asumía que compartían sede; si ves copy del tipo "mismo local" o "entras por la misma puerta", es texto viejo y está mal.

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

**`NODE_ENV=development` es solo para el `npm install`.** Si lo dejas puesto durante `npm run build`, Turbopack no resuelve `next/font/google` y el build muere con ~10 errores de `Can't resolve '@vercel/turbopack-next/internal/font/google/font'`. Parece un problema de red o de fuentes, pero es el `NODE_ENV`: quítalo y el build pasa.

## Estructura

```
Queens Palmira/
├── app/
│   ├── layout.tsx            # Fonts + metadata + CartProvider
│   ├── page.tsx              # Portal: hero puertas + personalities + location + footer
│   ├── cosmetics/page.tsx    # Lado A: tienda (con carrito)
│   ├── spa/page.tsx          # Lado B: spa (sin carrito)
│   └── globals.css           # Tailwind v4 + tokens OKLCH
├── components/
│   ├── sections/
│   │   ├── hero.tsx             # PORTAL: split + 2 puertas (Link overlays)
│   │   ├── locations.tsx        # PORTAL: las 2 sedes, un mapa cada una
│   │   ├── cosmetics-hero.tsx   # /cosmetics
│   │   ├── catalog.tsx          # Tabs + product grid
│   │   ├── why-queens.tsx
│   │   ├── digital-catalog.tsx
│   │   ├── gallery.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   ├── cta.tsx
│   │   ├── spa-hero.tsx         # /spa — todo lo spa-* es noir/dorado
│   │   ├── spa-rituals.tsx
│   │   ├── spa-gallery.tsx
│   │   ├── spa-testimonials.tsx
│   │   ├── spa-faq.tsx
│   │   ├── spa-cta.tsx
│   │   ├── marquee.tsx          # prop face: "cosmetics" | "spa"
│   │   ├── location.tsx         # prop face — una sede, tema claro u oscuro
│   │   └── footer.tsx           # prop face — columnas por cara
│   ├── map-react-leaflet.tsx # prop venue — pin, popup y link de Maps
│   ├── ui/                   # Radix primitivos (shadcn-style)
│   ├── navbar.tsx            # prop face — estilo, links y carrito por cara
│   ├── intro-screen.tsx      # solo en el portal
│   ├── cart-sidebar.tsx
│   ├── product-card.tsx
│   ├── whatsapp-float.tsx
│   └── scroll-progress.tsx
├── context/
│   └── cart-context.tsx      # useCart, addItem, removeItem, etc.
├── lib/
│   ├── utils.ts              # cn()
│   ├── site.ts               # VENUES (las 2 sedes), BUSINESS, NAV_LINKS
│   ├── products.ts           # Catálogo completo tipado
│   └── whatsapp.ts           # Helper para generar mensaje del carrito
├── public/
│   └── images/               # products/, spa/, catalog_pages/
├── memory/
│   └── PRD.md                # Brief del proyecto
├── CLAUDE.md                 # Este archivo
├── package.json
├── tsconfig.json
└── vercel.json
```

**Regla de oro al tocar secciones compartidas:** `navbar`, `footer`, `location` y `marquee` reciben `face` (`"portal" | "cosmetics" | "spa"`). Direcciones, horarios, coordenadas, links de Maps, nav links y contacto viven **solo** en `lib/site.ts` — no los dupliques ni los hardcodees en componentes.

## Paleta (tokens)

Ver `memory/PRD.md` para HEX → OKLCH. Uso en Tailwind:

- `bg-primary` → rosa pastel `#FFB6C1`
- `bg-accent` / `text-accent` → dorado `#D4AF37`
- `text-foreground` → negro suave `#2C1810`
- `bg-background` → blanco `#FFFFFF`
- `bg-pink-hot` → rosa intenso `#FF69B4` (custom utility para CTAs urgentes)
- `bg-gradient-queens` → gradiente rosa→dorado (custom utility)

## Convenciones específicas

- **Cada sede habla solo de sí misma.** `/cosmetics` nombra únicamente Unicentro y `/spa` únicamente la Cra 25. La única excepción es el footer, que lista las dos a propósito para que nadie llegue a la sede equivocada.
- **El carrito vive solo en `/cosmetics`.** El portal y `/spa` no montan `CartFloat`/`CartSidebar` ni el botón de carrito del navbar. El spa convierte por reserva de WhatsApp, no por carrito.
- **Links entre caras:** usa `<Link>` de Next para rutas (`/spa`, `/cosmetics#catalogo`) y `<a href="#...">` para anclas dentro de la misma página. El navbar y el footer ya hacen esa distinción automáticamente.
- **IntroScreen solo en `/`.** Es la entrada del sitio; repetirlo en las páginas internas haría esperar al usuario dos veces.
- **Cada página necesita una sección con `id="hero"`** — el navbar lee ese elemento para saber si va transparente o sólido.
- **El hero del portal revela el servicio con el hover.** Cuando una mitad se agranda, `split` (50 en reposo, 57/43 al hover) alimenta un valor 0→1 por lado: la foto de ese lado se atenúa (velo blanco / noir) y aparece `ServiceNote` con `VENUES.<cara>.service` y un botón "Ver más", todo con el mismo resorte del agrandamiento. La nota está **anclada al bloque del título** (a la izquierda del de Cosmetics, a la derecha del del Spa, a distancia fija) y no al borde de la pantalla, así sigue siendo vecina del título en cualquier ancho. El botón "Ver más" es a propósito distinto de "Visítanos" (píldora con borde fino, relleno que barre de izquierda a derecha y flecha que gira); ambos llevan al mismo sitio, la puerta es toda la mitad. **Solo desde `xl` (≥1280 px):** por debajo no cabe junto al título, y en celulares no hay hover (tocar cualquier mitad ya navega). No lo conviertas en efecto de scroll: se probó y no era lo que se pedía.
- **Nunca pongas `whileInView` en un elemento que arranca fuera de su contenedor `overflow-hidden`.** Es el patrón de titular que sube desde abajo (`initial={{ y: "110%" }}` dentro de un `div` que recorta). Si el elemento está totalmente recortado, el IntersectionObserver lo reporta con intersección 0, la animación nunca dispara y el texto queda invisible para siempre. Pon el `whileInView` en un padre **sin recortar** y mueve al hijo con `variants`. Ya pasó una vez en `location.tsx`.
- **Todas las CTAs de compra** pasan por el carrito, excepto el botón "Contáctanos" que abre WhatsApp directo.
- **Precios en COP** siempre formateados con punto (`$45.000`), no coma.
- **`data-testid`** en botones de "Agregar al carrito", cart trigger y checkout.
- **Imágenes de producto:** formato cuadrado 1:1, mínimo 600px, `next/image` con `sizes`.
- **Placeholders:** Unsplash con query `cosmetics,beauty,makeup` hasta tener fotos reales.

## Deploy

Vercel. Sin backend. Push a `main` → auto-deploy.

## Notas

- **Pin del spa sin confirmar.** El de la tienda sale de un link real de Google Maps. El del spa (`3.509948, -76.2984773`) lo geocodifiqué yo: es el cruce Carrera 25 × Calle 11 según OpenStreetMap, no la puerta exacta. El botón "Cómo llegar" usa una URL de búsqueda de Google por dirección, así que ese sí resuelve bien. **Reemplazar `VENUES.spa.coords` y `VENUES.spa.gmaps` apenas la clienta pase el link de Maps de la sede.**
- Instagram `@queenscosmeticss` es la fuente visual de referencia.
- El catálogo está inventado (ver PRD sección "Catálogo Inventado"). Remplazar con productos reales cuando la clienta los entregue.
- Los rituales, duraciones y testimonios del spa también están inventados. Mismo trato que el catálogo.
- **La foto de la mitad Cosmetics del portal es de relleno** (`public/images/cosmetics/hero.webp`, de Unsplash: sombra rosada con pincel dorado). Es el espejo de la foto del spa: una imagen quieta en el borde, fundida hacia el centro. Cambiarla por una foto real de la tienda; si es oscura o muy cargada, revisar que el título siga legible. No volver a poner productos flotando: era justo el ruido que el cliente pidió quitar.
- **`/quienes-somos` es borrador.** Solo usa hechos que ya estaban en el sitio (originales, asesoría, muestras, cambios en 7 días, cita en el spa); no hay historia de fundación, año ni nombres. Las fotos son de relleno (spa y productos). Pedir a la clienta la historia real y fotos de la tienda, el equipo y las clientas.
