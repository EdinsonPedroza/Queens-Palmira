import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--gold)] text-[var(--ink)]",
        new: "bg-[var(--rose-hot)] text-white",
        bestseller: "bg-[var(--ink)] text-[var(--gold)]",
        offer: "bg-[var(--rose-hot)] text-white animate-pulse-rose",
        outline: "border border-[var(--gold)] text-[var(--gold-deep)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
