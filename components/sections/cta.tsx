"use client"

import { MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WA_ADVICE } from "@/lib/whatsapp"

export function CTA() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-queens-gradient-intense" />

      <div className="relative mx-auto max-w-4xl px-6 md:px-10 text-center text-white">
        <Sparkles className="mx-auto mb-6 h-10 w-10 text-white/80" />
        <h2
          className="font-display font-semibold mb-5 leading-tight"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.04em" }}
        >
          ¿Lista para encontrar tu próximo favorito?
        </h2>
        <p className="mx-auto max-w-xl text-base md:text-lg text-white/85 mb-10">
          Escríbenos por WhatsApp y te asesoramos con los productos perfectos
          para ti. Local 128, Unicentro Palmira.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="whatsapp" size="xl">
            <a href={WA_ADVICE} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-6 w-6" />
              Asesoría gratis por WhatsApp
            </a>
          </Button>
          <Button
            asChild
            size="xl"
            className="bg-white text-ink hover:bg-white/90 border-white shadow-xl"
          >
            <a href="#catalogo">Ver catálogo</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
