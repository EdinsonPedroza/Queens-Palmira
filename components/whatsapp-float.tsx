"use client"

import { useEffect, useState } from "react"
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
          <span className="text-[var(--muted-foreground)]">¿En qué te ayudamos?</span>
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
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 relative z-10"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.648 4.8 1.778 6.817L2 30l7.38-1.933A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 0 1-5.89-1.607l-.422-.25-4.378 1.147 1.168-4.267-.275-.437A11.556 11.556 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.34-8.64c-.347-.174-2.055-1.014-2.374-1.13-.32-.115-.552-.173-.784.174-.232.347-.9 1.13-1.103 1.362-.202.232-.405.26-.752.087-.347-.174-1.463-.54-2.787-1.72-1.03-.918-1.724-2.052-1.927-2.4-.202-.347-.022-.535.152-.708.156-.155.347-.405.52-.607.174-.203.232-.347.347-.578.116-.232.058-.434-.029-.607-.087-.173-.784-1.89-1.074-2.587-.283-.68-.57-.587-.784-.598l-.667-.012c-.232 0-.607.087-.925.434-.319.347-1.218 1.19-1.218 2.902 0 1.713 1.247 3.368 1.42 3.6.174.232 2.454 3.747 5.946 5.254.832.359 1.48.573 1.986.733.834.266 1.594.228 2.194.138.669-.1 2.055-.84 2.346-1.652.29-.811.29-1.507.202-1.652-.086-.144-.318-.232-.665-.405z" />
        </svg>
      </a>
    </div>
  )
}
