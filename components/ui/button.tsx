"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[translate,scale,box-shadow,background-color,border-color,color,opacity] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 tracking-wide",
  {
    variants: {
      variant: {
        // Solid accent of the page (lila on the store, gold on the spa) + near-black text: 6–7:1.
        default:
          "bg-[var(--face)] text-[var(--ink)] shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--face)_60%,transparent)] hover:shadow-[0_12px_32px_-8px_color-mix(in_oklab,var(--face)_90%,transparent)] hover:-translate-y-0.5 btn-shine font-semibold",
        outline:
          "border border-[var(--face)] text-[var(--ink)] bg-white/60 backdrop-blur hover:bg-[var(--face)]/10",
        ghost: "hover:bg-[var(--face-light)]/20 text-[var(--ink)]",
        secondary:
          "bg-[var(--face-light)] text-[var(--ink)] hover:bg-[var(--face-soft)]",
        whatsapp:
          "bg-[#25D366] text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(37,211,102,0.9)] hover:-translate-y-0.5 btn-shine",
        link: "text-[var(--face-deep)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
