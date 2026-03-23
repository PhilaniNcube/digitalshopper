"use client"

import { Button } from "@/components/ui/button";
import type { Database } from "@/schema";
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
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { productQty, totalCartItems, totalCartPrice } from "@/store/features/cartSlice";
import { increment, decrement, openCart } from "@/store/features/cartSlice";
import { sendGTMEvent } from "@next/third-parties/google";

type CartButtonProps = {
  product: Database["public"]["Tables"]["products"]["Row"];
}

const CartButton = ({product}:CartButtonProps) => {

  const [selectedVariant, setSelectedVariant] = useState("")

    const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.cartItems);

  const totalPrice = useAppSelector(totalCartPrice)

    const totalItems = useAppSelector(totalCartItems);





  const qty =
    cartItems.find(
      (item) =>
        item.product.product.id === product.id &&
        item.product.selectedVariant === selectedVariant
    )?.qty || 0;

       const trackRemoveFromCart = () => {
               sendGTMEvent({
																event: "remove_form_cart",
																value: product.price,
																items: [
																	{
																		item_id: product.id,
																		item_name: product.title,
																		quantity: qty - 1,
																		price: product.price,
																	},
																],
															});
   }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">

        {product.variants?.map((variant:{variant_name:string, variant_value:string}) => (
          <Button
            className={cn(
              selectedVariant === variant.variant_value &&
                "bg-white text-black",
              "border border-black hover:bg-white hover:text-black relative capitalize"
            )}
            type="button"
            key={variant.variant_name}
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

      <div className="flex mt-4 space-x-3">
        <div className="flex space-x-3 items-centre bg-slate-200">
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
          <div className="flex items-center px-4 text-xl font-semibold">
            {qty}
          </div>
          <Button
            onClick={() => {
              dispatch(increment({ product, selectedVariant }))
              sendGTMEvent({
                event: "add_to_cart",
                value: product.price,
                items: [
                  {
                    item_id: product.id,
                    item_name: product.title,
                    quantity: qty + 1,
                    price: product.price,
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
        <Button onClick={() => dispatch(openCart())} className="text-white uppercase rounded-none bg-brand hover:bg-brand_light text-md lg:text-lg ">
          View Cart
        </Button>
      </div>
    </div>
  );
};
export default CartButton;
