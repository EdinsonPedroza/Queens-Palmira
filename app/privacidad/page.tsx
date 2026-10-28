import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ExternalLink, LEGAL_LIST, LegalSections, MERCHANT, OrEmail, SicLink, WhatsAppLink, type LegalSection } from "@/components/legal"
import { openGraph } from "@/lib/seo"
import { LEGAL, VENUES } from "@/lib/site"

export const metadata: Metadata = {
  title: "Política de Privacidad | Queens Cosmetics",
  description:
    "Política de tratamiento de datos personales de Queens Cosmetics y Queens Spa conforme a la Ley 1581 de 2012 (Colombia).",
  openGraph: openGraph(
    "/privacidad",
    "Política de Privacidad | Queens Cosmetics",
    "Política de tratamiento de datos personales de Queens Cosmetics y Queens Spa conforme a la Ley 1581 de 2012 (Colombia).",
  ),
  robots: { index: true, follow: true },
}

/* Google Analytics only loads when this variable is set at build time (app/layout.tsx), so the cookies section says so only then. */
const ANALYTICS = Boolean(process.env.NEXT_PUBLIC_GA_ID)

/*
 * The contents the law asks of a data policy (Ley 1581 de 2012, arts. 8 and 14–16; Decreto 1074 de 2015, art. 2.2.2.25.3.1): who is responsible and how to
 * reach them, what is collected and why, the holder's rights, the procedure and its terms, and when the policy took effect. It has to match what the site really
 * does: the cart lives in localStorage and the spa form only opens WhatsApp (nothing is stored on a server).
 */
const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "1. Responsable del tratamiento",
    body: (
      <p>
        {MERCHANT}, con la tienda en el {VENUES.cosmetics.address} y {VENUES.spa.name} en la {VENUES.spa.address}, en Palmira, Valle del Cauca. Contacto:{" "}
        <WhatsAppLink />
        <OrEmail />. Las solicitudes sobre tus datos las atiende la administración de Queens por esos mismos canales.
      </p>
    ),
  },
  {
    id: "datos",
    title: "2. Qué datos tratamos",
    body: (
      <>
        <ul className={LEGAL_LIST}>
          <li>
            <strong>Pedidos:</strong> tu nombre, tu teléfono, la dirección de entrega (si pides envío) y los productos que eliges.
          </li>
          <li>
            <strong>Citas del spa:</strong> tu nombre, tu teléfono, el servicio, la fecha y la hora que prefieres y los detalles que quieras contarnos.
          </li>
          <li>
            <strong>Mensajes:</strong> lo que nos escribes por WhatsApp o Instagram, con tu nombre de perfil y tu número.
          </li>
        </ul>
        <p>
          Este sitio no guarda tus datos: el carrito vive en tu navegador y el formulario del spa solo arma el mensaje y abre WhatsApp. Nos llegan cuando tú envías
          ese mensaje.
        </p>
      </>
    ),
  },
  {
    id: "autorizacion",
    title: "3. Tu autorización",
    body: (
      <p>
        Nos la das al marcar la casilla del formulario del spa o al escribirnos para hacer un pedido o una reserva después de conocer esta política. Puedes
        revocarla cuando quieras (punto 9).
      </p>
    ),
  },
  {
    id: "finalidades",
    title: "4. Para qué los usamos",
    body: (
      <>
        <ul className={LEGAL_LIST}>
          <li>Confirmar, preparar, cobrar y entregar tu pedido.</li>
          <li>Agendar, confirmar o reprogramar tus citas en el spa.</li>
          <li>Responder tus preguntas y atender cambios, garantías, peticiones, quejas y reclamos.</li>
          <li>Cumplir nuestras obligaciones legales, contables y tributarias, como la facturación.</li>
          <li>
            Enviarte novedades y ofertas por WhatsApp, solo si nos lo pides (por ejemplo, con el botón «Unirme por WhatsApp»). Puedes pedirnos que dejemos de
            enviártelas cuando quieras.
          </li>
        </ul>
        <p>No vendemos ni alquilamos tus datos.</p>
      </>
    ),
  },
  {
    id: "sensibles",
    title: "5. Datos sensibles",
    body: (
      <p>
        No te pedimos datos sensibles. Si al agendar nos cuentas algo de tu salud (por ejemplo, una alergia o una condición en tus uñas), es opcional: no tienes que
        darnos esa información, y si nos la das la usamos solo para atenderte con cuidado.
      </p>
    ),
  },
  {
    id: "menores",
    title: "6. Niñas, niños y adolescentes",
    body: (
      <p>
        Si eres menor de edad, pide a tu mamá, papá o acudiente que haga el pedido o la reserva, o que nos dé su autorización. Usamos los datos de menores solo para
        atender su pedido o su cita y respetando sus derechos.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "7. Con quién los compartimos",
    body: (
      <>
        <p>Solo con quienes nos ayudan a atenderte, y solo lo necesario:</p>
        <ul className={LEGAL_LIST}>
          <li>la mensajería o transportadora que lleva tu pedido (nombre, dirección y teléfono);</li>
          <li>WhatsApp e Instagram, de Meta Platforms, por donde hablamos contigo;</li>
          <li>Cloudflare, que aloja este sitio, y Google, que muestra el mapa de nuestras sedes.</li>
        </ul>
        <p>
          Algunos de estos servicios guardan la información fuera de Colombia, por ejemplo en Estados Unidos. A una autoridad le entregamos datos solo cuando la ley
          nos lo exige.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "8. Tus derechos",
    body: (
      <>
        <p>Según la Ley 1581 de 2012 (art. 8), puedes:</p>
        <ul className={LEGAL_LIST}>
          <li>conocer, actualizar y corregir tus datos;</li>
          <li>pedir prueba de la autorización que nos diste;</li>
          <li>saber, si nos lo pides, cómo hemos usado tus datos;</li>
          <li>revocar tu autorización o pedir que borremos tus datos, salvo que la ley o un contrato vigente nos obligue a conservarlos;</li>
          <li>consultar tus datos gratis;</li>
          <li>presentar quejas ante la Superintendencia de Industria y Comercio, después de hacer tu consulta o reclamo con nosotros.</li>
        </ul>
      </>
    ),
  },
  {
    id: "solicitudes",
    title: "9. Cómo ejercer tus derechos",
    body: (
      <>
        <p>
          Escríbenos por <WhatsAppLink />
          <OrEmail /> o déjanos tu solicitud por escrito en cualquiera de nuestras sedes. Cuéntanos tu nombre, un número o un correo para responderte y qué
          necesitas; si es un reclamo, describe los hechos y adjunta lo que quieras que tengamos en cuenta.
        </p>
        <ul className={LEGAL_LIST}>
          <li>
            <strong>Consultas:</strong> te respondemos en máximo 10 días hábiles. Si necesitamos más tiempo, te explicamos por qué y te respondemos dentro de los 5
            días hábiles siguientes.
          </li>
          <li>
            <strong>Reclamos</strong> (corregir, actualizar o borrar datos, o revocar tu autorización): te respondemos en máximo 15 días hábiles, prorrogables por 8
            días hábiles más si te explicamos por qué. Si a tu reclamo le falta información, te la pedimos dentro de los 5 días siguientes; si pasan 2 meses sin que
            nos la envíes, entenderemos que desististe.
          </li>
        </ul>
        <p>
          Si no quedas conforme con la respuesta, puedes acudir a la <SicLink />.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    title: "10. Seguridad y conservación",
    body: (
      <p>
        Cuidamos tus datos con medidas razonables para que nadie sin autorización los vea o los use: solo los maneja nuestro equipo. Los guardamos mientras los
        necesitemos para las finalidades de esta política y durante el tiempo que exigen las normas contables y tributarias.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "11. Cookies y almacenamiento local",
    body: (
      <>
        <p>
          {ANALYTICS
            ? "Este sitio no usa cookies de publicidad. Usamos Google Analytics para contar las visitas de forma agregada; guarda sus propias cookies en tu navegador, y puedes bloquearlas desde su configuración."
            : "Este sitio no usa cookies propias de publicidad ni de seguimiento."}{" "}
          El carrito se guarda en el almacenamiento local de tu navegador (localStorage) para que no lo pierdas al recargar la página: queda en tu dispositivo, no nos
          llega, y lo borras vaciando el carrito o los datos del sitio.
        </p>
        <p>
          Cuando te acercas a la sección de ubicación cargamos el mapa de Google, que puede usar sus propias cookies según la{" "}
          <ExternalLink href="https://policies.google.com/privacy?hl=es">política de privacidad de Google</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "vigencia",
    title: "12. Vigencia y cambios",
    body: (
      <p>
        Esta política rige desde el {LEGAL.updated}. Nuestras bases de datos estarán vigentes mientras Queens siga funcionando y las necesite para las finalidades de
        esta política. Si cambiamos algo importante, lo publicaremos aquí antes de aplicarlo, y si cambia la finalidad con que usamos tus datos, te pediremos una
        nueva autorización.
      </p>
    ),
  },
]

export default function PrivacidadPage() {
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
          Política de <span className="text-queens-gradient">Privacidad</span>
        </h1>
        <p className="text-[var(--ink)]/70 leading-relaxed mb-12 max-w-prose">
          Esta es nuestra política de tratamiento de datos personales, conforme a la Ley 1581 de 2012 y al Decreto 1074 de 2015. Te contamos qué datos tuyos
          usamos, para qué, con quién los compartimos y cómo puedes consultarlos, corregirlos o pedir que los borremos.
        </p>

        <LegalSections sections={sections} />

        <p className="mt-14 pt-6 border-t border-[var(--ink)]/10 text-xs text-[var(--ink)]/65">
          Última actualización: {LEGAL.updated} · Consulta también nuestros{" "}
          <Link href="/terminos" className="text-[var(--face-deep)] underline underline-offset-2 hover:decoration-2">
            Términos y Condiciones
          </Link>
        </p>
      </div>
    </main>
  )
}
