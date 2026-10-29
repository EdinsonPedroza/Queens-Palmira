import type { Metadata } from "next"
import { SpaPickerPreview } from "@/components/sections/spa-picker-preview"

// Temporary view to compare ideas: it is not indexed and not linked from anywhere. It is published with the site: delete it once the client has chosen (see spa-picker-preview.tsx).
export const metadata: Metadata = {
  title: "Ideas de la ventana de servicios | Queens Spa",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

export default function VentanaIdeasPage() {
  return (
    <main className="min-h-screen bg-white text-[var(--ink)]">
      <SpaPickerPreview />
    </main>
  )
}
