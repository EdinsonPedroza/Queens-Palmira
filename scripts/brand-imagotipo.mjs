// Generates public/images/brand/imagotipo-cosmetics.webp: the OFFICIAL stacked logo (crown + monogram, "Queens", "cosmetics"),
// cut from ACTUALIZACION/NEWW/Imagotipo queens.png and flattened to the lila of the palette (only its alpha channel matters:
// the intro paints it in any colour through a CSS mask, so one file serves lila-on-crema and crema-on-lila).
// Run if the logo changes:  node scripts/brand-imagotipo.mjs
import sharp from "sharp"

const SRC = "ACTUALIZACION/NEWW/Imagotipo queens.png"
const OUT = "public/images/brand/imagotipo-cosmetics.webp"

// Measured on the 2344×3014 original (rows/cols with alpha > 40): crown + monogram rows 0–2140, "Queens" rows 2287–2687
// (x 470–1977), "cosmetics" rows 2719–2881 (x 751–1775); the whole logo spans x 468–1985. A few px of air on each side.
const CROP = { left: 462, top: 0, width: 1530, height: 2890 }
const WIDTH = 760
const LILA = [0xa4, 0x8b, 0xa6]

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .extract(CROP)
  .resize({ width: WIDTH, kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true })

for (let i = 0; i < info.width * info.height; i++) {
  data[i * 4] = LILA[0]
  data[i * 4 + 1] = LILA[1]
  data[i * 4 + 2] = LILA[2]
}

await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .webp({ lossless: true, alphaQuality: 100, effort: 6 })
  .toFile(OUT)

console.log(`${OUT}: ${info.width}×${info.height}`)

// Self-check: the six loose letters of "Queens" (queens-letter-0..5, boxes from components/sections/footer.tsx, drawn on a
// 1520×413 canvas whose origin is (464, 2281) in the original) must land on the lettering of this file.
const LETTERS = [
  { x: 3, y: 3, w: 361, h: 407 },
  { x: 350, y: 91, w: 241, h: 240 },
  { x: 606, y: 92, w: 222, h: 238 },
  { x: 842, y: 92, w: 222, h: 238 },
  { x: 1076, y: 91, w: 249, h: 235 },
  { x: 1337, y: 92, w: 180, h: 238 },
]
const k = info.width / CROP.width
const layers = []
for (const [i, l] of LETTERS.entries()) {
  const input = await sharp(`public/images/brand/queens-letter-${i}.webp`)
    .resize({ width: Math.round(l.w * k), height: Math.round(l.h * k), fit: "fill" })
    .toBuffer()
  layers.push({ input, left: Math.round((464 + l.x - CROP.left) * k), top: Math.round((2281 + l.y - CROP.top) * k) })
}
const letters = await sharp({ create: { width: info.width, height: info.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(layers)
  .raw()
  .toBuffer()
const y0 = Math.round(2287 * k)
const y1 = Math.round(2687 * k)
let diff = 0
let ink = 0
for (let y = y0; y < y1; y++) {
  for (let x = 0; x < info.width; x++) {
    const a = data[(y * info.width + x) * 4 + 3]
    const b = letters[(y * info.width + x) * 4 + 3]
    diff += Math.abs(a - b)
    ink += a
  }
}
console.log(`letters vs lettering: ${((diff / ink) * 100).toFixed(2)}% of the ink differs (0 = pixel perfect)`)
