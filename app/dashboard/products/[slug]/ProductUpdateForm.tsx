"use client";
import { Database } from "@/schema";
import { createBrowserClient } from '@supabase/ssr'
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { CircleDashed, PlusIcon, TrashIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import slugify from "slugify";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Product title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Product description must be at least 10 characters.",
  }),
  price: z.number({
    coerce: true,
  }),
  category: z.string(),
  sub_category: z.string(),
  brand: z.string(),
  attributes: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ),
  has_variants: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        variant_name: z.string(),
        variant_value: z.string(),
      })
    )
    .optional(),
  frame_style: z.string().optional(),
  gender: z.string().optional(),
});


const tagsSchema = z.object({
  tags: z.array(z.string()).refine((value) => value.some((tag) => tag), {
    message: "You must select at least one tag",
  }),
});

type ProductFormPropTypes = {
  product: Database["public"]["Tables"]["products"]["Row"];
  colours: Database["public"]["Tables"]["colour"]["Row"][];
  sizes: Database["public"]["Tables"]["size"]["Row"][];
  brands: Database["public"]["Tables"]["brands"]["Row"][];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  sub_categories: Database["public"]["Tables"]["sub_categories"]["Row"][];
  frame_styles: Database["public"]["Tables"]["frame_styles"]["Row"][];
};

const CreateProductForm = ({
  product,
  colours,
  brands,
  categories,
  sub_categories,
  sizes,
  frame_styles,
}: ProductFormPropTypes) => {
  const router = useRouter();

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<string[]>(product.images!);





  //create a function to delete an image from the images array
  const deleteImage = async (image: string) => {
    const newImages = images.filter((img) => img !== image);
    setImages(newImages);

    const { data, error } = await supabase
      .from("products")
      .update({ images: newImages })
      .eq("id", product.id)
      .select("*")
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Image was deleted successfully",
      });
    }

    console.log({ data, error });
  };

  const [frame_style, setFrameStyle] = useState<string | null>(null);

  const upload = async (data: FormEvent<HTMLFormElement>) => {
    data.preventDefault();
    setLoading(true);
    const file: File | null = data.currentTarget.file
      .files[0] as unknown as File;

    if (!file) {
      throw new Error("No file was uploaded");
    }

    const randomString = Math.random().toString(36).substring(2, 15);

    const fileName = file.name + randomString;



    const { data: fileData, error } = await supabase.storage
      .from("products")
      .upload(randomString, file);

    const base_url =
      "https://wrdsrupthgeuaredfstv.supabase.co/storage/v1/object/public/products/";

    if (error) {
      setLoading(false);
      throw new Error(error.message);
    } else {
      console.log(fileData);
      setImages((images) => [...images, `${base_url}${randomString}`]);
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price,
      brand: product.brand.id,
      category: product.category.id,
      sub_category: product.sub_category.id,
      attributes: product.attributes || [],
      has_variants: product.has_variants,
      variants: product.variants || [],
      frame_style: product.frame_style || undefined,
    },
  });

  const category = form.watch("category");
  const hasVariants = form.watch("has_variants");
  const variations = form.watch("variants");

  const sub_categories_filtered = sub_categories.filter(
    (sub_category) => sub_category.category.id === category
  );

  const { fields, append, prepend, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const {
    fields: variantFields,
    append: appendVariantField,
    remove: removeVariantField,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log({ data });

    setLoading(true);

    const {
      title,
      description,
      price,
      brand,
      category,
      sub_category,
      attributes,
      has_variants,
      variants,
      gender,
    } = data;

    console.log({ variations });

    const slug = slugify(title, {
      lower: true,
      trim: true,
      strict: true,
      remove: /[*°+~.()/\/'"!:@]/g,
    });

    const { data: productUpdate, error } = await supabase
      .from("products")
      .update({
        title,
        slug,
        description,
        price,
        brand,
        category,
        sub_category,
        attributes:
          attributes === null ||
          attributes === undefined ||
          attributes?.length === 0
            ? null
            : attributes,
        variants:
          hasVariants === false || variants === null || variants === undefined
            ? null
            : variants,
        has_variants,
        images,
        frame_style: frame_style || null,
        gender: gender === null || gender === undefined ? null : gender,
      })
      .eq("id", product.id)
      .select("*");

    if (error) {
      toast({
        title: "error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Success",
        description: "Product was updated successfully",
      });
      setLoading(false);
      router.back();
    }
  }

  return (
    <div className="flex w-full h-full gap-4 mt-2">
      <div className="flex-1 w-full h-full px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full h-full "
          >
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4">
              <div>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-6 mt-4">
              <div className="w-full">
                <FormField
                  defaultValue={product.brand.id}
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {brands.map((brand, index) => (
                              <SelectItem value={brand.id} key={index}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <ScrollArea className="h-[300px]">
                            {categories.map((category, index) => (
                              <SelectItem value={category.id} key={index}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full ">
                <FormField
                  control={form.control}
                  name="sub_category"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Sub Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {sub_categories_filtered.map((category) => (
                            <FormItem
                              key={category.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={category.id} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {category.title}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* optionally render the frame_styles form field if the category selected is eyewear */}
            {category === "41e92af3-10d1-4ae4-9214-9ba17acab833" && (
              <div className="px-2 py-3 mt-6 bg-white">
                <h3 className="py-3 text-lg">
                  Frame Styles <small className="text-sm">(optional)</small>
                </h3>
                <div className="grid w-full grid-cols-3 gap-5 mb-3">
                  {frame_styles.map((style) => (
                    <div key={style.id} className="flex gap-x-2">
                      <Checkbox
                        checked={style.slug === frame_style}
                        onCheckedChange={() => setFrameStyle(style.slug)}
                      />
                      <Label>{style.title}</Label>
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xl font-semibold">
                        Gender
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="men" />
                            </FormControl>
                            <FormLabel className="font-normal">Men</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="women" />
                            </FormControl>
                            <FormLabel className="font-normal">Women</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="unisex" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Unisex
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="mt-4">
              <FormField
                control={form.control}
                name="has_variants"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Does this product have variants? e.g condition, weights,
                        shoe sizes etc
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {hasVariants && (
              <div className="mt-5">
                <Button
                  type="button"
                  className="rounded-none"
                  onClick={() =>
                    appendVariantField({
                      variant_name: "colour",
                      variant_value: "black",
                    })
                  }
                >
                  <PlusIcon /> Add Variants
                </Button>
                {variantFields.map((field, index) => (
                  <div className="flex items-end mt-3 gap-x-3">
                    <div className="flex flex-col space-y-2">
                      <Label>Variant Name</Label>
                      <Input
                        key={field.id}
                        {...form.register(`variants.${index}.variant_name`)}
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label>Variant Value</Label>
                      <Input
                        key={field.id}
                        {...form.register(`variants.${index}.variant_value`)}
                      />
                    </div>
                    <div className="flex items-end ">
                      <Button
                        variant="destructive"
                        className="rounded-none "
                        onClick={() => removeVariantField(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5">
              <Button
                type="button"
                className="rounded-none"
                onClick={() => append({ key: "", value: "" })}
              >
                <PlusIcon /> Add Attributes
              </Button>
              {fields.map((field, index) => (
                <div className="grid grid-cols-5 mt-3 gap-x-3">
                  <div className="flex flex-col col-span-2 space-y-2">
                    <Label>Atrribute Name</Label>
                    <Input
                      key={field.id}
                      {...form.register(`attributes.${index}.key`)}
                    />
                  </div>
                  <div className="flex flex-col col-span-2 space-y-2">
                    <Label>Atribute Value</Label>
                    <Input
                      key={field.id}
                      {...form.register(`attributes.${index}.value`)}
                    />
                  </div>
                  <div className="flex items-end col-span-1 ">
                    <Button
                      variant="destructive"
                      className="w-full rounded-none"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              disabled={loading || images?.length === 0}
              type="submit"
              className="disabled:opacity-60 rounded-none w-[300px] mt-6"
            >
              {loading && <CircleDashed className="animate-spin" />} Submit
            </Button>
          </form>
        </Form>
      </div>
      <aside className="rounded w-[350px] border bg-white h-full mt-5">
        <form onSubmit={upload} className="px-3 py-4">
          <h2 className="text-2xl font-bold">Product Images</h2>
          <Separator className="my-2" />
          <div className="flex flex-col space-y-2">
            <Input type="file" name="file" id="file" />
            <Button
              disabled={loading}
              type="submit"
              className="rounded-none disabled:opacity-60"
            >
              {" "}
              {loading && <CircleDashed className="animate-spin" />} Upload
            </Button>
          </div>
        </form>
        <div className="grid w-full grid-cols-2 gap-3 p-3">
          {images.map((image, index) => (
            <div key={index} className="relative isolate">
              <AlertDialog>
                <AlertDialogTrigger asChild className="absolute top-0 right-0">
                  <Button type="button" className="text-white bg-red-600">
                    <TrashIcon size={10} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the image from this product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteImage(image)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Image
                src={image}
                className="object-cover w-full aspect-square"
                width={500}
                height={500}
                alt="Product Image"
              />
            </div>
          ))}
        </div>
        {/* <Separator className="my-2" /> */}
        {/* <div className="w-full px-3">
          <h2 className="text-2xl font-bold">Product Tags</h2>
          <ScrollArea className="w-full h-[30vh]">
            <form className="w-full"></form>
          </ScrollArea>
        </div> */}
      </aside>
    </div>
  );
};
export default CreateProductForm;