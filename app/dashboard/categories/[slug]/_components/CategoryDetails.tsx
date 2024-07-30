"use client"

import { Database } from "@/schema";
import { ChangeEvent, FormEvent, useState } from "react";
import {useRouter} from "next/navigation"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "@/components/ui/use-toast";

type CategoryProps = {
  category: Database["public"]['Tables']['categories']['Row']
}

const CategoryDetails = ({ category }: CategoryProps) => {

  const router = useRouter()

  const [image, setImage] = useState(category.image_url)
  const [loading, setLoading] = useState(false);

      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const upload = async (data: ChangeEvent<HTMLInputElement>) => {
        data.preventDefault();
        setLoading(true);
        console.log(data.target.files);
        const files = data.target.files

        if(!files) {
          setLoading(false);
           throw new Error("No file was uploaded");
        }

        const file = files[0]

        // if (!file) {
        //   setLoading(false);
        //   throw new Error("No file was uploaded");

        // }

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
            variant: "destructive",
          });
        } else {
          setImage(`${base_url}${randomString}`);

          const { data:updatedCategory, error:categoryError } = await supabase
            .from("categories")
            .update({ image_url: `${base_url}${randomString}` })
            .eq("id", category.id).select('*').single();

            console.log(updatedCategory)

            if(categoryError) {
              console.error(categoryError.message)
              toast({
                title: "Error",
                description: categoryError.message,
                variant: "destructive",
              });
              setLoading(false);

            }

          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
          setLoading(false);

        }

        router.refresh()
      };

  return (
    <div className="container py-12">
      <h1 className="text-2xl">{category.title}</h1>
      <form  className="mt-5 space-y-6 max-w-[400px]">
        <div className="mt-5">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Current Image
          </Label>
          <img
            alt="Current Image"
            className="mt-1"
            height="270"
            src={image}
            style={{
              aspectRatio: "480/270",
              objectFit: "cover",
            }}
            width="480"
          />
        </div>
        <div>
          <Label
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor="image"
          >
            Image
          </Label>
          <Input className="mt-1 block " name="image" onChange={upload}  id="image" type="file" />
        </div>
        {/* <div className="flex justify-end space-x-4">
          <Button type="submit">Upload</Button>
        </div> */}
      </form>
    </div>
  );
};
export default CategoryDetails;
