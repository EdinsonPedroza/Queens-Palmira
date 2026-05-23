import Image from "next/image"
import { cn } from "@/lib/utils"

interface QueensLogoProps {
  className?: string
  variant?: "default" | "white"
  size?: number
}

export function QueensLogo({ className, variant = "default", size = 48 }: QueensLogoProps) {
  const isWhite = variant === "white"
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/images/logoFondo.png"
        alt="Queens Cosmetics"
        width={size}
        height={size}
        quality={100}
        className="shrink-0"
        style={isWhite ? { filter: "brightness(0) invert(1)" } : undefined}
        priority
      />
      <span
        className={cn(
          "font-display tracking-[0.18em] font-bold text-2xl",
          isWhite ? "text-white" : "text-ink"
        )}
      >
        QUEENS
      </span>
    </div>
  )
}
