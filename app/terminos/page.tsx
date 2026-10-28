import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ExternalLink, LEGAL_LIST, LegalSections, MERCHANT, OrEmail, SicLink, WhatsAppLink, type LegalSection } from "@/components/legal"
import { openGraph } from "@/lib/seo"
import { BUSINESS, FREE_SHIPPING_LABEL, LEGAL, VENUES } from "@/lib/site"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Queens Cosmetics",
  description:
    "Términos y condiciones de compra en Queens Cosmetics, tienda de cosméticos en Unicentro Palmira, y de las citas en Queens Spa.",
  openGraph: openGraph(
    "/terminos",
    "Términos y Condiciones | Queens Cosmetics",
    "Términos y condiciones de compra en Queens Cosmetics, tienda de cosméticos en Unicentro Palmira, y de las citas en Queens Spa.",
  ),
  robots: { index: true, follow: true },
}

/*
 * Written to what Colombian law asks of a shop that sells online (Ley 1480 de 2011, arts. 26, 33, 47, 50 and 51, as amended by Ley 2439 de 2024) in plain words.
 * The shop's own policies (payment methods, shipping, the 7-day exchange) are the ones the FAQ and "Quiénes somos" already publish: keep the three saying the same.
 * #envios and #cambios are linked from the footer.
 */
const sections: LegalSection[] = [
  {
    id: "comerciante",
    title: "1. Quiénes somos",
    body: (
      <>
        <p>{MERCHANT} vende cosméticos y presta servicios de uñas en Palmira, Valle del Cauca.</p>
        <ul className={LEGAL_LIST}>
          <li>
            <strong>Tienda:</strong> {VENUES.cosmetics.address}.
          </li>
          <li>
            <strong>Spa ({VENUES.spa.name}):</strong> {VENUES.spa.address}.
          </li>
          <li>
            <strong>Contacto:</strong> <WhatsAppLink />
            <OrEmail /> · Instagram <ExternalLink href={BUSINESS.instagramUrl}>{BUSINESS.instagram}</ExternalLink>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "pedidos",
    title: "2. Pedidos",
    body: (
      <>
        <p>
          Eliges los productos en el catálogo y el carrito arma un mensaje de WhatsApp con tu pedido. Antes de que pagues te confirmamos por WhatsApp la
          disponibilidad y el resumen: cada producto con su precio, el costo del envío, el total y el tiempo de entrega. El pedido queda hecho cuando aceptas ese
          resumen; hasta entonces puedes cambiarlo o cancelarlo.
        </p>
        <p>
          A más tardar al día siguiente te enviamos por el mismo chat la constancia de tu pedido: tiempo de entrega, precio exacto con impuestos, costo del envío y
          forma de pago. Si un producto se agotó, te avisamos de inmediato y no te lo cobramos.
        </p>
      </>
    ),
  },
  {
    id: "precios",
    title: "3. Precios y promociones",
    body: (
      <>
        <p>
          Los precios están en pesos colombianos e incluyen los impuestos; el envío se cobra aparte y te decimos cuánto cuesta antes de que pagues. Te cobramos el
          precio que aparecía en este sitio cuando enviaste tu pedido: si un precio cambia, el nuevo vale solo para los pedidos que lleguen después.
        </p>
        <p>
          El envío es gratis en compras desde {FREE_SHIPPING_LABEL} con entrega en Palmira. Cada promoción que publiquemos aquí o en Instagram dice sus condiciones
          y hasta cuándo va; si no dice hasta cuándo, sigue vigente hasta que la retiremos por el mismo medio en que la anunciamos.
        </p>
      </>
    ),
  },
  {
    id: "pagos",
    title: "4. Pagos",
    body: (
      <>
        <p>
          En la tienda: efectivo, Nequi, Daviplata o transferencia bancaria (Bancolombia, Davivienda), y en Palmira también contra entrega. En el spa, además,
          tarjeta.
        </p>
        <p>
          Si pagaste con tarjeta u otro medio de pago electrónico y el pedido no llegó, no es lo que pediste, llegó defectuoso o es una compra que no hiciste, puedes
          pedir la reversión del pago (Ley 1480 de 2011, art. 51): avísanos dentro de los 5 días hábiles siguientes a cuando supiste del problema, devuélvenos el
          producto si lo recibiste y avisa también a la entidad de tu medio de pago.
        </p>
      </>
    ),
  },
  {
    id: "envios",
    title: "5. Envíos y entregas",
    body: (
      <>
        <p>Entregamos en Palmira y enviamos a otras ciudades por transportadora. Antes de que pagues te decimos el costo y el tiempo de entrega.</p>
        <p>
          Si no te entregamos en el plazo que acordamos (o, si no acordamos uno, en 30 días calendario), o si el producto ya no está disponible, puedes cancelar el
          pedido y te devolvemos todo lo que pagaste, sin descuentos, en máximo 15 días calendario.
        </p>
      </>
    ),
  },
  {
    id: "garantia",
    title: "6. Garantía",
    body: (
      <>
        <p>
          Todos nuestros productos tienen la garantía legal de la Ley 1480 de 2011: deben llegar en buen estado, sin defectos, sin vencer y ser lo que pediste. Si
          no es así, aunque ya lo hayas abierto, escríbenos con una foto y los datos de tu compra: te lo cambiamos o te devolvemos el dinero, sin costo para ti.
        </p>
        <p>Te respondemos en máximo 15 días hábiles. La garantía no cubre los daños por mal uso ni por no seguir las indicaciones de la etiqueta.</p>
      </>
    ),
  },
  {
    id: "cambios",
    title: "7. Cambios",
    body: (
      <p>
        Si cambias de opinión, puedes cambiar un producto sin usar y con su empaque original dentro de los 7 días siguientes a la compra (o a la entrega, si te lo
        enviamos). Por higiene no hacemos cambios de labiales, skincare abierto ni productos íntimos, salvo que tengan un defecto: en ese caso aplica la garantía.
      </p>
    ),
  },
  {
    id: "retracto",
    title: "8. Derecho de retracto",
    body: (
      <>
        <p>
          Si compraste a distancia (por este sitio o por WhatsApp) y te enviamos el pedido, tienes 5 días hábiles desde que lo recibes para retractarte de la
          compra. Avísanos por WhatsApp dentro de ese plazo y devuélvenos el producto sin abrir ni usar, como lo recibiste: te devolvemos todo lo que pagaste, por
          el mismo medio de pago o por el que acordemos, en máximo 15 días calendario. El envío de la devolución corre por tu cuenta.
        </p>
        <p>Los productos abiertos o usados no tienen retracto, porque son de uso personal (Ley 1480 de 2011, art. 47).</p>
      </>
    ),
  },
  {
    id: "spa",
    title: "9. Citas en Queens Spa",
    body: (
      <>
        <p>
          Atendemos con cita previa. La pides por WhatsApp o con el formulario del sitio, y queda confirmada cuando te respondemos con la fecha y la hora. Los
          precios están en el menú de servicios, en pesos colombianos y con impuestos incluidos. En el manicure en acrílico el precio es «desde» y varía según el
          diseño: te confirmamos el valor exacto antes de empezar.
        </p>
        <p>
          Si no puedes venir, avísanos con al menos 3 horas de anticipación y la reprogramamos sin costo. Si un servicio no quedó como lo acordamos por una falla
          nuestra, escríbenos: lo corregimos sin costo o, si prefieres, te devolvemos lo que pagaste.
        </p>
      </>
    ),
  },
  {
    id: "autenticidad",
    title: "10. Productos originales",
    body: (
      <p>
        Todos los productos que vendemos son 100% originales, comprados a las marcas o a sus distribuidores autorizados. Úsalos como indica la etiqueta y, si
        tienes la piel sensible, pruébalos antes en una zona pequeña.
      </p>
    ),
  },
  {
    id: "propiedad",
    title: "11. Propiedad intelectual",
    body: (
      <p>
        La marca Queens, su logotipo, las fotos de nuestras sedes y los textos de este sitio son de Queens o de autores que nos permiten usarlos; no los copies sin
        autorización. Las marcas de los productos que vendemos pertenecen a sus dueños: las nombramos solo para que sepas qué vendemos.
      </p>
    ),
  },
  {
    id: "pqr",
    title: "12. Peticiones, quejas y reclamos",
    body: (
      <>
        <p>
          Preséntalos por <WhatsAppLink />
          <OrEmail /> o en cualquiera de nuestras dos sedes. Te damos un número de radicado, con la fecha y la hora, para que puedas preguntar por tu caso, y te
          respondemos en máximo 15 días hábiles.
        </p>
        <p>
          Si no quedas conforme, puedes acudir a la <SicLink />, la autoridad de protección al consumidor en Colombia.
        </p>
      </>
    ),
  },
  {
    id: "ley",
    title: "13. Ley aplicable y cambios",
    body: (
      <p>
        Estos términos se rigen por las leyes de Colombia, en especial el Estatuto del Consumidor (Ley 1480 de 2011) y la Ley 527 de 1999 sobre comercio
        electrónico. Si los cambiamos, publicaremos aquí la nueva versión: los cambios valen para los pedidos y las citas posteriores, no para los que ya hiciste.
      </p>
    ),
  },
]

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-white text-[var(--ink)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="tap-area inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-[var(--ink)]/65 hover:text-[var(--face-deep)] transition-colors duration-300 mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-4 text-balance">
          Términos y <span className="text-queens-gradient">Condiciones</span>
        </h1>
        <p className="text-[var(--ink)]/70 leading-relaxed mb-12 max-w-prose">
          Estos términos aplican a lo que compras en Queens Cosmetics (por este sitio, por WhatsApp o en la tienda) y a las citas de Queens Spa. Léelos antes de
          enviar tu pedido o agendar: nada de lo que dicen limita los derechos que te da la ley.
        </p>

        <LegalSections sections={sections} />

        <p className="mt-14 pt-6 border-t border-[var(--ink)]/10 text-xs text-[var(--ink)]/65">
          Última actualización: {LEGAL.updated} · Consulta también nuestra{" "}
          <Link href="/privacidad" className="text-[var(--face-deep)] underline underline-offset-2 hover:decoration-2">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </main>
  )
}
