import Image from "next/image"

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1522335789203-aaa2b16b9d98?w=800&q=80",
    alt: "Labiales exhibidos",
    span: "md:col-span-2 md:row-span-2",
    caption: "Nuestra colección signature",
  },
  {
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
    alt: "Mujer con maquillaje dorado",
  },
  {
    src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    alt: "Productos rosa y dorado",
  },
  {
    src: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=600&q=80",
    alt: "Brochas premium",
  },
  {
    src: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600&q=80",
    alt: "Aplicación de maquillaje",
  },
]

export function Gallery() {
  return (
    <section
      id="galeria"
      className="relative py-20 md:py-28 bg-gradient-to-b from-[var(--rose-pastel)]/15 to-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-[var(--gold-deep)] mb-3">
            Galería
          </span>
          <h2
            className="font-display font-bold text-[var(--ink)]"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.02em" }}
          >
            Momentos{" "}
            <em className="font-serif italic font-light text-queens-gradient">
              Queens
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-3 md:gap-4">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl ${img.span ?? ""}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <p className="font-serif italic text-lg">{img.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
