import { Instagram, MessageCircle, MapPin, Mail } from "lucide-react"
import { QueensLogo } from "@/components/queens-logo"
import { WA_DEFAULT } from "@/lib/whatsapp"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[var(--ink)] text-white overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-queens-gradient-intense" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 mb-14">
          <div>
            <QueensLogo variant="white" />
            <p className="mt-5 text-sm text-white/70 leading-relaxed max-w-xs">
              Cosmética premium en Palmira. La belleza que mereces, con la
              calidad que te cuidas.
            </p>
            <div className="mt-6 flex gap-3">
              <SocialLink
                href="https://www.instagram.com/queenscosmeticss/"
                icon={<Instagram className="h-5 w-5" />}
                label="Instagram"
              />
              <SocialLink
                href={WA_DEFAULT}
                icon={<MessageCircle className="h-5 w-5" />}
                label="WhatsApp"
              />
            </div>
          </div>

          <FooterCol
            title="Tienda"
            links={[
              { label: "Catálogo",       href: "#catalogo" },
              { label: "Labiales",       href: "#catalogo" },
              { label: "Skincare",       href: "#catalogo" },
              { label: "Fragancias",     href: "#catalogo" },
              { label: "Accesorios",     href: "#catalogo" },
            ]}
          />

          <FooterCol
            title="Queens"
            links={[
              { label: "Por qué Queens", href: "#por-que" },
              { label: "Galería",        href: "#galeria" },
              { label: "Testimonios",    href: "#por-que" },
              { label: "Ubicación",      href: "#ubicacion" },
            ]}
          />

          <div>
            <h4 className="font-display font-semibold text-[var(--gold)] mb-4 tracking-wide">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[var(--gold)]" />
                <span>Local 128, Unicentro Palmira</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 mt-0.5 text-[var(--gold)]" />
                <a
                  href={WA_DEFAULT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--gold)] transition"
                >
                  +57 314 867 7230
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="h-4 w-4 shrink-0 mt-0.5 text-[var(--gold)]" />
                <a
                  href="https://www.instagram.com/queenscosmeticss/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--gold)] transition"
                >
                  @queenscosmeticss
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant QUEENS wordmark */}
        <div className="relative border-t border-white/10 pt-10">
          <h3
            className="font-display text-center font-black select-none leading-none text-queens-gradient"
            style={{
              fontSize: "clamp(3.5rem, 18vw, 18rem)",
              letterSpacing: "0.02em",
            }}
          >
            QUEENS
          </h3>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50">
          <p>© {year} Queens Cosmetics. Todos los derechos reservados.</p>
          <p>Palmira, Valle del Cauca · Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-[var(--gold)] hover:text-[var(--ink)] hover:border-[var(--gold)]"
    >
      {icon}
    </a>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="font-display font-semibold text-[var(--gold)] mb-4 tracking-wide">
        {title}
      </h4>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-white/70 hover:text-[var(--gold)] transition"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
