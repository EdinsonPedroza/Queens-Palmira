/*
 * The "it went into the cart" motion, kept outside React. Adding a product opens the cart at once (the drawer slides in) and a
 * small copy of the product photo flies from its card to the EXACT spot where it will sit in the cart: the thumbnail of its row.
 * Where it lands, a ring and a handful of brand diamonds go off, and the bag in the drawer's title "swallows" it (squashes and
 * its handle lifts). If the row cannot be found, the photo lands on the title's bag instead; if the drawer is not opening, on the
 * cart button of the header.
 *
 * It is plain DOM + Web Animations on purpose: it only moves `transform` and `opacity` (the compositor does it),
 * it runs once per add (never in a loop) and it needs no state, so no card re-renders for it. Visitors who ask for
 * reduced motion skip all of it; the button label, the badge on the photo and the counters still tell them.
 */

/** Dispatched on `window` when a flying photo lands. */
export const CART_LAND_EVENT = "queens:cart-land"
/** The element the photos fly to when the drawer is not opening (the cart button of the header). */
const TARGET = "[data-cart-target]"
/** The bag icon in the drawer's title. */
const DRAWER_ICON = "[data-cart-drawer-icon]"
const FLIGHT_MS = 560
const OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

/** The card button that opened the cart by adding a product: closing the cart gives the keyboard back to it (the cart has no Radix trigger of its own). */
export const cartOpener: { el: HTMLElement | null } = { el: null }

/** The first ~0.8 s after an add opened the cart: its "arrival" (the shipping bar filling a beat later). Not for pressing + / − inside it. */
let arrivalUntil = 0
export const markArrival = () => { arrivalUntil = Date.now() + 800 }
export const arrivingNow = () => Date.now() < arrivalUntil

let inFlight = 0
/** True while a photo is on its way. */
export const isFlying = () => inFlight > 0

const onScreen = (r: DOMRect) =>
  r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth

/** A ring that spreads out of a rectangle and fades. It lives on <body>, not inside the element (React owns that). */
function ring(r: DOMRect, radius: string) {
  if (!onScreen(r)) return
  const el = document.createElement("span")
  el.setAttribute("aria-hidden", "true")
  Object.assign(el.style, {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.top}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    borderRadius: radius,
    boxShadow: "0 0 0 2px var(--face)",
    pointerEvents: "none",
    zIndex: "10000",
  })
  document.body.append(el)
  const gone = () => el.remove()
  el.animate(
    [
      { transform: "scale(0.9)", opacity: 0.9 },
      { transform: "scale(1.9)", opacity: 0 },
    ],
    { duration: 620, easing: OUT },
  ).finished.then(gone, gone)
}

/** Where the cart button is hit (the header's, or the drawer's icon in the fallback): it grows and a ring spreads out of it. */
function bump(target: HTMLElement) {
  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.28)", offset: 0.28 },
      { transform: "scale(0.94)", offset: 0.6 },
      { transform: "scale(1)" },
    ],
    { duration: 460, easing: "ease-out" },
  )
  ring(target.getBoundingClientRect(), "9999px")
}

/** The bag takes the product in: it squashes like it swallowed something and its handle lifts for a moment, then settles. */
function gulp(icon: HTMLElement) {
  icon.style.transformOrigin = "50% 100%"
  icon.animate(
    [
      { transform: "scale(1, 1)" },
      { transform: "scale(1.18, 0.82)", offset: 0.22 },
      { transform: "scale(0.94, 1.14)", offset: 0.5 },
      { transform: "scale(1, 1)" },
    ],
    { duration: 480, easing: OUT },
  )
  // lucide's ShoppingBag draws its handle as the arc "M16 10a4 4 0 0 1-8 0": it lifts and comes back.
  const handle = Array.from(icon.querySelectorAll<SVGPathElement>("svg path")).find((p) => p.getAttribute("d")?.startsWith("M16 10"))
  if (handle) {
    handle.style.transformBox = "fill-box"
    handle.style.transformOrigin = "50% 100%"
    handle.animate(
      [
        { transform: "translateY(0px) scaleY(1)" },
        { transform: "translateY(-3px) scaleY(1.3)", offset: 0.3 },
        { transform: "translateY(0px) scaleY(1)" },
      ],
      { duration: 520, easing: OUT },
    )
  }
}

/** Eight of the brand's little diamonds fly out of a point and fade: the bit of celebration an add gets (and reaching free shipping). */
export function burst(cx: number, cy: number) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const count = 8
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + 0.4
    const dist = 34 + (i % 3) * 12
    const size = i % 2 ? 6 : 8
    const bit = document.createElement("span")
    bit.setAttribute("aria-hidden", "true")
    Object.assign(bit.style, {
      position: "fixed",
      left: `${cx - size / 2}px`,
      top: `${cy - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "1px",
      background: i % 3 === 0 ? "var(--face-deep)" : "var(--face)",
      pointerEvents: "none",
      zIndex: "10000",
      willChange: "transform, opacity",
    })
    document.body.append(bit)
    const gone = () => bit.remove()
    bit
      .animate(
        [
          { transform: "translate(0px, 0px) rotate(45deg) scale(0.6)", opacity: 1 },
          { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) rotate(${45 + (i % 2 ? 90 : -90)}deg) scale(1)`, opacity: 0 },
        ],
        { duration: 520, easing: OUT },
      )
      .finished.then(gone, gone)
  }
}

const rowThumb = (rowKey?: string) =>
  rowKey ? document.querySelector<HTMLElement>(`[data-cart-row="${CSS.escape(rowKey)}"] [data-cart-thumb]`) : null

/**
 * The spot where `thumb` will sit once the drawer has finished sliding in and its row has finished arriving: what getBoundingClientRect
 * says, minus the translateX both of them still have.
 */
function settledCenter(thumb: HTMLElement) {
  const drawer = thumb.closest<HTMLElement>('[role="dialog"]')
  const row = thumb.closest<HTMLElement>("[data-cart-row]")
  const t = thumb.getBoundingClientRect()
  if (!drawer || !row) return null
  const d = drawer.getBoundingClientRect()
  const drawerShift = d.left - (window.innerWidth - d.width) // the drawer is right-aligned
  const rowShift = new DOMMatrixReadOnly(getComputedStyle(row).transform).m41
  const cx = t.left - drawerShift - rowShift + t.width / 2
  const cy = t.top + t.height / 2
  // Only a row that is really visible in the cart's list is a place to land on.
  if (cy < d.top || cy > Math.min(d.bottom, window.innerHeight)) return null
  return { x: cx, y: cy, size: t.width }
}

/**
 * Flies a copy of the product photo from `from` (any element inside the product's card) to the cart.
 * `toDrawer`: the cart drawer is opening, so the photo lands in it, on the thumbnail of the row `rowKey` (or on the title's bag if that
 * row cannot be found). Otherwise it flies to the header's cart button.
 * Does nothing (the add still happens) when the photo is not on screen, or for reduced motion.
 */
export function flyToCart(from: Element | null | undefined, opts: { toDrawer?: boolean; rowKey?: string } = {}) {
  if (!from || typeof window === "undefined" || document.hidden) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  // The product's own photo (the studio backdrop and other decorations have an empty alt).
  const photo = from.closest('[data-testid^="product-"]')?.querySelector<HTMLImageElement>('img[alt]:not([alt=""])')
  if (!photo?.currentSrc) return
  const a = photo.getBoundingClientRect()
  if (!onScreen(a)) return
  const src = photo.currentSrc

  if (!opts.toDrawer) {
    const target = document.querySelector<HTMLElement>(TARGET)
    if (!target) return
    const b = target.getBoundingClientRect()
    if (!onScreen(b)) return
    launch(a, src, { x: b.left + b.width / 2, y: b.top + b.height / 2, size: 0 }, () => {
      const spot = document.querySelector<HTMLElement>(TARGET)
      if (spot) bump(spot)
    })
    return
  }

  // The drawer is mounting: wait a few frames (about 100 ms at most) for the row to exist, then aim at where it will settle.
  inFlight += 1
  let frames = 0
  const aim = () => {
    const thumb = rowThumb(opts.rowKey)
    const spot = thumb ? settledCenter(thumb) : null
    if (!spot && frames++ < 7) { requestAnimationFrame(aim); return }
    inFlight = Math.max(0, inFlight - 1)

    // Fallback: the title's bag, whose place follows from the drawer's layout (28rem at most, right-aligned, 1.5rem padding).
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const target = spot ?? {
      x: window.innerWidth - Math.min(window.innerWidth, 28 * rem) + 2.25 * rem,
      y: 2.4 * rem,
      size: 0,
    }
    launch(a, src, target, () => {
      const icon = document.querySelector<HTMLElement>(DRAWER_ICON)
      const now = rowThumb(opts.rowKey)
      if (now && spot) {
        const r = now.getBoundingClientRect()
        ring(r, "0.5rem")
        burst(r.left + r.width / 2, r.top + r.height / 2)
        if (icon) gulp(icon)
      } else if (icon) {
        bump(icon)
        const r = icon.getBoundingClientRect()
        burst(r.left + r.width / 2, r.top + r.height / 2)
      }
    })
  }
  requestAnimationFrame(aim)
}

/** The flight itself: from the photo's box to `to`, shrinking to the size of what it lands on (or to a speck when it lands on an icon). */
function launch(a: DOMRect, src: string, to: { x: number; y: number; size: number }, onLand: () => void) {
  const size = Math.round(Math.min(Math.max(Math.min(a.width, a.height) * 0.62, 64), 140))
  const x0 = a.left + a.width / 2
  const y0 = a.top + a.height / 2
  const dx = to.x - x0
  const dy = to.y - y0
  const endScale = to.size > 0 ? to.size / size : 0.16

  const fly = document.createElement("div")
  fly.setAttribute("aria-hidden", "true")
  fly.dataset.cartFly = ""
  Object.assign(fly.style, {
    position: "fixed",
    left: `${x0 - size / 2}px`,
    top: `${y0 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: "none",
    zIndex: "10000",
    willChange: "transform, opacity",
  })
  const img = document.createElement("img")
  img.src = src
  img.alt = ""
  Object.assign(img.style, {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: "drop-shadow(0 10px 12px rgba(40, 15, 50, 0.35))",
  })
  fly.append(img)
  document.body.append(fly)
  inFlight += 1

  let settled = false
  const end = (landed: boolean) => {
    if (settled) return
    settled = true
    clearTimeout(safety)
    fly.remove()
    inFlight = Math.max(0, inFlight - 1)
    if (!landed) return
    onLand()
    window.dispatchEvent(new CustomEvent(CART_LAND_EVENT))
  }
  // A throttled tab can hold back the animation's end: never leave the counter above zero.
  const safety = setTimeout(() => end(true), FLIGHT_MS + 600)

  const anim = fly.animate(
    [
      // Up and out of the card first (ease-out), then down the path to the cart, shrinking.
      { transform: "translate(0px, 0px) scale(1) rotate(0deg)", opacity: 1, offset: 0, easing: OUT },
      { transform: `translate(${dx * 0.42}px, ${dy * 0.42 - 46}px) scale(${Math.max(0.74, endScale)}) rotate(-6deg)`, opacity: 1, offset: 0.38, easing: "cubic-bezier(0.55, 0, 0.85, 0.45)" },
      // It lands at full strength and only then gives way to the real thumbnail underneath.
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotate(0deg)`, opacity: 1, offset: 0.9 },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotate(0deg)`, opacity: to.size > 0 ? 0 : 0.4, offset: 1 },
    ],
    { duration: FLIGHT_MS, fill: "forwards" },
  )
  anim.onfinish = () => end(true)
  anim.oncancel = () => end(false)
}
