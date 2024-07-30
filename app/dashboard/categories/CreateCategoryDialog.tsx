"use client";

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


import { ChangeEventHandler, FormEvent, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDashed, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Database } from "@/schema";
import { createBrowserClient } from "@supabase/ssr";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title of the category must be at least 2 characters.",
  }),
});

const CreateBrandDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [image, setImage] = useState('');

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );


  const upload = async (data: FormEvent<HTMLFormElement>) => {
    data.preventDefault();
    setLoading(true);
    const file: File | null = data.currentTarget.file
      .files[0] as unknown as File;

    if (!file) {
      setLoading(false);
      throw new Error("No file was uploaded");
    }

    const fileName = file.name;
    const randomString = Math.random().toString(36).substring(2, 15);

    const { data: fileData, error } = await supabase.storage
      .from("categories")
      .upload(randomString, file);

    const base_url =
      "https://wrdsrupthgeuaredfstv.supabase.co/storage/v1/object/public/categories/";

    if (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.message,
        variant:"destructive"
      })
    } else {

      setImage(`${base_url}${randomString}`);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      setLoading(false);
    }

    setLoading(false);
  };

  const router = useRouter();



  const submit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);

    // regex for replacing & with and


    const slug = slugify(data.title, {
      lower: true,
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
    });
    const { error } = await supabase
      .from("categories")
      .insert({ title: data.title, slug, image_url: image });
    if (error) {
      console.error(error.message);
      toast({
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Category created successfully",
        action: (
          <ToastAction onClick={() => setOpen(false)} altText="Close">
            Close
          </ToastAction>
        ),
      });
      router.refresh();
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <PlusIcon /> Create New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <div className="grid gap-4 py-4">
            <form onSubmit={upload} className="flex items-end gap-3 mt-4">
              <div className="flex flex-col space-y-3">
                <Label>Upload Image</Label>
                <Input type="file" name="file" id="file" />
              </div>
              <Button type="submit">Upload</Button>
            </form>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name Of Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Category" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button

                  type="submit"
                  className="w-full mt-4 text-black rounded-none bg-brand hover:bg-brand_light hover:text-black"
                >
                  {loading ? (
                    <CircleDashed className="animate-spin " />
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
