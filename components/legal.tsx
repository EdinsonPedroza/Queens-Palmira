import type { ReactNode } from "react"
import { LEGAL, VENUES } from "@/lib/site"
import { WA_REQUEST, WA_REQUEST_SPA } from "@/lib/whatsapp"

/*
 * What /terminos and /privacidad share: who the merchant is and how to reach them (written once, so both pages always say the same) and how their sections,
 * links and lists look. Links inside the text are underlined: on these pages colour alone would not tell them apart (20 Oct audit).
 */

export const LEGAL_LINK = "text-[var(--face-deep)] underline underline-offset-2 hover:decoration-2"
export const LEGAL_LIST = "list-disc space-y-1.5 pl-5"

/** "Queens Cosmetics", followed by the legal holder and NIT as soon as the client sends them (LEGAL in lib/site.ts). */
const holderLine = [LEGAL.holder, LEGAL.nit && `NIT ${LEGAL.nit}`].filter(Boolean).join(", ")
export const MERCHANT = holderLine ? `Queens Cosmetics (${holderLine})` : "Queens Cosmetics"

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LEGAL_LINK}>
      {children}
    </a>
  )
}

/** Where orders, requests and complaints go: each venue has its own WhatsApp number. The chat keeps the date and time of every message. */
export function WhatsAppLink() {
  return (
    <>
      WhatsApp de la tienda <ExternalLink href={WA_REQUEST}>{VENUES.cosmetics.phone}</ExternalLink> o del spa{" "}
      <ExternalLink href={WA_REQUEST_SPA}>{VENUES.spa.phone}</ExternalLink>
    </>
  )
}

/** " o al correo …" once the client has an e-mail address (LEGAL.email); nothing while it is empty. */
export function OrEmail() {
  if (!LEGAL.email) return null
  return (
    <>
      {" "}o al correo{" "}
      <a href={`mailto:${LEGAL.email}`} className={LEGAL_LINK}>
        {LEGAL.email}
      </a>
    </>
  )
}

/** The consumer-protection authority (and the data-protection one). */
export function SicLink() {
  return <ExternalLink href={LEGAL.sic}>Superintendencia de Industria y Comercio</ExternalLink>
}

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

/** The numbered sections of a legal page: a title, then its paragraphs and lists, under a fine line. */
export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-24 border-t border-[var(--ink)]/10 pt-6">
          <h2 className="font-display text-xl md:text-2xl font-bold mb-3">{s.title}</h2>
          <div className="space-y-3 text-[var(--ink)]/70 leading-relaxed">{s.body}</div>
        </section>
      ))}
    </div>
  )
}
