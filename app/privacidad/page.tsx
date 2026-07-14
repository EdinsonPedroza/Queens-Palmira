import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Política de Privacidad | Queens Cosmetics",
  description:
    "Política de tratamiento de datos personales de Queens Cosmetics conforme a la Ley 1581 de 2012 (Colombia).",
  robots: { index: true, follow: true },
}

const sections = [
  {
    title: "1. Responsable del tratamiento",
    body: "Queens Cosmetics, con local en Unicentro Palmira (Local 128), Valle del Cauca, es responsable del tratamiento de los datos personales que nos compartes al hacer pedidos por WhatsApp, usar el carrito de este sitio o contactarnos por redes sociales.",
  },
  {
    title: "2. Datos que recolectamos",
    body: "Recolectamos únicamente lo necesario para procesar tu pedido: nombre, número de teléfono, dirección de entrega (si aplica) y el detalle de los productos que solicitas. El carrito de compras de este sitio guarda tu selección de productos localmente en tu navegador, no en nuestros servidores.",
  },
  {
    title: "3. Para qué los usamos",
    body: "Usamos tus datos para confirmar y preparar tu pedido, coordinar la entrega o el envío, responder tus consultas y, si nos autorizas, avisarte sobre nuevos productos o promociones. No vendemos ni compartimos tu información con terceros con fines comerciales.",
  },
  {
    title: "4. Tus derechos (Ley 1581 de 2012)",
    body: "De acuerdo con la ley colombiana de protección de datos personales, puedes conocer, actualizar, rectificar y solicitar la eliminación de tus datos, así como revocar cualquier autorización. Para ejercer estos derechos escríbenos por WhatsApp al +57 314 867 7230.",
  },
  {
    title: "5. Seguridad y conservación",
    body: "Protegemos tu información con medidas razonables contra acceso no autorizado y la conservamos solo el tiempo necesario para gestionar tu pedido y cumplir obligaciones legales.",
  },
  {
    title: "6. Cookies y analítica",
    body: "Este sitio no usa cookies de rastreo publicitario. El carrito de compras utiliza almacenamiento local (localStorage) para recordar tu selección de productos mientras navegas, sin identificarte personalmente.",
  },
]

export default function PrivacidadPage() {
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
          Política de <span className="text-queens-gradient">Privacidad</span>
        </h1>
        <p className="text-[var(--ink)]/70 leading-relaxed mb-12 max-w-prose">
          En Queens Cosmetics tratamos tus datos personales con responsabilidad, conforme a la Ley 1581 de 2012 y sus
          decretos reglamentarios.
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
          Última actualización: julio de 2026 · Consulta también nuestros{" "}
          <Link href="/terminos" className="text-[var(--gold-deep)] hover:underline">
            Términos y Condiciones
          </Link>
        </p>
      </div>
    </main>
  )
}
