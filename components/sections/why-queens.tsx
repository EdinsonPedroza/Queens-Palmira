import { ShieldCheck, Sparkles, Truck, Gift, CreditCard } from "lucide-react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Originales",
    desc: "Solo trabajamos con marcas auténticas y distribuidores autorizados. Sin réplicas.",
  },
  {
    icon: Sparkles,
    title: "Asesoría Personalizada",
    desc: "Te ayudamos a encontrar el tono, producto y rutina perfecta para ti.",
  },
  {
    icon: Truck,
    title: "Envíos el Mismo Día",
    desc: "En Palmira recibes tu pedido en pocas horas. También enviamos a todo el Valle.",
  },
  {
    icon: Gift,
    title: "Muestras Gratis",
    desc: "En tu primera compra incluimos muestras de nuestros productos más pedidos.",
  },
  {
    icon: CreditCard,
    title: "Pagos Seguros",
    desc: "Nequi, Daviplata, transferencia bancaria o efectivo. Como tú prefieras.",
  },
]

export function WhyQueens() {
  return (
    <section id="por-que" className="relative py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--gold-deep)] mb-3">
            Por qué elegir Queens
          </span>
          <h2
            className="font-display font-semibold text-ink mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Más que cosméticos,{" "}
            <span className="text-queens-gradient">una experiencia</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-start rounded-2xl border border-[var(--rose-pastel)]/40 bg-white p-6 transition-all hover:border-[var(--gold)] hover:shadow-[0_12px_32px_-12px_rgba(212,175,55,0.35)] hover:-translate-y-1"
            >
              <div className="mb-4 rounded-xl bg-queens-gradient p-3 text-[var(--gold-deep)] transition-transform group-hover:scale-110 group-hover:rotate-[-5deg]">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {f.desc}
              </p>
              <div className="absolute right-4 top-4 text-4xl font-display font-bold text-[var(--rose-pastel)]/30 select-none">
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
