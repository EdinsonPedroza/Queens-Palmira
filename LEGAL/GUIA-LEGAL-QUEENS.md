# Guía legal del sitio de Queens (Colombia)

Fecha de la revisión: 28 de octubre de 2026
Sitio: queenscosmeticscol.com (tienda en `/`, spa en `/spa`)

> **Importante:** esta guía la preparó una IA que revisó el sitio contra las leyes colombianas. **No es asesoría de un abogado.** Sirve para entender qué se exige, qué ya se arregló y qué falta. Antes de lanzar, conviene que un abogado (o el contador del cliente) revise los puntos marcados con ⚠️.

---

## 1. Resumen en un minuto

- **Lo que ya quedó arreglado en el sitio:** Términos y Condiciones, Política de Privacidad, enlace a la Superintendencia de Industria y Comercio (SIC) en el pie, y varias contradicciones de textos.
- **Lo que falta y solo el cliente puede dar:** razón social (o nombre del dueño), NIT y correo. La ley exige mostrarlos.
- **El mayor riesgo hoy:** las reseñas y las estrellas del sitio son **inventadas**. Eso es *publicidad engañosa* y la SIC puede multar hasta con **2.000 salarios mínimos** (Ley 1480 de 2011, art. 61).
- **Otro riesgo:** la fuente The Seasons que usa el sitio es la **versión DEMO**; no tiene licencia comercial.
- **Hay cosas que no son del sitio, sino del negocio** (facturas, registro sanitario, cómo se atienden los pedidos). Están en las secciones 5 y 6.

---

## 2. Qué leyes aplican y para qué sirven

| Ley | Para qué sirve, en palabras simples |
|---|---|
| **Ley 1480 de 2011** (Estatuto del Consumidor) | Los derechos de quien compra: precio claro, garantía, retracto, comercio electrónico, publicidad veraz. |
| **Ley 2439 de 2024** | Cambió partes de la 1480: la plata de una devolución se regresa en **máximo 15 días calendario** (antes 30), y exige un número de radicado en cada queja. |
| **Ley 1581 de 2012** + **Decreto 1074 de 2015** | Protección de datos personales ("habeas data"): qué datos pedir, con qué permiso, para qué y cómo responder cuando alguien pide verlos o borrarlos. |
| **Ley 527 de 1999** | Valida los mensajes de datos y las compras por internet. |
| **Ley 2300 de 2023** ("Dejen de fregar") | Limita en qué horarios se puede contactar a las personas, incluida la publicidad. |

---

## 3. Lo que ya se hizo en el sitio

1. **Términos y Condiciones** (`/terminos`), 13 secciones: quiénes somos, pedidos, precios y promociones, pagos, envíos, garantía, cambios, retracto, citas del spa, productos originales, propiedad intelectual, quejas y reclamos, ley aplicable.
2. **Política de Privacidad** (`/privacidad`), 12 secciones: responsable, qué datos se usan, autorización, para qué, datos sensibles, menores, con quién se comparten, derechos, cómo ejercerlos (con plazos), seguridad, cookies, vigencia.
3. **Enlace a la SIC** en el pie de todas las páginas (la ley lo exige a toda tienda en línea).
4. **Textos que se contradecían, ya unificados:** los cambios son en **7 días** en todo el sitio (antes los Términos decían 5), y la franja de arriba dice "desde $150.000" porque el carrito da el envío gratis desde ese monto exacto.
5. **Pregunta frecuente sobre devoluciones** reescrita para que no parezca que no hay garantía (eso sería una cláusula abusiva).

---

## 4. Lo que hay que pedirle al cliente

### 4.1 Datos obligatorios (ya hay un lugar donde ponerlos)

| Dato | Para qué |
|---|---|
| Razón social (si es empresa) **o** nombre completo del dueño (si es persona natural) | La ley exige identificar quién vende (Ley 1480, art. 50). |
| NIT (o RUT) | Igual. |
| Correo electrónico del negocio | Para peticiones, quejas y datos personales. |

**Dónde se escriben:** en el archivo `lib/site.ts`, bloque `LEGAL` (`holder`, `nit`, `email`). Al llenarlos aparecen solos en las dos páginas legales. Mientras estén vacíos, simplemente no se muestran.

### 4.2 Cosas del negocio que hay que confirmar

El sitio dice varias cosas que vienen de textos de prueba. Si no son ciertas, **hay que quitarlas**:

- ¿Hacen envíos a todo el país con Servientrega o Interrapidísimo?
- ¿Entregan el mismo día en Palmira si piden antes de las 3 p. m.?
- ¿Regalan muestras gratis en la primera compra?
- ¿Qué medios de pago aceptan en la tienda y cuáles en el spa? (¿tarjeta?)
- ¿Cuál es el costo del envío?
- ✅ **Precios del spa:** ya los dio el cliente (28 oct) y están publicados en el menú y en el formulario. Falta confirmar que «Retiro acrílico $20.000» es correcto (llegó escrito «20.0000»).
- ¿El spa cobra anticipo por la cita? Si sí, ¿qué pasa si cancelan?
- ¿Cambios en 7 días está bien? ¿Aceptan devolver productos **sin abrir** comprados con envío (derecho de retracto)? Hoy el texto dice que sí.
- ¿De dónde salieron las fotos del sitio? Si hay personas, necesitan su autorización por escrito para usar su imagen.

---

## 5. Riesgos pendientes (necesitan decisión)

### 5.1 Reseñas inventadas ⚠️ lo más grave

- **Tienda:** 8 reseñas en `components/sections/testimonials.tsx`. Hablan de productos que no existen en el catálogo (perfume "Queens Essence", paleta "Smoky Night", espejo LED).
- **Spa:** 8 reseñas en `components/sections/spa-testimonials.tsx`. El propio código dice que son de relleno.

**Qué hacer:** quitarlas hasta tener reseñas **reales** (de Google, Instagram o WhatsApp, con permiso de la persona).

### 5.2 Estrellas y número de reseñas inventados ⚠️

16 productos en `lib/products.ts` tienen `rating` y `reviews` (ej. "4.9 (128)"). No existe ningún sistema de reseñas que respalde esos números.

**Qué hacer:** borrar esos campos (las estrellas desaparecen solas porque solo se muestran si existen).

### 5.3 Insignias "Bestseller" y "Nuevo"

También tienen que ser ciertas. Si el cliente no puede demostrar que un producto es de los más vendidos, hay que quitar la insignia.

### 5.4 Promesas sin confirmar

"Muestras gratis en tu primera compra", "envíos al instante", "envíos el mismo día". Ver sección 4.2.

### 5.5 Fuente tipográfica ⚠️

The Seasons, en los archivos del sitio, es la versión **DEMO**. Su licencia no permite uso comercial. Hay que comprar la licencia web (Fontspring) o cambiar de fuente.

### 5.6 Páginas de pruebas publicadas

Las páginas `/cosmetics/estilos`, `/cosmetics/colores`, `/cosmetics/disenos`, etc. son vistas temporales y hoy se publican con el sitio. Hay que borrarlas antes de lanzar (no es un tema legal, pero se ven poco profesionales).

---

## 6. Obligaciones del día a día (no las resuelve el sitio)

El sitio solo toma pedidos por WhatsApp; el cumplimiento depende de cómo atiendan.

1. **Constancia del pedido:** a más tardar **al día siguiente** de cada pedido, enviar por WhatsApp: tiempo de entrega, precio exacto con impuestos, costo del envío y forma de pago.
2. **Peticiones, quejas y reclamos (PQR):** a cada una darle un **número de radicado** con fecha y hora, y responder en máximo **15 días hábiles**. Una forma simple: llevar una hoja de cálculo con número, fecha, nombre, motivo y respuesta.
3. **Datos personales:** si alguien pide ver, corregir o borrar sus datos, responder en los plazos de la política (consulta: 10 días hábiles; reclamo: 15 días hábiles).
4. **WhatsApp Business:** activar un mensaje de bienvenida que incluya el enlace a la política de privacidad (`queenscosmeticscol.com/privacidad`).
5. **Ofertas por WhatsApp:** enviarlas **solo a quien las pidió**, y en horario permitido: lunes a viernes de 7 a. m. a 7 p. m., sábados de 8 a. m. a 3 p. m., nunca domingos ni festivos (Ley 2300 de 2023). ⚠️ El horario salió de fuentes de prensa; confirmar con un abogado.
6. **Pedidos que no se pueden cumplir:** si un producto se agotó, avisar de inmediato y no cobrarlo. Si no entregan en el plazo (o a los 30 días si no se acordó plazo), el cliente puede cancelar y se le devuelve todo en máximo 15 días.
7. **Guardar las pruebas:** conservar los chats, los pagos y las entregas el mismo tiempo que los documentos comerciales (la ley exige poder demostrar la compra).

---

## 7. Fuera de la web (confirmar con contador o abogado) ⚠️

Esto lo escribí de memoria general, **no lo verifiqué contra la norma en esta revisión**. Pregúntalo antes de afirmarlo:

- **Registro sanitario / notificación del INVIMA** de los cosméticos que se venden (normalmente lo tiene el fabricante o importador, pero hay que poder mostrarlo).
- **Facturas de compra a proveedores** que respalden que los productos son originales (el sitio dice "100% originales").
- **Facturación electrónica** y obligaciones ante la DIAN.
- **Bioseguridad del spa** (normas de salubridad para establecimientos de uñas) y permisos locales (Cámara de Comercio, uso del suelo, etc.).
- **Registro de la marca "Queens"** ante la SIC, para que nadie más pueda usarla.
- **Registro Nacional de Bases de Datos (RNBD):** solo aplica a empresas con activos por encima de cierto monto; verificar si el cliente entra.

---

## 8. Glosario

- **Retracto:** derecho a arrepentirse de una compra hecha a distancia. Son 5 días hábiles desde que se recibe el producto.
- **Garantía legal:** derecho a que el producto funcione y llegue en buen estado. Aplica aunque el empaque esté abierto; no depende de la política de la tienda.
- **Publicidad engañosa:** anunciar algo que no es cierto o que no se puede demostrar (reseñas falsas, "el mejor", "gratis" que no es gratis).
- **Habeas data:** derecho de las personas a saber qué datos suyos tiene una empresa y a pedir que los corrija o borre.
- **Responsable del tratamiento:** la empresa o persona que decide qué hacer con los datos (en este caso, Queens).
- **PQR:** petición, queja o reclamo.
- **SIC:** Superintendencia de Industria y Comercio. Es la autoridad que protege a los consumidores y los datos personales.
- **SMMLV:** salario mínimo mensual legal vigente. Las multas se miden en esta unidad.

---

## 9. Mensaje listo para enviarle al cliente

> Hola. Revisé el sitio contra la ley colombiana (Estatuto del Consumidor y protección de datos) y ya actualicé los Términos, la Política de Privacidad y el pie de página. Para poder publicarlo necesito que me envíes:
>
> 1. Razón social o nombre completo del dueño, NIT y un correo del negocio.
> 2. Confirmar si es verdad: envíos nacionales por Servientrega/Interrapidísimo, entrega el mismo día en Palmira antes de las 3 p. m., muestras gratis en la primera compra, y qué medios de pago reciben (¿tarjeta?).
> 3. Los precios de los servicios del spa y si cobran anticipo.
> 4. Reseñas reales de clientas (de Google o Instagram, con su permiso) para reemplazar las de ejemplo que hoy tiene la página. Las de ejemplo y las estrellas hay que quitarlas porque la ley las considera publicidad engañosa y la multa puede ser muy alta.
> 5. La licencia de la fuente del logo y títulos (The Seasons), porque la que tenemos es de prueba.
>
> Además, desde que reciban pedidos: confirmar cada pedido por WhatsApp con el precio, envío y tiempo de entrega, y llevar un registro de quejas con número y fecha. Te explico cómo hacerlo si quieres.

---

## 10. Qué se verificó y qué no

- **Verificado contra el texto en línea de la ley:** artículos 8, 26, 47, 50, 51, 58 y 61 de la Ley 1480 de 2011 (incluidos los cambios de la Ley 2439 de 2024).
- **Revisado en el sitio:** que los textos de los Términos y la Política coinciden con lo que el sitio hace (el carrito vive en el navegador; el formulario del spa solo abre WhatsApp y no guarda nada).
- **No verificado de forma directa:** los plazos exactos de la Ley 1581 (10+5 y 15+8 días hábiles), los horarios de la Ley 2300 para publicidad, y todo lo de la sección 7. Están escritos según el conocimiento general de las normas; revisar con un abogado.
- **Decisión de criterio, no regla clara:** si un cosmético sellado entra o no en la excepción de retracto por "bienes de uso personal". La SIC no se ha pronunciado claramente; por eso el sitio acepta devolver los **sin abrir** y excluye los abiertos o usados.
