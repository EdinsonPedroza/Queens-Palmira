import Image from "next/image"
import { cn } from "@/lib/utils"

interface QueensLogoProps {
  className?: string
  variant?: "default" | "inline" | "white"
  size?: number
}

export function QueensLogo({ className, size = 48 }: QueensLogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/images/logoFondo.png"
        alt="Queens Cosmetics"
        width={size}
        height={size}
        className="shrink-0"
        style={{ mixBlendMode: "multiply" }}
        priority
      />
      <span className="font-display tracking-[0.3em] font-bold text-lg text-[var(--ink)]">
        QUEENS
      </span>
    </div>
  )
}
