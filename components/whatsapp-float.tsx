"use client"

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { WA_DEFAULT } from "@/lib/whatsapp"

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    const tip = setTimeout(() => setShowTip(true), 3500)
    const tipOff = setTimeout(() => setShowTip(false), 9000)
    return () => {
      clearTimeout(t)
      clearTimeout(tip)
      clearTimeout(tipOff)
    }
  }, [])

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-end gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {showTip && (
        <div
          className="mb-2 hidden sm:block rounded-2xl bg-white px-4 py-2.5 text-sm shadow-lg border border-[var(--rose-pastel)] animate-fade-up"
          role="tooltip"
        >
          <span className="font-medium">¡Hola Reina!</span>{" "}
          <span className="text-[var(--muted-foreground)]">¿En qué te ayudamos? 💖</span>
        </div>
      )}
      <a
        href={WA_DEFAULT}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-4px_rgba(37,211,102,0.6)] transition-all hover:scale-110 hover:shadow-[0_12px_32px_-4px_rgba(37,211,102,0.85)]"
        aria-label="Chatear por WhatsApp"
      >
        <span className="absolute inset-0 rounded-full animate-pulse-rose" />
        <MessageCircle className="h-7 w-7 relative z-10 fill-white" />
      </a>
    </div>
  )
}
