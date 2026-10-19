"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogPortal = DialogPrimitive.Portal

/*
 * The open/close motion is plain CSS: the keyframes (overlay-in/out, sheet-in/out) live in
 * globals.css, and Radix keeps the element mounted until the closing animation ends. There
 * is no animation plugin in this project, so plugin classes such as `animate-in` or
 * `slide-in-from-right` do nothing here.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-[var(--ink)]/60 motion-safe:data-[state=open]:animate-[overlay-in_0.3s_ease-out] motion-safe:data-[state=closed]:animate-[overlay-out_0.2s_cubic-bezier(0.23,1,0.32,1)_forwards]",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "right" | "center"
    /** Reposition or restyle the close button (the cart puts it on the left, square). */
    closeClassName?: string
  }
>(({ className, children, side = "center", closeClassName, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 gap-4 bg-white shadow-2xl",
        side === "right" &&
          "right-0 top-0 h-full w-full max-w-md motion-safe:data-[state=open]:animate-[sheet-in_0.45s_cubic-bezier(0.16,1,0.3,1)] motion-safe:data-[state=closed]:animate-[sheet-out_0.2s_cubic-bezier(0.23,1,0.32,1)_forwards]",
        side === "center" &&
          "left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={cn("absolute right-4 top-4 rounded-full p-2 text-[var(--ink)] transition hover:bg-[var(--face-light)]/40", closeClassName)}>
        <X className="h-5 w-5" />
        <span className="sr-only">Cerrar</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-display text-2xl font-bold", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--muted-foreground)]", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
}
