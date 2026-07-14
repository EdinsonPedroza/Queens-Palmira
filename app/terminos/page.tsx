import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Términos y Condiciones | Queens Cosmetics",
  description:
    "Términos y condiciones de compra en Queens Cosmetics, tienda de cosméticos en Unicentro Palmira.",
  robots: { index: true, follow: true },
}

const sections = [
  {
    title: "1. Aceptación de los términos",
    body: "Al navegar este sitio web o realizar un pedido a Queens Cosmetics aceptas estos términos y condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos no utilizar nuestros servicios.",
  },
  {
    title: "2. Pedidos y confirmación",
    body: "El catálogo de este sitio es informativo: los pedidos se confirman por WhatsApp, donde te indicamos disponibilidad real, precio final y forma de entrega. Un producto agregado al carrito no queda reservado hasta que confirmamos el pedido por chat.",
  },
  {
    title: "3. Precios y disponibilidad",
    body: "Los precios están en pesos colombianos (COP) e incluyen los impuestos aplicables. Pueden cambiar sin previo aviso por variaciones de proveedor. El precio válido es siempre el confirmado por WhatsApp al momento de cerrar el pedido.",
  },
  {
    title: "4. Pagos",
    body: "Los pagos se realizan contra entrega en nuestro local (Local 128, Unicentro Palmira) o por los medios de pago que te confirmemos en el chat de WhatsApp para envíos.",
  },
  {
    title: "5. Envíos y entregas",
    body: "Realizamos envíos a distintas zonas de Palmira y alrededores según disponibilidad, con costo informado antes de confirmar el pedido. Los tiempos de entrega son estimados y pueden variar por demanda o disponibilidad del transportador.",
  },
  {
    title: "6. Cambios y devoluciones",
    body: "Por tratarse de productos cosméticos, solo aceptamos cambios de productos sellados, sin uso y dentro de los 5 días siguientes a la entrega, salvo defecto de fábrica verificable. Escríbenos por WhatsApp con foto del producto para evaluar el caso.",
  },
  {
    title: "7. Autenticidad de los productos",
    body: "Todos los productos que vendemos son 100% originales, adquiridos directamente con nuestros proveedores y marcas autorizadas.",
  },
  {
    title: "8. Propiedad intelectual",
    body: "La marca Queens Cosmetics, su logotipo, fotografías y el contenido de este sitio son propiedad de Queens Cosmetics o de sus autores bajo licencia. No está permitida su reproducción sin autorización previa.",
  },
]

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-white text-[var(--ink)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-[var(--ink)]/50 hover:text-[var(--gold-deep)] transition-colors duration-300 mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-4 text-balance">
          Términos y <span className="text-queens-gradient">Condiciones</span>
        </h1>
        <p className="text-[var(--ink)]/70 leading-relaxed mb-12 max-w-prose">
          Estos términos regulan el uso de este sitio web y la compra de productos en Queens Cosmetics, Unicentro
          Palmira, Valle del Cauca.
        </p>

        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.title} className="border-t border-[var(--ink)]/10 pt-6">
              <h2 className="font-display text-xl md:text-2xl font-bold mb-3">{s.title}</h2>
              <p className="text-[var(--ink)]/70 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 pt-6 border-t border-[var(--ink)]/10 text-xs text-[var(--ink)]/50">
          Última actualización: julio de 2026 · Consulta también nuestra{" "}
          <Link href="/privacidad" className="text-[var(--gold-deep)] hover:underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </main>
  )
}
