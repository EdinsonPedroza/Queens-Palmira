"use client"

import { useState, type ReactNode } from "react"
import { AnimatePresence, m } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

/*
 * TEMPORARY preview: "Actual" vs "Propuesto" for the animation fixes found in
 * the /improve-animations audit. Delete with app/cosmetics/animaciones once
 * the client / owner decides.
 */

const OUT_STRONG = [0.23, 1, 0.32, 1] as const
const SHEET_IN = [0.16, 1, 0.3, 1] as const
const SHEET_OUT_CURRENT = [0.7, 0, 0.84, 0] as const
const PHOTO = "/images/products/Base HUMIDE Montoc.webp"

function Pair({
  title,
  note,
  current,
  proposed,
  applied,
}: {
  title: string
  note: string
  current: ReactNode
  proposed: ReactNode
  applied?: boolean
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-8 md:px-10">
      <h2 className="text-2xl md:text-3xl">
        {title}
        {applied && <span className="ml-3 align-middle text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--face-deep)]">Ya aplicado en el sitio</span>}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">{note}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--face-light)] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Actual</p>
          {current}
        </div>
        <div className="rounded-2xl border border-[var(--face)] p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--face-deep)]">Propuesto</p>
          {proposed}
        </div>
      </div>
    </section>
  )
}

/* 1 — buttons: transition-all and no press feedback */
function ButtonDemo({ proposed, k }: { proposed?: boolean; k: number }) {
  return (
    <div className="flex h-40 flex-wrap items-center justify-center gap-4">
      <Button
        data-testid={proposed ? "btn-proposed" : "btn-current"}
        style={{ transitionDuration: `${(proposed ? 160 : 150) * k}ms` }}
        className={proposed ? "transition-[translate,scale,box-shadow,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97]" : "transition-all active:scale-100"}
      >
        Ver catálogo
      </Button>
      <Button
        variant="outline"
        style={{ transitionDuration: `${(proposed ? 160 : 150) * k}ms` }}
        className={proposed ? "transition-[translate,scale,box-shadow,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97]" : "transition-all active:scale-100"}
      >
        Escríbenos
      </Button>
    </div>
  )
}

/* 2 — floating cart chip: scale 0 vs 0.85 */
function CartChipDemo({ from }: { from: number }) {
  const [show, setShow] = useState(true)
  return (
    <div>
      <div className="relative flex h-40 items-center justify-center">
        <AnimatePresence>
          {show && (
            <m.div
              initial={{ scale: from, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: from, opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 440, damping: 26 }}
              className="flex items-center gap-3 rounded-2xl bg-[var(--face-deep)] px-4 py-3 text-white"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="flex flex-col leading-none">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/75">Mi carrito</span>
                <span className="mt-0.5 text-sm font-black">$45.000</span>
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="w-full cursor-pointer border border-[var(--ink)]/30 py-2 text-[11.5px] uppercase tracking-[0.16em]"
      >
        {show ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  )
}

/* 3 — cart drawer: how it closes */
function DrawerDemo({ proposed, k }: { proposed?: boolean; k: number }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <div className="relative h-52 overflow-hidden rounded-xl bg-[var(--face-soft)]">
        <m.div
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: (open ? 0.3 : 0.25) * k, ease: open || proposed ? "easeOut" : "easeIn" }}
          className="absolute inset-0 bg-[var(--ink)]/50"
        />
        <m.div
          initial={false}
          animate={{ x: open ? "0%" : "100%" }}
          transition={
            open
              ? { duration: 0.45 * k, ease: SHEET_IN }
              : proposed
                ? { duration: 0.2 * k, ease: OUT_STRONG }
                : { duration: 0.3 * k, ease: SHEET_OUT_CURRENT }
          }
          className="absolute right-0 top-0 flex h-full w-3/5 flex-col gap-2 bg-[var(--crema)] p-4 shadow-xl"
        >
          <p className="text-sm font-bold">Tu carrito</p>
          <div className="h-3 w-4/5 rounded bg-[var(--face-light)]/60" />
          <div className="h-3 w-3/5 rounded bg-[var(--face-light)]/60" />
          <div className="h-3 w-2/3 rounded bg-[var(--face-light)]/60" />
        </m.div>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 w-full cursor-pointer border border-[var(--ink)]/30 py-2 text-[11.5px] uppercase tracking-[0.16em]"
      >
        {open ? "Cerrar carrito" : "Abrir carrito"}
      </button>
    </div>
  )
}

/* 4 — product photo hover zoom */
function HoverDemo({ ms, k }: { ms: number; k: number }) {
  return (
    <div className="group mx-auto flex h-52 w-44 items-end justify-center overflow-hidden rounded-xl bg-[#f3e4e6]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={PHOTO}
        alt="Base HUMIDE Montoc"
        style={{ transitionDuration: `${ms * k}ms` }}
        className="h-full w-full origin-bottom object-contain object-bottom transition-transform ease-out group-hover:scale-[1.05]"
      />
    </div>
  )
}

/* 6 — switching category: wait-for-exit + double animation vs. instant swap + one stagger */
function CategoryDemo({ proposed, k }: { proposed?: boolean; k: number }) {
  const [cat, setCat] = useState(0)
  const names = ["Labiales", "Rostro"]
  const tiles = Array.from({ length: 10 }, (_, i) => i)
  const grid = (
    <>
      {tiles.map((i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, y: proposed ? 10 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            proposed
              ? { delay: Math.min(i, 7) * 0.03 * k, duration: 0.25 * k, ease: OUT_STRONG }
              : { delay: Math.min(i, 11) * 0.04 * k, duration: 0.35 * k, ease: SHEET_IN }
          }
          className={`grid aspect-[3/4] place-items-center rounded-lg text-xs font-bold ${cat === 0 ? "bg-[var(--face-light)]/60" : "bg-[var(--face-soft)]"}`}
        >
          {names[cat]} {i + 1}
        </m.div>
      ))}
    </>
  )
  return (
    <div>
      <div className="mb-3 flex gap-2">
        {names.map((n, i) => (
          <button
            key={n}
            type="button"
            onClick={() => setCat(i)}
            className={`flex-1 cursor-pointer py-2 text-[11.5px] uppercase tracking-[0.16em] ${cat === i ? "bg-[var(--ink)] text-[var(--crema)]" : "bg-[var(--face-light)]/40"}`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="h-56 overflow-hidden">
        {proposed ? (
          <div key={cat} className="grid grid-cols-5 gap-2">{grid}</div>
        ) : (
          <AnimatePresence mode="wait">
            <m.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 * k, ease: SHEET_IN }}
              className="grid grid-cols-5 gap-2"
            >
              {grid}
            </m.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

/* 7 — mobile menu / search box: transition-all 400ms vs. only what moves, 200ms in / 150ms out */
function MenuDemo({ proposed, k }: { proposed?: boolean; k: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="relative h-44 overflow-hidden rounded-xl bg-[var(--face-soft)]">
        <div
          style={{ transitionDuration: `${(proposed ? (open ? 200 : 150) : 400) * k}ms` }}
          className={[
            "absolute inset-x-3 top-3 rounded-2xl bg-[var(--crema)] p-4 shadow-xl",
            proposed ? "transition-[opacity,translate] ease-out" : "transition-all",
            open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
          ].join(" ")}
        >
          {["Labiales", "Rostro", "Ojos", "Skin Care"].map((n) => (
            <p key={n} className="py-1.5 text-sm font-medium">{n}</p>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 w-full cursor-pointer border border-[var(--ink)]/30 py-2 text-[11.5px] uppercase tracking-[0.16em]"
      >
        {open ? "Cerrar menú" : "Abrir menú"}
      </button>
    </div>
  )
}

/* 8 — "Ver más": Framer scale + CSS transition-all on the same element */
function MoreButtonDemo({ proposed }: { proposed?: boolean }) {
  return (
    <div className="flex h-40 items-center justify-center">
      <m.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className={`flex cursor-pointer items-center gap-2 rounded-2xl bg-[var(--face)] px-10 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-[var(--face-deep)] duration-200 ${proposed ? "transition-colors" : "transition-all"}`}
      >
        Ver 20 más
      </m.button>
    </div>
  )
}

/* 9 — removing an item from the cart: vanishes vs. fades out and closes the gap */
function RemoveDemo({ proposed }: { proposed?: boolean }) {
  const all = ["Labial Mate Rosa", "Base Fit Me 16H", "Esmalte Masglo"]
  const [items, setItems] = useState(all)
  const row = (n: string) => (
    <div className="flex items-center justify-between rounded-xl border border-[var(--face-light)]/40 bg-white p-3 text-sm">
      <span>{n}</span>
      <button type="button" onClick={() => setItems((l) => l.filter((x) => x !== n))} className="cursor-pointer text-xs text-red-500">
        Quitar
      </button>
    </div>
  )
  return (
    <div>
      <div className="flex min-h-[10.5rem] flex-col gap-2">
        {proposed ? (
          <AnimatePresence initial={false}>
            {items.map((n) => (
              <m.div
                key={n}
                exit={{ opacity: 0, x: 24, height: 0, marginTop: -8 }}
                transition={{ duration: 0.2, ease: OUT_STRONG }}
                className="overflow-hidden"
              >
                {row(n)}
              </m.div>
            ))}
          </AnimatePresence>
        ) : (
          items.map((n) => <div key={n}>{row(n)}</div>)
        )}
      </div>
      <button
        type="button"
        onClick={() => setItems(all)}
        className="mt-3 w-full cursor-pointer border border-[var(--ink)]/30 py-2 text-[11.5px] uppercase tracking-[0.16em]"
      >
        Restablecer
      </button>
    </div>
  )
}

export function AnimationFixesPreview() {
  const [slow, setSlow] = useState(false)
  const k = slow ? 4 : 1
  return (
    <>
      <div className="sticky top-0 z-40 border-b border-[var(--face-light)] bg-[var(--crema)]/95 px-6 py-3 backdrop-blur">
        <label className="mx-auto flex max-w-5xl cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} className="h-4 w-4 accent-[var(--face-deep)]" data-testid="slowmo" />
          <span>
            <strong>Cámara lenta ×4</strong> — para ver bien la diferencia (no afecta el carrito flotante)
          </span>
        </label>
      </div>

      <Pair
        title="1 · Botones"
        note="Actual: no se hunden al presionar. Propuesto: se hunden un poco (scale 0.97) y solo animan lo necesario. Pasa el mouse y mantén el clic."
        current={<ButtonDemo k={k} />}
        proposed={<ButtonDemo proposed k={k} />}
        applied
      />
      <Pair
        title="2 · Cerrar el carrito"
        note="Actual: la salida arranca lenta (ease-in). Propuesto: sale rápido desde el primer instante (ease-out, 200 ms). Abrir queda igual."
        current={<DrawerDemo k={k} />}
        proposed={<DrawerDemo proposed k={k} />}
        applied
      />
      <Pair
        title="3 · Carrito flotante"
        note="Actual: aparece y desaparece desde un punto (scale 0). Propuesto: desde 0.85, más natural. Es un cambio sutil; dale a Ocultar/Mostrar varias veces."
        current={<CartChipDemo from={0} />}
        proposed={<CartChipDemo from={0.85} />}
      />
      <Pair
        title="4 · Zoom de la foto al pasar el mouse"
        note="Actual: 700 ms. Propuesto: 300 ms. Pasa el mouse por encima y sácalo. Esta es decisión tuya: 700 ms es más lento y “de lujo”, 300 ms es más ágil."
        current={<HoverDemo ms={700} k={k} />}
        proposed={<HoverDemo ms={300} k={k} />}
      />
      <div className="mx-auto max-w-5xl px-6 pt-10 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Revisión general · nuevos</p>
      </div>
      <Pair
        title="6 · Cambiar de categoría"
        note="Actual: la rejilla vieja se va (0,3 s), luego entra la nueva y cada tarjeta entra también: ~1 s hasta que se asienta. Propuesto: cambio inmediato y solo las tarjetas entran, más rápido. Cambia de categoría varias veces."
        current={<CategoryDemo k={k} />}
        proposed={<CategoryDemo proposed k={k} />}
        applied
      />
      <Pair
        title="7 · Menú de celular y caja de búsqueda"
        note="Actual: 400 ms al abrir y al cerrar. Propuesto: 200 ms al abrir y 150 ms al cerrar, con ease-out. Se siente más ágil."
        current={<MenuDemo k={k} />}
        proposed={<MenuDemo proposed k={k} />}
      />
      <Pair
        title="8 · Botón “Ver más”"
        note="Actual: el botón crece con Framer Motion y a la vez una transición CSS suaviza ese mismo movimiento (se pelean). Propuesto: solo la de Framer. Pasa el mouse y haz clic rápido varias veces; la diferencia es sutil y depende de tu equipo."
        current={<MoreButtonDemo />}
        proposed={<MoreButtonDemo proposed />}
        applied
      />
      <Pair
        title="9 · Quitar un producto del carrito"
        note="Actual: el producto desaparece de golpe y los demás saltan. Propuesto: se desvanece y los demás suben suavemente. Es un añadido, no una corrección."
        current={<RemoveDemo />}
        proposed={<RemoveDemo proposed />}
        applied
      />
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-4 md:px-10">
        <h2 className="text-2xl">5 · “Reducir movimiento”</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Esto no se puede mostrar aquí: es un ajuste invisible para quien tiene activada la opción “reducir animaciones” en su dispositivo, y hace que las animaciones de Framer Motion también la respeten. Sin cambio visual para el resto.
        </p>
      </section>
    </>
  )
}
