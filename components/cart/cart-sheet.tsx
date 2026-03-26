"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getCartCount,
  getCartSubtotal,
  useCartStore,
} from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

export function CartSheet() {
  const items = useCartStore((state) => state.items);
  const open = useCartStore((state) => state.open);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);

  const count = getCartCount(items);
  const subtotal = getCartSubtotal(items);

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? openCart() : closeCart())}
    >
      <SheetTrigger asChild>
        <Button className="relative" aria-label="Open cart" data-testid="cart-trigger">
          <ShoppingBag className="size-4" />

          {count > 0 ? (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              {count}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        data-testid="cart-sheet"
        className="w-full max-w-md gap-0 border-l border-white/5 bg-surface px-6 py-6 shadow-[0_0_80px_rgba(0,0,0,0.5)] sm:max-w-md"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <SheetHeader className="gap-0 p-0">
              <SheetTitle className="font-display text-3xl text-white! font-semibold">
                Cart
              </SheetTitle>
              <SheetDescription className="sr-only">
                Review the items in your cart before checkout.
              </SheetDescription>
            </SheetHeader>
            <SheetClose asChild>
              <Button size="icon" variant="ghost" aria-label="Close cart">
                <X className="size-4" />
              </Button>
            </SheetClose>
          </div>
          <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
            {items.length === 0 ? (
              <div className="rounded-[1.5rem] bg-surface-low p-6 text-sm text-muted-foreground">
                Your cart is empty.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="rounded-[1.5rem] bg-surface-low p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="size-24 rounded-2xl object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-primary-strong">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            aria-label={`Decrease quantity for ${item.product.title}`}
                            onClick={() => decrement(item.product.id)}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="w-8 text-center text-sm text-white">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            aria-label={`Increase quantity for ${item.product.title}`}
                            onClick={() => increment(item.product.id)}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Remove ${item.product.title} from cart`}
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="size-4 text-red-300" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-base font-semibold text-primary-strong">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Button asChild className="w-full h-13 rounded-none bg-primary-strong text-white! hover:bg-primary-strong/90">
              <Link href="/checkout" onClick={closeCart}>
                Proceed to checkout
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
