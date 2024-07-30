"use client"

import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Database } from "@/schema";
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from "next/navigation";

const ToggleFeatured = ({id, featured}:{id:string, featured:boolean}) => {

    const router = useRouter()

      const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

    const toggleFeatured = async () => {
       const { data: product, error } = await supabase
         .from("products")
         .update({ featured: !featured })
         .eq("id", id)
         .single();
       if (error) {
         throw new Error(error.message);
       }
        toast({
          title: "Updated"
        })
        router.refresh()

    }

  return <Switch name="featured" id="featured" onClick={toggleFeatured} checked={featured} />;
};
export default ToggleFeatured;
