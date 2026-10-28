# QUEENS — Landing Page PRD

## Problema Original
Crear un sitio premium y femenino para **Queens**, marca con dos personalidades en Palmira: la tienda de cosméticos y el spa. Objetivo: convertir visitantes en pedidos (carrito → WhatsApp) para la tienda y en reservas (WhatsApp directo) para el spa.

> **Actualización tras reunión con la marca:** el sitio dejó de ser una sola landing. Ahora `/` es un portal de dos puertas y cada personalidad tiene su propia página (`/cosmetics`, `/spa`). **No comparten local**, son dos sedes.

## Información del Negocio
- **Nombre:** Queens — Queens Cosmetics (tienda) + Queens Spa
- **Instagram:** [@queenscosmeticss](https://www.instagram.com/queenscosmeticss/) (compartido)
- **WhatsApp tienda:** +57 314 867 7230 — `https://wa.me/573148677230?text=Hola%20Queens,%20quiero%20hacer%20un%20pedido`
- **WhatsApp spa:** +57 310 387 9484 — `https://wa.me/573103879484` (cada sede tiene su número; viven en `VENUES.<sede>.phone` / `.whatsapp`, `lib/site.ts`)
- **Público objetivo:** Mujeres 18–45 años, interesadas en belleza y autocuidado premium

### Sedes
| | Queens Cosmetics | Queens Spa |
|---|---|---|
| **Dirección** | Local 1-28, Unicentro Palmira | Calle 69C #26-62, Alameda (antes Cra 25 #11-23; cambio del 28 oct 2026) |
| **Ciudad** | Palmira, Valle del Cauca | Palmira, Valle del Cauca |
| **Horario** | Lun a Dom, 10:00 AM – 8:00 PM | Lun a Dom, con cita previa |
| **Atención** | Sin cita | Solo con cita |
| **Coordenadas** | `3.5400896, -76.310776` | sin coordenadas (Google resuelve la dirección) |

⚠️ El spa se mudó a la Calle 69C #26-62 (Alameda): el mapa y "Cómo llegar" buscan por dirección y el JSON-LD del spa no lleva `geo`. Si la clienta manda el link de Google Maps de la sede, ponerlo en `VENUES.spa.gmaps` / `embed` (`lib/site.ts`).

### Servicios y precios del spa (28 oct 2026, COP; `lib/spa-services.ts`)
Manicure tradicional 25.000 · gel evolution 30.000 · semipermanente 45.000 · Pedicure tradicional 25.000 · gel evolution 30.000 · semipermanente 35.000 · Manicure soft gel 90.000 · Manicure gel (polygel o base rubber) 90.000 · Manicure en acrílico desde 100.000 (varía según el diseño) · Retiro acrílico 20.000 (la clienta escribió «20.0000»: se tomó como 20.000) · Retiro semipermanente 15.000. Sin duraciones.

## Brand Identity

### Paleta (manual de marca: `ACTUALIZACION/NEWW/paleta de color y contrastes queens.pdf`)
| Rol | Nombre | HEX | OKLCH | Token |
|---|---|---|---|---|
| **Fondo de todo**, "blanco" de la marca | Crema | `#FFFFEE` | `oklch(0.995 0.022 106.8)` | `--crema` (`bg-white` también sale crema) |
| Apoyo (casi sin uso) | Ciruela | `#462649` | `oklch(0.325 0.073 323.9)` | `--ciruela` |
| Texto | Ciruela casi negro (derivado) | — | `oklch(0.2 0.035 324)` | `--ink` |
| **Cosméticos**: botones, líneas, íconos | Lila | `#A48BA6` | `oklch(0.668 0.049 323.8)` | `--lila` |
| **Spa**: botones, líneas, íconos | Dorado | `#BCA157` | `oklch(0.717 0.099 89.8)` | `--dorado` (alias `--gold`) |

**Regla del cliente: dorado = spa, lila = cosméticos, crema = fondo.** En código el acento se llama `--face` y cambia por página (ver CLAUDE.md, "Acento por cara").

Derivados (tintes/sombras, no colores nuevos): `--lila-light`, `--lila-soft`, `--lila-deep`, `--dorado-soft`, `--dorado-deep`, `--ciruela-soft`, `--ciruela-deep`.

**Combinaciones aprobadas del logo:** dorado, ciruela o lila sobre crema · crema sobre dorado, lila o ciruela. El dorado **no** va sobre lila.

**Contraste WCAG medido:** ciruela/crema 12.7 · ciruela/dorado 5.1 · ciruela/lila 4.2 · crema/lila 3.1 · crema/dorado 2.5. Regla: el dorado sobre crema solo sirve para elementos grandes o decorativos; para texto usa `--dorado-deep` (5.0). Texto crema sobre dorado o lila no pasa AA en tamaños chicos: usa ciruela encima.

### Logo
- **Isotipo** (corona + Q con corazón) e **imagotipo** (isotipo + "Queens cosmetics"): archivos de `ACTUALIZACION/NEWW/`, dorado plano con fondo transparente. Hay versiones 3D (metálicas) sin usar.
- El nombre "Queens" va siempre como imagen (`wordmark-*.webp`, recortado del imagotipo): su lettering está en curvas y es más grueso que The Seasons Bold, no se puede reescribir con la fuente.
- En el sitio: `public/images/brand/isotipo-{dorado,ciruela,crema}.webp`, recoloreadas desde el canal alfa del PNG original. Íconos (`app/icon.png`, `apple-icon.png`, `favicon.ico`, `public/icon-*.png`) = isotipo crema sobre ciruela. `public/og-image.jpg` = imagotipo dorado sobre crema.

### Typography
- **Familia única:** The Seasons. **Bold** para títulos (`h1`–`h6`), **Regular** para todo lo demás. Archivos en `app/fonts/` (Regular, Italic, Bold, Bold Italic).
- ⚠️ **Los archivos recibidos son la versión DEMO.** Solo tienen letras A–Z/a–z, `, . : ; ?` y los dígitos 0–3 y 5–9; el resto (á é í ó ú ñ ¿ ¡ ! $ + - ( ) & @ # % / * y el dígito 4) es un adorno con la palabra "DEMO". Se restringió con `unicode-range` en `app/layout.tsx` y esos caracteres salen de **Cormorant Garamond** (respaldo). **Pendiente: conseguir la fuente completa y con licencia** (la demo no es para uso comercial) y borrar `declarations` y `glyphFallback` del layout.
- Los números se dibujan con el respaldo; se fuerza `font-variant-numeric: lining-nums` porque Cormorant trae números de estilo antiguo.
- `html { font-size: 106.25% }`: The Seasons tiene x-height pequeño y compensa la legibilidad frente a la sans anterior.

### Estilo
- **El spa es un spa de uñas.** Servicios placeholder: manicure tradicional y semipermanente, pedicure spa, uñas en gel o acrílico, nail art, retiro y mantenimiento. Sin fotos propias todavía: hay 2 fotos de relleno de Pexels (IDs 4677849 y 15491629).
- Portal: dos mitades crema (lila a la izquierda con la foto de la tienda; dorado a la derecha con la foto del spa en un arco que sube desde abajo). Antes la mitad del spa era oscura; el cliente eligió la versión crema.
- **Femenino luxury.** Inspirado en Chanel Beauty, Fenty, Sephora premium.
- Estética editorial con arcos (los de la tienda), lila y dorado sutil.
- Animaciones delicadas (float, shimmer, fade elegante).
- Fotografía: la tienda real de Unicentro (arcos lila, neón del isotipo, estantes). El spa sigue con fotos de relleno.

## Stack Técnico
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript strict
- **Styling:** Tailwind CSS v4 con `@theme` inline + tokens OKLCH
- **UI primitivos:** Radix UI (dialog para carrito, accordion para FAQ, tabs para categorías)
- **Animaciones:** Framer Motion
- **Íconos:** Lucide React
- **Fuentes:** next/font/local (The Seasons, demo) + Cormorant Garamond como respaldo de glifos
- **State del carrito:** React Context + localStorage (persistencia)
- **Deploy:** Vercel (estático)

## Secciones de la Landing (en orden)

1. **IntroScreen** — Loader dorado | ciruela con el isotipo y el nombre en crema + fade out elegante
2. **Navbar** — Fixed, transparente → rosa opaco en scroll. Logo + nav links + ícono carrito con badge + CTA "Visítanos"
3. **Hero** — Full screen (`100svh`). Imagen editorial de mujer/productos, headline serif ("La belleza que mereces"), subtitle, 2 CTAs (WhatsApp + Ver catálogo)
4. **Marquee Strip** — Dorado sobre rosa, palabras: "Cosmética Premium · Envíos a todo Palmira · +500 Reinas felices · Productos originales · Asesoría personalizada"
5. **Stats Banner** — 4 contadores animados: 5.0★ · +500 clientas · 50+ marcas · 4 años
6. **Catálogo (Tabs)** — 6 categorías con productos en grid. Cada producto: foto + nombre + precio + botón "Agregar al carrito"
   - Labiales · Rostro · Ojos · Skincare · Fragancias · Accesorios
7. **Why Queens** — 5 features con íconos Lucide y acentos dorados:
   - Productos 100% originales
   - Asesoría personalizada
   - Envíos el mismo día en Palmira
   - Muestras gratis en tu primera compra
   - Pagos seguros (Nequi, Daviplata, transferencia, efectivo)
8. **Gallery** — Bento grid 6 fotos (productos + clientas + ambiente del local)
9. **Testimonials** — Doble marquee (sentidos opuestos) con 8 reseñas
10. **FAQ** — Accordion con 6 preguntas frecuentes
11. **CTA Glow** — Sección full-width con gradiente rosa→dorado, glow shimmer, botón WhatsApp grande
12. **Ubicación** — Mapa de Unicentro Palmira + tarjetas (Local 1-28, horario, teléfono, redes)
13. **Footer** — Links, redes (Instagram + WhatsApp), info, "QUEENS" en texto gigante dorado
14. **Cart Sidebar** — Dialog Radix que slide desde la derecha, lista de items con controles +/-, total, botón "Enviar pedido por WhatsApp"
15. **Floating WhatsApp** — Botón rosa pulsante con tooltip

---

## Catálogo Inventado (MVP)

### LABIALES
| Producto | Precio | Descripción |
|---|---|---|
| Labial Matte Seductora | $45.000 | Matte long-lasting, 8 tonos |
| Gloss Brillante Crystal | $38.000 | Brillo con partículas doradas, efecto plumping |
| Labial Líquido Long-Lasting | $52.000 | Hasta 16 horas, acabado satin |
| Lip Tint Natural Rose | $35.000 | Tinte natural buildable, efecto "bitten lips" |
| Lip Liner Precisión | $28.000 | Delineador cremoso de larga duración |

### ROSTRO
| Producto | Precio | Descripción |
|---|---|---|
| Base Líquida HD Cover | $85.000 | Cobertura media-alta, 12 tonos, acabado natural |
| Polvo Compacto Satin | $68.000 | Matifica y unifica, con vitamina E |
| Contorno Palette Sculpt | $72.000 | 4 tonos para contouring profesional |
| Highlighter Gold Dust | $55.000 | Iluminador dorado cremoso |
| Blush Cream Peach | $42.000 | Rubor en crema, efecto natural |
| Primer Glow Base | $58.000 | Base luminosa, prepara la piel |

### OJOS
| Producto | Precio | Descripción |
|---|---|---|
| Paleta 12 Sombras Nude | $95.000 | Tonos neutros mate y shimmer |
| Paleta Smoky Night | $98.000 | 9 sombras ahumadas con glitter |
| Máscara Volume Black | $48.000 | Volumen extremo, a prueba de agua |
| Delineador Líquido Precisión | $38.000 | Punta fina, no se corre |
| Pestañas Postizas Glam | $25.000 | Pestañas reutilizables, adhesivo incluido |
| Cejas Brow Shape Gel | $35.000 | Gel fijador con tinte |

### SKINCARE
| Producto | Precio | Descripción |
|---|---|---|
| Serum Vitamina C | $120.000 | Antioxidante, unifica el tono |
| Crema Hidratante Día SPF30 | $95.000 | Protección solar + hidratación |
| Mascarilla Gold Luxury | $85.000 | Mascarilla de oro, efecto tensor |
| Tónico Equilibrante Rose | $55.000 | Con agua de rosas, sin alcohol |
| Limpiador Facial Suave | $48.000 | Espuma gentle para todo tipo de piel |
| Contorno de Ojos Renewal | $78.000 | Reduce ojeras y líneas finas |

### FRAGANCIAS
| Producto | Precio | Descripción |
|---|---|---|
| Queens Essence 50ml | $180.000 | Fragancia signature: rosa, jazmín y vainilla |
| Rose Bloom 30ml | $95.000 | Floral fresco para el día |
| Velvet Night 50ml | $165.000 | Oriental intenso para la noche |
| Body Mist Sweet Dreams 100ml | $55.000 | Mist corporal suave y duradero |

### ACCESORIOS
| Producto | Precio | Descripción |
|---|---|---|
| Brochas Set Premium 12 piezas | $120.000 | Set profesional con estuche dorado |
| Esponjas Beauty Blender x2 | $35.000 | Pack de 2, rosa y dorado |
| Espejo LED Profesional | $85.000 | Espejo con luz LED y aumento |
| Organizador Acrílico | $68.000 | Organizador de maquillaje multinivel |
| Neceser Queens Rose | $45.000 | Neceser impermeable rosa con dorado |

**Total: 30 productos en 6 categorías**

---

## Funcionalidades del Carrito
- `CartContext` con estado global (`addItem`, `removeItem`, `updateQty`, `clearCart`)
- Persistencia en `localStorage` (el carrito sobrevive al refresh)
- Badge en navbar con contador animado
- Cart sidebar (Radix Dialog) con slide desde la derecha
- Controles de cantidad por item (+/-)
- Subtotal y total
- Botón "Enviar pedido por WhatsApp" que genera mensaje pre-formateado:
  ```
  Hola Queens! Quiero pedir:
  - 2x Labial Matte Seductora — $90.000
  - 1x Paleta 12 Sombras Nude — $95.000
  Total: $185.000
  Gracias!
  ```
- Estado vacío con CTA "Ver catálogo"

## Backlog

### P0 — MVP (esta entrega)
- [ ] Setup Next.js 16 + Tailwind v4 + TypeScript
- [ ] Design tokens OKLCH + fuentes
- [ ] IntroScreen + Navbar + Hero
- [ ] Marquee + Stats
- [ ] Catálogo con tabs + CartContext + persistencia localStorage
- [ ] Why Queens + Gallery + Testimonials + FAQ
- [ ] CTA Glow + Ubicación + Footer
- [ ] Cart Sidebar + Floating WhatsApp
- [ ] SEO (metadata, OG, keywords en español)
- [ ] Deploy config Vercel

### P1 — Siguientes mejoras
- [ ] Fotos reales de los productos (reemplazar placeholders de Unsplash)
- [x] Logo real de Queens (isotipo + imagotipo del manual de marca, ya aplicados)
- [ ] Sección de promociones / combos
- [ ] Filtros por tono, tipo de piel, marca
- [ ] Newsletter con descuento de bienvenida

### P2 — Futuro
- [ ] Panel admin para actualizar catálogo (Next.js + DB)
- [ ] Pasarela de pago (Wompi / Mercado Pago)
- [ ] Integración Instagram Shop
- [ ] Sistema de puntos de fidelidad
- [ ] Reservas de citas de maquillaje en el local
