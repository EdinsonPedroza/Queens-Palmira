"use client"

import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, Sparkles } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { formatCOP } from "@/lib/utils"
import { buildOrderMessage, waLink } from "@/lib/whatsapp"

export function CartSidebar() {
  const { items, total, isOpen, closeCart, addItem, setQty, removeItem, clear } =
    useCart()

  const onCheckout = () => {
    const msg = buildOrderMessage(
      items.map((i) => ({ product: i.product, variant: i.variant, qty: i.qty })),
    )
    window.open(waLink(msg), "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => (o ? null : closeCart())}>
      <DialogContent side="right" className="flex flex-col">
        <div className="shrink-0 border-b border-(--rose-pastel)/40 bg-queens-gradient p-6 pb-5">
          <DialogTitle className="flex items-center gap-2 text-ink">
            <ShoppingBag className="h-6 w-6" />
            Tu carrito
          </DialogTitle>
          <DialogDescription className="text-(--ink)/70 mt-1">
            {items.length === 0
              ? "Tu carrito está vacío"
              : `${items.length} producto${items.length > 1 ? "s" : ""} seleccionado${items.length > 1 ? "s" : ""}`}
          </DialogDescription>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-(--rose-pastel)/30 p-6">
              <Sparkles className="h-10 w-10 text-gold" />
            </div>
            <h3 className="font-display text-xl font-semibold">
              Aún no has elegido nada
            </h3>
            <p className="text-sm text-muted-foreground">
              Explora nuestro catálogo y encuentra tu próximo ritual de belleza.
            </p>
            <Button onClick={closeCart} variant="gold">
              Ver catálogo
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map(({ product, variant, qty, key }) => (
                <div
                  key={key}
                  className="flex gap-3 rounded-xl border border-(--rose-pastel)/40 bg-white p-3 transition hover:shadow-md"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-(--rose-pastel)/20">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <h4 className="font-medium text-sm leading-tight line-clamp-2">
                        {product.name}
                      </h4>
                      {variant && (
                        <p className="text-[11px] font-semibold text-gold-deep mt-0.5">
                          Tono: {variant}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatCOP(product.price)} c/u
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 rounded-full bg-(--rose-pastel)/20 p-1">
                        <button
                          type="button"
                          onClick={() => setQty(key, qty - 1)}
                          className="rounded-full p-1 hover:bg-white transition cursor-pointer"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(product.id, variant)}
                          className="rounded-full p-1 hover:bg-white transition cursor-pointer"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(key)}
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-gold-deep">
                    {formatCOP(product.price * qty)}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-red-500 underline underline-offset-2 mx-auto block cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="shrink-0 border-t border-(--rose-pastel)/40 bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total estimado
                </span>
                <span className="font-display text-2xl font-bold text-gold-deep">
                  {formatCOP(total)}
                </span>
              </div>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={onCheckout}
                data-testid="checkout-whatsapp"
              >
                <ShoppingBag className="h-5 w-5" />
                Enviar pedido por WhatsApp
              </Button>
              <p className="text-[11px] text-center text-muted-foreground">
                Confirmamos disponibilidad y método de pago por WhatsApp
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
