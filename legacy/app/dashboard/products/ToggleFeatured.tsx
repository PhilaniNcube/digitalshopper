"use client"

import { toggleFeaturedAction } from "@/actions/products";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ToggleFeatured = ({id, featured}:{id:string, featured:boolean}) => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const handleToggle = async () => {
        setIsPending(true);
        try {
            await toggleFeaturedAction(id, featured);
            toast({
                title: "Product updated",
                description: `Product is now ${!featured ? 'featured' : 'unfeatured'}.`
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive"
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Switch 
            name="featured" 
            id="featured" 
            onClick={handleToggle} 
            checked={featured}
            disabled={isPending}
        />
    );
};

export default ToggleFeatured;
