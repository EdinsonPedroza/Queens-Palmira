import { MapPin, Clock, Phone, Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_VISIT } from "@/lib/whatsapp"

const MAP_SRC =
  "https://www.google.com/maps?q=Unicentro+Palmira,+Valle+del+Cauca&output=embed"

export function Location() {
  return (
    <section id="ubicacion" className="relative py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--gold-deep)] mb-3">
            Visítanos
          </span>
          <h2
            className="font-display font-bold text-[var(--ink)] mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            Nuestra tienda en{" "}
            <em className="font-serif italic font-light text-queens-gradient">
              Unicentro Palmira
            </em>
          </h2>
          <p className="text-[var(--muted-foreground)] text-base md:text-lg max-w-xl mx-auto">
            Ven y vive la experiencia Queens en persona. Te esperamos con un espacio
            pensado para consentirte.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10">
          <div className="relative overflow-hidden rounded-3xl border-4 border-[var(--gold)]/30 shadow-xl h-[360px] md:h-[460px]">
            <iframe
              title="Mapa Queens Cosmetics Unicentro Palmira"
              src={MAP_SRC}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col gap-4">
            <InfoCard
              icon={<MapPin className="h-5 w-5" />}
              title="Dirección"
              lines={["Local 128, Unicentro Palmira", "Valle del Cauca, Colombia"]}
            />
            <InfoCard
              icon={<Clock className="h-5 w-5" />}
              title="Horario"
              lines={["Lunes a Domingo", "10:00 AM – 8:00 PM"]}
            />
            <InfoCard
              icon={<Phone className="h-5 w-5" />}
              title="Contacto"
              lines={["WhatsApp: +57 314 867 7230"]}
            />
            <InfoCard
              icon={<Instagram className="h-5 w-5" />}
              title="Síguenos"
              lines={["@queenscosmeticss"]}
              href="https://www.instagram.com/queenscosmeticss/"
            />
            <div className="pt-2">
              <Button asChild variant="whatsapp" size="lg" className="w-full">
                <a href={WA_VISIT} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  Confirmar disponibilidad
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCard({
  icon,
  title,
  lines,
  href,
}: {
  icon: React.ReactNode
  title: string
  lines: string[]
  href?: string
}) {
  const content = (
    <div className="group flex gap-4 rounded-2xl border border-[var(--rose-pastel)]/50 bg-white p-5 transition hover:border-[var(--gold)] hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-queens-gradient text-[var(--gold-deep)] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--gold-deep)] mb-1">
          {title}
        </h3>
        {lines.map((l, i) => (
          <p key={i} className="text-sm text-[var(--ink)]">
            {l}
          </p>
        ))}
      </div>
    </div>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}
