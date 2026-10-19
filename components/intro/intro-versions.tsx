import type { CSSProperties, ReactElement } from "react"
import { cn } from "@/lib/utils"
import styles from "./intro.module.css"

/*
 * Cinco versiones de la entrada del portal, SOLO en lila y crema: las dos combinaciones del logo que aprobó el cliente
 * (lila sobre crema y crema sobre lila). Ninguna usa el dorado: el dorado es del spa y queda para cuando el visitante
 * elige esa puerta. La dualidad (la tienda | el spa) se cuenta con la inversión de los dos colores, no con otro color.
 *
 * El CSS vive en intro.module.css; aquí solo está el marcado de cada escena y el tiempo que dura (`exitAt`: cuándo empieza
 * la salida, que es también cuando arranca la entrada del portal; `exitMs`: lo que dura la salida).
 */

export type IntroVersionId = "dos-caras" | "cortina" | "letras" | "arco" | "minima"

export interface IntroVersion {
  id: IntroVersionId
  name: string
  summary: string
  /** ms hasta que empieza la salida (y con ella la entrada del portal). */
  exitAt: number
  /** ms que dura la salida. */
  exitMs: number
  Scene: () => ReactElement
}

const tag = (side: "L" | "R", tone: "cream" | "lila", motion: string) =>
  cn("font-display", styles.tag, side === "L" ? styles.tagL : styles.tagR, tone === "cream" ? styles.onCream : styles.onLila, motion)

const logo = (tone: "lila" | "crema", ...extra: string[]) => cn(styles.mask, styles.logo, tone === "lila" ? styles.lila : styles.crema, ...extra)

/* ═════ A · Dos caras ═════ */
function DosCaras() {
  return (
    <>
      <div className={cn(styles.layer, styles.cream, styles.aBase)}>
        <div className={logo("lila", styles.logoIn)} />
        <span className={tag("L", "cream", styles.tagIn)}>La tienda</span>
      </div>
      <div className={cn(styles.layer, styles.lilaBg, styles.aRight)}>
        <div className={logo("crema", styles.logoIn)} />
        <span className={tag("R", "lila", styles.tagIn)}>El spa</span>
      </div>
    </>
  )
}

/* ═════ B · Cortina de color ═════ */
function Cortina() {
  return (
    <>
      <div className={cn(styles.layer, styles.cream, styles.bBase)}>
        <div className={logo("lila", styles.logoIn)} />
      </div>
      <div className={cn(styles.layer, styles.lilaBg, styles.bPanel)}>
        <div className={logo("crema", styles.logoIn)} />
        <span className={tag("L", "lila", styles.bTag)}>La tienda</span>
        <span className={tag("R", "lila", styles.bTag)}>El spa</span>
      </div>
    </>
  )
}

/* ═════ C · Letras ═════
 * Las seis letras de "Queens" son las del logo oficial, sueltas (queens-letter-0..5.webp, las mismas del pie de página).
 * Cajas en px del lienzo de 1520×413 de la palabra (igual que en footer.tsx); ese lienzo empieza en (464, 2281) del imagotipo
 * original y el logo de imagotipo-cosmetics.webp se recortó desde (462, 0) y mide 1530×2890 (scripts/brand-imagotipo.mjs). */
const LOGO_W = 1530
const LOGO_H = 2890
const LETTERS_AT = { x: 2, y: 2281 }
const LETTERS = [
  { x: 3, y: 3, w: 361, h: 407 }, // Q
  { x: 350, y: 91, w: 241, h: 240 }, // u
  { x: 606, y: 92, w: 222, h: 238 }, // e
  { x: 842, y: 92, w: 222, h: 238 }, // e
  { x: 1076, y: 91, w: 249, h: 235 }, // n
  { x: 1337, y: 92, w: 180, h: 238 }, // s
]

function Letras() {
  return (
    <>
      <div className={cn(styles.layer, styles.cream, styles.cBg)} />
      <div className={styles.cBox}>
        <div className={cn(styles.mask, styles.cPart, styles.cIso, styles.lila)} style={{ "--o": 0 } as CSSProperties} />
        {LETTERS.map((l, i) => {
          const url = `url(/images/brand/queens-letter-${i}.webp)`
          return (
            <span
              key={i}
              className={styles.cLetter}
              style={
                {
                  left: `${((LETTERS_AT.x + l.x) / LOGO_W) * 100}%`,
                  top: `${((LETTERS_AT.y + l.y) / LOGO_H) * 100}%`,
                  width: `${(l.w / LOGO_W) * 100}%`,
                  height: `${(l.h / LOGO_H) * 100}%`,
                  WebkitMaskImage: url,
                  maskImage: url,
                  "--i": i,
                  "--o": i + 1,
                } as CSSProperties
              }
            />
          )
        })}
        <div className={cn(styles.mask, styles.cPart, styles.cCos, styles.lila)} style={{ "--o": 7 } as CSSProperties} />
      </div>
    </>
  )
}

/* ═════ D · Arco ═════ */
function Hoja({ side }: { side: "L" | "R" }) {
  return (
    <div className={cn(styles.dLeaf, side === "L" ? styles.dLeafL : styles.dLeafR)}>
      <div className={styles.dArch}>
        <div className={logo("crema", styles.dLogo)} />
      </div>
    </div>
  )
}

function Arco() {
  return (
    <>
      <div className={cn(styles.layer, styles.cream, styles.dBg)} />
      <div className={styles.dGate}>
        <Hoja side="L" />
        <Hoja side="R" />
      </div>
      <span className={tag("L", "cream", cn(styles.tagIn, styles.dTag))}>La tienda</span>
      <span className={tag("R", "cream", cn(styles.tagIn, styles.dTag))}>El spa</span>
    </>
  )
}

/* ═════ E · Mínima ═════ */
function Minima() {
  return (
    <>
      <div className={cn(styles.layer, styles.cream, styles.eBg)} />
      <div className={logo("lila", styles.eLogo)} />
      <span className={tag("L", "cream", styles.eTag)}>La tienda</span>
      <span className={tag("R", "cream", styles.eTag)}>El spa</span>
    </>
  )
}

export const INTRO_VERSIONS: Record<IntroVersionId, IntroVersion> = {
  "dos-caras": {
    id: "dos-caras",
    name: "Dos caras",
    summary:
      "La pantalla se parte en dos: crema con el logo lila a la izquierda y lila con el logo crema a la derecha. El logo cambia de color justo en el centro, sin ninguna línea, y se abre como una puerta doble hacia el portal.",
    exitAt: 2000,
    exitMs: 800,
    Scene: DosCaras,
  },
  cortina: {
    id: "cortina",
    name: "Cortina de color",
    summary:
      "Arranca crema con el logo lila. Una cortina lila sube por la pantalla y el logo se invierte justo en su borde: se ven las dos combinaciones, una detrás de la otra. Luego la cortina se va hacia arriba y deja el portal.",
    exitAt: 2100,
    exitMs: 900,
    Scene: Cortina,
  },
  letras: {
    id: "letras",
    name: "Letras",
    summary:
      "La corona y el monograma se dibujan de arriba abajo y las seis letras de Queens (las del logo oficial) suben una por una, igual que en el pie de página. Todo en lila sobre crema y sin cortinas.",
    exitAt: 2150,
    exitMs: 650,
    Scene: Letras,
  },
  arco: {
    id: "arco",
    name: "Arco",
    summary:
      "Un arco lila, el mismo de las fotos del portal, sube desde el piso con el logo crema adentro y se abre en dos hojas hacia “La tienda” y “El spa”, como una puerta.",
    exitAt: 2100,
    exitMs: 950,
    Scene: Arco,
  },
  minima: {
    id: "minima",
    name: "Mínima",
    summary:
      "La más corta, al estilo de las marcas del mercado: el logo lila aparece sobre crema, respira un instante y deja pasar al portal. Es la que menos estorba a quien viene a comprar.",
    exitAt: 1500,
    exitMs: 550,
    Scene: Minima,
  },
}

export const INTRO_VERSION_LIST: IntroVersion[] = [
  INTRO_VERSIONS["dos-caras"],
  INTRO_VERSIONS.cortina,
  INTRO_VERSIONS.letras,
  INTRO_VERSIONS.arco,
  INTRO_VERSIONS.minima,
]

export function isIntroVersionId(value: string | null | undefined): value is IntroVersionId {
  return !!value && Object.prototype.hasOwnProperty.call(INTRO_VERSIONS, value)
}
