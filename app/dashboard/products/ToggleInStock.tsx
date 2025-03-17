"use client";

import { toggleInStockAction } from "@/actions/products";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";


const ToggleInStock = ({
  id,
  instock,
}: {
  id: string;
  instock: boolean;
}) => {

  const clientAction = async () => {
    await toggleInStockAction(id, instock);

  };

  const [state, formAction, isPending] = useActionState(clientAction, null);

  return (
    <Switch
      name="instock"
      id="instock"
      onClick={() => {
        startTransition(() => {
          formAction();
          toast({
            title: "Product updated",
            description: `Product is now ${!instock ? "in stock" : "out of stock"
              }.`,
          });
        });
      }}
      checked={instock}
      disabled={isPending}
    />
  );
};

export default ToggleInStock;
