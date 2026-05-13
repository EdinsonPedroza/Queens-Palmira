"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-(--rose-pastel)/30 p-2 backdrop-blur",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium tracking-wide",
      "transition-all duration-200 cursor-pointer select-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-(--ink)/60 hover:text-ink hover:bg-white/60 hover:scale-[1.03]",
      "data-[state=active]:bg-white data-[state=active]:text-gold-deep data-[state=active]:font-semibold",
      "data-[state=active]:shadow-[0_4px_20px_-4px_rgba(212,175,55,0.45),0_0_0_1.5px_rgba(212,175,55,0.25)]",
      "data-[state=active]:scale-[1.04]",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-8 focus-visible:outline-none data-[state=active]:animate-fade-up",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
