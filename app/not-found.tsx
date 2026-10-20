import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { WA_DEFAULT } from "@/lib/whatsapp"

/*
 * The 404 page (it becomes out/404.html, which Cloudflare serves, with a 404 status, for any address that does not exist). Without this file Next
 * writes its own English page ("This page could not be found."), in a site that is entirely Spanish. It copies the layout of the legal pages.
 */

export const metadata: Metadata = {
  title: "Página no encontrada | Queens Cosmetics",
  robots: { index: false, follow: true },
  // An error page has no address of its own: no canonical (the layout's would point at "/_not-found")
  alternates: {},
}

export default function NotFound() {
  return (
    <main data-face="cosmetics" className="flex min-h-screen items-center bg-white text-[var(--ink)]">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[var(--face-deep)]">Error 404</p>
        <h1 className="font-display mb-4 text-balance text-4xl font-black tracking-tight md:text-6xl">Esta página no existe.</h1>
        <p className="mb-10 max-w-prose leading-relaxed text-[var(--ink)]/70">
          Puede que el enlace esté roto o que la hayamos movido. Vuelve al inicio y sigue mirando, o escríbenos y te ayudamos.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/"
            className="tap-area inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--ink)]/65 transition-colors duration-300 hover:text-[var(--face-deep)]"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <a
            href={WA_DEFAULT}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-area inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[var(--ink)]/65 transition-colors duration-300 hover:text-[var(--face-deep)]"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
