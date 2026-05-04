# QUEENS COSMETICS — Landing Page PRD

## Problema Original
Crear una landing page premium y femenina para **Queens Cosmetics**, tienda de cosméticos ubicada en Unicentro Palmira. Objetivo: convertir visitantes en pedidos por WhatsApp mediante un catálogo atractivo con carrito funcional (estilo Salchimax).

## Información del Negocio
- **Nombre:** Queens Cosmetics
- **Instagram:** [@queenscosmeticss](https://www.instagram.com/queenscosmeticss/)
- **WhatsApp:** +57 314 867 7230
- **URL WhatsApp:** `https://wa.me/573148677230?text=Hola%20Queens,%20quiero%20hacer%20un%20pedido`
- **Ubicación:** Local 128, Unicentro Palmira, Valle del Cauca, Colombia
- **Horario:** Lunes a Domingo, 10:00 AM – 8:00 PM
- **Público objetivo:** Mujeres 18–45 años, interesadas en belleza y autocuidado premium

## Brand Identity

### Paleta (HEX originales + tokens)
| Rol | HEX | Uso |
|---|---|---|
| Rosa pastel (primario) | `#FFB6C1` | 90% de la superficie, backgrounds suaves, cards |
| Dorado luxury | `#D4AF37` | Acentos, botones, íconos, bordes premium |
| Blanco puro | `#FFFFFF` | Fondos principales, texto sobre oscuro |
| Rosa intenso | `#FF69B4` | CTAs urgentes, badges de descuento, hover states |
| Negro suave | `#2C1810` | Textos principales, contraste |
| Gradientes | Rosa → Dorado | Headers hero, hover de botones premium |

### Typography
- **Headings display:** Playfair Display (serif elegante, cursivas para acentos)
- **Headings sans:** Outfit o Plus Jakarta Sans (800 weight)
- **Body:** Inter (400/500)
- **Acentos cursivos:** Cormorant Garamond italic

### Estilo
- **Femenino luxury.** Inspirado en Chanel Beauty, Fenty, Sephora premium.
- Estética suave, pétalos de rosa, dorado sutil, glass morphism rosé.
- Animaciones delicadas (float, shimmer, fade elegante).
- Fotografía estilo editorial beauty (macro de texturas, manos con productos).

## Stack Técnico
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript strict
- **Styling:** Tailwind CSS v4 con `@theme` inline + tokens OKLCH
- **UI primitivos:** Radix UI (dialog para carrito, accordion para FAQ, tabs para categorías)
- **Animaciones:** Framer Motion
- **Íconos:** Lucide React
- **Fuentes:** next/font (Playfair Display + Outfit + Inter + Cormorant)
- **State del carrito:** React Context + localStorage (persistencia)
- **Deploy:** Vercel (estático)

## Secciones de la Landing (en orden)

1. **IntroScreen** — Loader con logo Queens (corona dorada + texto rosa) + fade out elegante
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
12. **Ubicación** — Mapa de Unicentro Palmira + tarjetas (Local 128, horario, teléfono, redes)
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
- [ ] Logo real de Queens (actualmente SVG monograma)
- [ ] Sección de promociones / combos
- [ ] Filtros por tono, tipo de piel, marca
- [ ] Newsletter con descuento de bienvenida

### P2 — Futuro
- [ ] Panel admin para actualizar catálogo (Next.js + DB)
- [ ] Pasarela de pago (Wompi / Mercado Pago)
- [ ] Integración Instagram Shop
- [ ] Sistema de puntos de fidelidad
- [ ] Reservas de citas de maquillaje en el local
