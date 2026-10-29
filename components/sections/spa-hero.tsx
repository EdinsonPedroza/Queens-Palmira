import { ArrowDown, ArrowUpRight } from "lucide-react"
import { VENUES } from "@/lib/site"
import { WA_SPA } from "@/lib/whatsapp"

/* Lado B's front door: the header is its own bar and the hero starts below it. The cover is the panoramic photo the client delivered
 * (`ACTUALIZACION/PORTADA/portadaspa.png`, 1857×847: a hand with a French manicure on a towel, white flowers, candles and a Queens nail polish on a gold tray).
 * From `lg` up the WHOLE photo is the background of the hero (full width, nothing cut by an arch: the client asked for the complete image) and the copy sits on the right
 * in a frosted-crema card (82 % crema + a light blur; the client asked for more contrast between the card and the text and button) so the ink text always reads, whatever part of the photo is behind it: eyebrow, the title ("Elegancia / en tus manos.") in two lines, two lines of text,
 * the near-black "Reservar cita" button (it turns gold on hover), a text link, and the address and hours at the foot of the card. (From lg up the photo is also enlarged 26 % from its right edge, which pushes the hand to the left, clear of the card: the client asked for the hand further left. Before, the photo filled the left 56 % with a
 * curved edge, a thin gold arc and the isotipo as a watermark; those are gone.) Under `lg` the photo is a band on top that fades into the crema and the copy goes below it
 * (as on the store); phones get a portrait crop around the hand and the nails.
 *
 * The photo is the cover, so it skips next/image's optimizer (which recompresses to q85): it ships as three hand-made WebP files (q92): the whole panorama, a 1200 px one
 * and the phone crop (x 330–1084). */

/* The entrances are CSS (`hero-fade-up`, `hero-rise`, `hero-settle` in globals.css), NOT Framer Motion: its variants started the copy and the buttons at `opacity: 0`,
 * and on an iPad they never came out of it. Here every piece is visible by default and the animation only says where it comes from. The delays are the old ones:
 * the title lines 0.15 s and 0.25 s, then eyebrow 0.4 s, text 0.5 s, buttons 0.6 s, address 0.7 s and the scroll arrow 0.9 s. The photo only scales (no opacity): it is the LCP element. */

/** The round "go down" button. On phones it sits at the foot of the hero; from lg up, at the foot of the photo (above the copy strip). */
function ScrollCue({ className }: { className: string }) {
  return (
    <a href="#servicios" aria-label="Ver los servicios" className={`hero-fade-up ${className}`} style={{ animationDelay: "0.9s" }}>
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--face)]/70 bg-white/70 text-[var(--face-deep)] shadow-[0_0_24px_color-mix(in_oklab,var(--face)_25%,transparent)] backdrop-blur transition hover:scale-110">
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </span>
    </a>
  )
}

export function SpaHero() {
  return (
    <section
      id="hero"
      aria-labelledby="spa-hero-title"
      /* Starts below the strip + header (--header-h). lg+: fills the rest of the screen. */
      className="relative flex min-h-[calc(100svh_-_var(--header-h))] flex-col overflow-hidden bg-white lg:block lg:h-[calc(100svh_-_var(--header-h))] lg:min-h-[540px] lg:max-h-[56.25vw]"
    >
      {/* ── Photo ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[52svh] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] md:h-[56svh] lg:bottom-0 lg:h-auto lg:[mask-image:none]"
      >
        <div className="hero-settle absolute inset-0 origin-[50%_50%]">
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="/images/spa/portada-spa-1200.webp 1200w, /images/spa/portada-spa-1857.webp 1857w"
              sizes="100vw"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/spa/portada-spa-m.webp"
              width={754}
              height={847}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_50%] md:object-[38%_55%] lg:origin-right lg:scale-[1.26] lg:object-[85%_58%]"
            />
          </picture>
        </div>
      </div>

      {/* ── Copy ── (phone/tablet: under the photo; lg+: a frosted-crema card over the right of the photo) */}
      <div className="relative z-20 mt-[47svh] px-6 pb-24 pt-2 md:mt-[52svh] md:px-10 lg:absolute lg:right-[4.5vw] lg:top-[51%] lg:mt-0 lg:w-[max(35vw,24.5rem)] lg:max-w-[660px] lg:-translate-y-1/2 lg:rounded-[2rem] lg:bg-[color-mix(in_oklab,var(--crema)_82%,transparent)] lg:px-[3vw] lg:py-[3.2vw] lg:shadow-[0_30px_60px_-34px_color-mix(in_oklab,var(--ink)_55%,transparent)] lg:backdrop-blur-md">
        <div>
          <p
            className="hero-fade-up mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ink lg:mb-[1.6vw] lg:text-[clamp(9px,0.85vw,13px)]"
            style={{ animationDelay: "0.4s" }}
          >
            Queens Spa
          </p>
          <h1
            id="spa-hero-title"
            className="font-display text-[clamp(2.7rem,12.5vw,3.6rem)] uppercase leading-[0.88] tracking-[-0.025em] text-ink md:text-[clamp(3.4rem,9vw,5.2rem)] lg:whitespace-nowrap lg:text-[clamp(1.9rem,3.6vw,4.4rem)]"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="hero-rise block font-bold" style={{ animationDelay: "0.15s" }}>
                Elegancia
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="hero-rise block font-bold" style={{ animationDelay: "0.25s" }}>
                en tus manos.
              </span>
            </span>
          </h1>
        </div>

        <div className="lg:min-w-0">
          <p
            className="hero-fade-up mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink md:max-w-xl md:text-[1.1rem] lg:mt-[1vw] lg:max-w-none lg:text-[clamp(0.95rem,1.1vw,1.25rem)] lg:leading-[1.5]"
            style={{ animationDelay: "0.5s" }}
          >
            Un spa de uñas para consentir tus manos y pies. <br className="hidden lg:block" />
            Casa aparte de la tienda, en Alameda.
          </p>

          <div
            className="hero-fade-up mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-[1.6vw] lg:flex-nowrap lg:gap-x-[1.5vw]"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href={WA_SPA}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="spa-hero-cta-book"
              className="inline-flex items-center gap-[1.4em] whitespace-nowrap bg-[var(--face-deep)] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--face)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ink) lg:px-[1.8vw] lg:py-[0.95vw] lg:text-[clamp(10px,0.8vw,12.5px)]"
            >
              Reservar cita
              <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
            </a>
            <span aria-hidden className="hidden h-[2.4vw] w-px bg-ink/25 lg:block" />
            <a
              href="#servicios"
              className="tap-area inline-flex items-center gap-[1.2em] whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-70 lg:text-[clamp(10px,0.8vw,12.5px)]"
            >
              Ver servicios
              <ArrowDown className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
            </a>
          </div>

          {/* Address and hours (lg+). Not at the foot of the hero like the store's: the floating WhatsApp bubble sits there. */}
          <div
            className="hero-fade-up mt-12 hidden flex-row flex-wrap items-center gap-x-[2.4vw] gap-y-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-ink lg:mt-[2.4vw] lg:flex lg:text-[clamp(9px,0.72vw,11px)]"
            style={{ animationDelay: "0.7s" }}
          >
            <span>{VENUES.spa.address} · Palmira</span>
            <span>{VENUES.spa.hoursShort}</span>
          </div>
        </div>
      </div>

      {/* Scroll cue: centred at the foot of the hero */}
      <ScrollCue className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 md:bottom-7 lg:left-1/2" />
    </section>
  )
}
