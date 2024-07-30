"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDashed, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/schema";


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name of the brand must be at least 2 characters.",
  }),
});


const CreateBrandDialog = () => {

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });

  const [loading, setLoading] = useState(false);
  const [open,setOpen] = useState(false);

  const router = useRouter();

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );


  const submit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const slug = slugify(data.name, {
      lower: true,
      replacement: "-",
      remove: /[*+~.()'"!:@]°/g,
    });
    const { error } = await supabase.from("brands").insert({ name: data.name, slug });
    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
      })
    } else {
      toast({
        title: "Success",
        description: "Brand created successfully",
        action: <ToastAction onClick={() => setOpen(false)} altText="Close">Close</ToastAction>
      })
      router.refresh();
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusIcon /> Create New Brand
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Brand</DialogTitle>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name Of Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full mt-4 text-black rounded-none bg-brand hover:bg-brand_light hover:text-black"
                >
                  {loading ? (
                    <CircleDashed className="animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateBrandDialog;
