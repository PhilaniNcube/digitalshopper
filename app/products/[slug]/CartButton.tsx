"use client"

import { Button } from "@/components/ui/button";
import { Database } from "@/schema";
import { CheckCheck, CheckCircle, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import analytics, { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { productQty, totalCartItems, totalCartPrice } from "@/store/features/cartSlice";
import { increment, decrement, openCart } from "@/store/features/cartSlice";

type CartButtonProps = {
  product: Database["public"]["Tables"]["products"]["Row"];
}

const CartButton = ({product}:CartButtonProps) => {

  const [selectedVariant, setSelectedVariant] = useState("")

    const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.cartItems);

  const totalPrice = useAppSelector(totalCartPrice)

    const totalItems = useAppSelector(totalCartItems);



   const trackRemoveFromCart = () => {
        analytics.track("remove_from_cart", {
         currency: "ZAR",
         items: cartItems.map((item) => ({
           item_id: item.product.product.id,
           item_name: item.product.product.title,
           item_category: item.product.product.category.title,
           item_brand: item.product.product.brand.name,
           price: item.product.product.price,
           quantity: item.qty,
         })),
       });
   }

  const qty =
    cartItems.find(
      (item) =>
        item.product.product.id === product.id &&
        item.product.selectedVariant === selectedVariant
    )?.qty || 0;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {product.variants?.map((variant, index) => (
          <Button
            className={cn(
              selectedVariant === variant.variant_value &&
                "bg-white text-black",
              "border border-black hover:bg-white hover:text-black relative capitalize"
            )}
            type="button"
            key={index}
            onClick={() => setSelectedVariant(variant.variant_value)}
          >
            {selectedVariant === variant.variant_value && (
              <div className="absolute inset-0 flex items-center justify-end -translate-x-1 pointer-events-none">
                <CheckCircle />
              </div>
            )}
            {variant.variant_value}
          </Button>
        ))}
      </div>

      <div className="flex space-x-3 mt-4">
        <div className="flex space-x-3  items-centre bg-slate-200">
          <Button
            onClick={() => {
              dispatch(decrement({ product, selectedVariant }))
              trackRemoveFromCart()
            }}
            className="rounded-none hover:bg-slate-400"
            variant="ghost"
          >
            <MinusIcon className="w-8 h-8" />
          </Button>
          <div className="px-4 flex items-center text-xl font-semibold">
            {qty}
          </div>
          <Button
            onClick={() => {
              dispatch(increment({ product, selectedVariant }))
               analytics.track("add_to_cart", {
                 currency: "ZAR",
                 value: product.price,
                 items: [
                   {
                     item_id: product.id,
                     item_name: product.title,
                     item_category: product.category.title,
                     item_category_2: product.sub_category.title,
                     item_brand: product.brand.name,
                     price: product.price,
                     quantity: 1,
                   },
                 ],
               });
            }}
            className="rounded-none hover:bg-slate-400"
            variant="ghost"
          >
            <PlusIcon className="w-8 h-8" />
          </Button>
        </div>
        <Button onClick={() => dispatch(openCart())} className="rounded-none  bg-brand hover:bg-brand_light text-white text-md lg:text-lg uppercase ">
          View Cart
        </Button>
      </div>
    </div>
  );
};
export default CartButton;
