"use client"

import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PICKER_VARIANTS, PickerOptions, ServicePickerContent, type PickerVariant } from "@/components/sections/spa-service-picker"
import { SPA_GROUPS, servicesOf, type SpaGroup } from "@/lib/spa-services"
import { cn } from "@/lib/utils"

/*
 * TEMPORARY view (noindex) at /spa/ventana-ideas: refinements of the spa's service picker (the client: "diferentes diseños, pero parecidos a lo que ya está, como una mejora; me
 * gusta la referencia tipo Apple, pero dame más ideas"), side by side. The options of every card work, and each card has a button that opens the REAL window with that idea (on a
 * phone it is a sheet, on an iPad or a computer a card). When the client picks one: make it the default `variant` of ServicePickerContent, delete the other four from
 * spa-service-picker.tsx, and delete this file and app/spa/ventana-ideas.
 */

const GROUPS = SPA_GROUPS.filter((g) => g.ask)

function IdeaCard({ n, id, name, note, group }: { n: number; id: PickerVariant; name: string; note: string; group: SpaGroup }) {
  const items = servicesOf(group.id)
  const [picked, setPicked] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <article data-testid={`idea-${id}`} className="flex flex-col rounded-3xl bg-white p-5 shadow-[0_18px_40px_-28px_color-mix(in_oklab,var(--ink)_45%,transparent),inset_0_0_0_1px_color-mix(in_oklab,var(--face)_30%,transparent)] md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--face-deep)]">{n === 0 ? "Referencia" : `Idea ${n}`}</p>
      <h2 className="mt-1.5 font-display text-[1.5rem] font-semibold leading-none tracking-[-0.02em]">{name}</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/70">{note}</p>

      <div className="mt-3 flex-1 rounded-2xl bg-[var(--crema)] px-4 pb-4 pt-3.5">
        <p className="font-display text-[1.15rem] font-semibold leading-tight tracking-[-0.02em]">{group.ask}</p>
        <PickerOptions variant={id} items={items} picked={picked} onPick={setPicked} legend={`${group.title}: ${name}`} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            data-testid={`idea-open-${id}`}
            className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center rounded-full bg-[var(--ink)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--crema)] transition-colors duration-200 hover:bg-[var(--ciruela)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
          >
            Ver la ventana completa
          </button>
        </DialogTrigger>
        <ServicePickerContent group={group} items={items} variant={id} onDone={() => setOpen(false)} />
      </Dialog>
    </article>
  )
}

export function SpaPickerPreview() {
  const [groupId, setGroupId] = useState(GROUPS[0].id)
  const group = GROUPS.find((g) => g.id === groupId) ?? GROUPS[0]

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--face-deep)]">Vista temporal</p>
      <h1 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.03em]">Mejoras para la ventana de servicios</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
        Cinco ideas parecidas a la que ya tienes (la primera tarjeta), con referencias tipo Apple. Prueba las opciones en cada tarjeta y abre la ventana completa de la que más te guste:
        en el iPad y en el computador es una tarjeta, en el celular una hoja que sube.
      </p>

      <div role="group" aria-label="Tarjeta del menú" className="mt-6 flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={g.id === groupId}
            onClick={() => setGroupId(g.id)}
            className={cn(
              "h-10 cursor-pointer rounded-full px-5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]",
              g.id === groupId ? "bg-[var(--face)] text-[var(--ink)]" : "bg-[color-mix(in_oklab,var(--face)_14%,var(--crema))] text-ink hover:bg-[color-mix(in_oklab,var(--face)_26%,var(--crema))]",
            )}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PICKER_VARIANTS.map((v, i) => (
          <IdeaCard key={`${group.id}-${v.id}`} n={i} id={v.id} name={v.name} note={v.note} group={group} />
        ))}
      </div>
    </div>
  )
}
