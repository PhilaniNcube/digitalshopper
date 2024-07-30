"use client";

import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/schema";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

const ToggleInStock = ({
  id,
  instock,
}: {
  id: string;
  instock: boolean;
}) => {
  const router = useRouter();

    const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const toggleInStock = async () => {
    const { data: product, error } = await supabase
      .from("products")
      .update({ featured: !instock })
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    toast({
      title: "Updated",
    });
    router.refresh();
  };

  return (
    <Switch
      name="featured"
      id="featured"
      onClick={toggleInStock}
      checked={instock}
    />
  );
};
export default ToggleInStock;
