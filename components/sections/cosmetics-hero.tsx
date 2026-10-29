import { ArrowDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { VENUES } from "@/lib/site"

/* Lado A's front door: a full-bleed product photo (Atenea concealer, Vogue mascara and a Montoc gel liner, on the left) with the copy, left-aligned,
 * in the empty right half (title on three lines; "Ver catálogo" and "Queens Spa" (link to /spa) side by side). Under `lg` the photo becomes a band on top that fades into the crema, and the
 * copy sits below it. Sizes use vw so the whole composition scales with the width, as in the approved preview.
 *
 * The photo is the cover, so it is deliberately NOT run through next/image's optimizer (which re-encodes to
 * AVIF/WebP at q85 and caps widths at 1920): it ships as hand-made high-quality WebP files — made from
 * `ACTUALIZACION/PORTADA/P1.png` (1983×793; the desktop versions add 100 px on the left (edge copy), 164 px mirrored on the right, 186 px on top and 285 px of blurred, extended floor below so it is 16:9; the phone crop is x 60–1090 plus 54 px on top and 288 below) —
 * in three desktop widths plus a tighter crop for phones. `sizes` is the width the photo is DRAWN at, so each screen gets enough pixels.
 *
 * Phones: object-cover draws the tall crop as wide as max(the window, the band's height x 1960/2160), and the band is 52svh tall (56svh from md).
 * The old value (68vh) over-estimated that, so a 390 px phone downloaded the 222 KB file; the 130 KB one has more pixels than the screen can show and,
 * measured at device resolution, renders as sharp or slightly sharper (it is closer to 1:1). Checked on 24 screen/density pairs with the browser's own
 * candidate selection.
 *
 * Desktop: DO NOT tighten `sizes` (it looks as if 109vw would do, and would pick the 1920 file at 1440 px: 55 KB less). The 2880 and 3878 files are
 * upscales of the 2247 px master and keep all of its detail; the 1920 one is a DOWNSCALE of it, and a render from it at 1440x900 has ~25 % less edge
 * detail (Laplacian variance of the labels 2706 vs 3765). It has the pixels but not the sharpness. */

/* The entrances are CSS (`hero-fade-up`, `hero-rise`, `hero-settle` in globals.css), NOT Framer Motion: its variants started the copy and the buttons at `opacity: 0`,
 * and on an iPad they never came out of it. Here every piece is visible by default and the animation only says where it comes from. The delays are the old ones:
 * the title lines 0.15 s and 0.25 s (`hero-rise`), then eyebrow 0.4 s, text 0.5 s, buttons 0.6 s, address 0.7 s and the scroll arrow 0.9 s (`hero-fade-up`). The photo only scales
 * (no opacity): it is the LCP element and must paint right away. */

export function CosmeticsHero() {
  return (
    <section
      id="hero"
      aria-labelledby="cosmetics-hero-title"
      /* Starts below the announcement strip + header (--header-h, together as tall as the header alone used to be). lg+: fills the rest of the screen, but never wider than 16:9 — on squarer windows the photo would be cropped so far
       * that the lying gloss cap (it ends at ~60 % of the width at 16:9) slides under the copy, which starts at 62 %. */
      className="relative flex min-h-[calc(100svh_-_var(--header-h))] flex-col overflow-hidden bg-white lg:block lg:h-[calc(100svh_-_var(--header-h))] lg:max-h-[56.25vw] lg:min-h-[540px]"
    >
      {/* ── Photo ── */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[52svh] md:h-[56svh] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] lg:inset-0 lg:h-auto lg:[mask-image:none]"
      >
        <div className="hero-settle absolute inset-0 origin-[30%_50%]">
          <picture className="contents">
            <source
              media="(min-width: 1024px)"
              srcSet="/images/cosmetics/hero-portada-1920.webp 1920w, /images/cosmetics/hero-portada-2880.webp 2880w, /images/cosmetics/hero-portada-3878.webp 3878w"
              sizes="max(120vw, 240vh)"
            />
            <img
              src="/images/cosmetics/hero-portada-m-1300.webp"
              srcSet="/images/cosmetics/hero-portada-m-1300.webp 1300w, /images/cosmetics/hero-portada-m-1960.webp 1960w"
              sizes="(min-width: 768px) max(100vw, 51vh), max(100vw, 47.5vh)"
              width={1960}
              height={2160}
              alt=""
              fetchPriority="high"
              decoding="async"
              /* lg+: scaled from the bottom-left corner, which moves the bottles up and to the right (client asked for "more and more") while the photo still covers the hero. The limit is the right edge of the Montoc pot (at ~57 % of the width at 16:9): it must stay clear of the copy, which starts at ~61.5vw. Re-check that if you change either. */
              className="absolute inset-0 h-full w-full object-cover object-[50%_50%] lg:origin-[0%_31%] lg:scale-[1.03] lg:object-[0%_50%] xl:scale-[1.04]"
            />
          </picture>
        </div>
      </div>

      {/* ── Behind the copy (lg+): a soft crema glow ONLY where the text is (an ellipse, 68 % crema in the middle and fading out to nothing), not a full-height strip: the client
          asked for the white to sit just behind the text, enough to contrast, and not so white; above, below and around it the photo shows. ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden lg:block" style={{ background: "radial-gradient(ellipse 27% 40% at 76.5% 52%, color-mix(in oklab, var(--crema) 68%, transparent) 0%, color-mix(in oklab, var(--crema) 68%, transparent) 42%, color-mix(in oklab, var(--crema) 34%, transparent) 72%, transparent 100%)" }} />

      {/* ── Copy ── */}
      <div className="relative z-20 mt-[47svh] px-6 pb-24 pt-2 md:mt-[52svh] md:px-10 lg:absolute lg:right-[8.5vw] lg:top-[63%] lg:mt-0 lg:w-[30vw] lg:-translate-y-1/2 lg:p-0">
        {/* Eyebrow + title (lg+: sit above the paragraph, anchored to it; below lg: in the flow). The whole title is the ink colour (the client's reference). */}
        <div className="lg:absolute lg:bottom-full lg:left-0 lg:mb-[0.4vw]">
          <p
            className="hero-fade-up mb-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ink/80 lg:mb-[0.9vw] lg:text-[clamp(9px,0.85vw,13px)]"
            style={{ animationDelay: "0.4s" }}
          >
            Belleza que inspira
          </p>
          <h1
            id="cosmetics-hero-title"
            className="font-display text-[clamp(2.7rem,12.5vw,3.6rem)] uppercase leading-[0.88] tracking-[-0.025em] text-ink md:text-[clamp(3.4rem,9vw,5.2rem)] lg:whitespace-nowrap lg:text-[clamp(2.1rem,4.4vw,5.75rem)]"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="hero-rise block font-bold" style={{ animationDelay: "0.15s" }}>
                Brilla como
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="hero-rise block font-bold" style={{ animationDelay: "0.25s" }}>
                reina.
              </span>
            </span>
          </h1>
        </div>

        <p
          className="hero-fade-up mt-3 max-w-md text-[1rem] leading-relaxed text-ink/85 md:max-w-xl md:text-[1.05rem] lg:mt-0 lg:max-w-none lg:text-[clamp(0.95rem,1.22vw,1.375rem)] lg:leading-[1.5]"
          style={{ animationDelay: "0.5s" }}
        >
          Maquillaje, skincare, esmaltes y línea capilar. <br className="hidden lg:block" />
          Marcas originales, asesoría y envíos al instante.
        </p>

        <div
          className="hero-fade-up mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-[1.9vw] lg:flex-nowrap lg:gap-x-[1vw]"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#catalogo"
            data-testid="cosmetics-hero-cta-catalog"
            className="inline-flex items-center gap-[1.4em] whitespace-nowrap bg-[var(--ciruela)] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ciruela) lg:px-[2.2vw] lg:py-[1.15vw] lg:text-[clamp(10px,0.95vw,14px)]"
          >
            Ver catálogo
            <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
          </a>
          <Link
            href="/spa"
            data-testid="cosmetics-hero-cta-spa"
            /* The gold left line is a real border (inline, because the global border-color rule beats Tailwind's colours): an inset box-shadow left a faint 1px line along the top edge at fractional positions. */
            style={{ borderLeft: "2px solid var(--dorado)" }}
            className="inline-flex items-center gap-[1.4em] whitespace-nowrap px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--dorado)] transition-colors duration-200 hover:bg-[var(--dorado)] hover:text-[var(--crema)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--dorado) lg:px-[2.2vw] lg:py-[1.15vw] lg:text-[clamp(10px,0.95vw,14px)]"
          >
            Queens Spa
            <ArrowUpRight className="h-[1.1em] w-[1.1em]" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Address and hours, stacked, bottom-left of the hero, side by side (lg+; client request; the same info the hero already had) */}
      <div
        className="hero-fade-up absolute bottom-[1.6vw] left-[5vw] z-20 hidden flex-row flex-wrap items-center gap-x-[2.4vw] gap-y-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-ink/90 lg:flex lg:text-[clamp(9px,0.72vw,11px)]"
        style={{ animationDelay: "0.7s" }}
      >
        <span>{VENUES.cosmetics.address}</span>
        <span>{VENUES.cosmetics.hoursShort}</span>
      </div>

      {/* Scroll cue */}
      <a
        href="#catalogo"
        aria-label="Ver el catálogo"
        className="hero-fade-up absolute bottom-5 left-1/2 z-20 -translate-x-1/2 md:bottom-7"
        style={{ animationDelay: "0.9s" }}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--face)]/70 bg-white/70 text-[var(--face-deep)] shadow-[0_0_24px_color-mix(in_oklab,var(--face)_25%,transparent)] backdrop-blur transition hover:scale-110">
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </span>
      </a>
    </section>
  )
}
