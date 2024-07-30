import { Separator } from "@/components/ui/separator";
import { Database } from "@/schema";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import CreateSubCategoryDialog from "./CreateSubCategoryDialog";

export const dynamic = "force-dynamic";

const page = async () => {

    const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const categoriesData = supabase.from("categories").select("*");

   const sub_categoriesData = supabase
     .from("sub_categories")
     .select("*, category(*)");

     const [
       { data: sub_categories, error: sub_categoriesError },
       { data: categories, error: categoriesError },
     ] = await Promise.all([sub_categoriesData, categoriesData]);



  return (
    <section className="w-full">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-3xl font-bold">Sub Categories</h1>
        <CreateSubCategoryDialog categories={categories!} />
      </div>
      <Separator className="my-2" />
      {sub_categoriesError || sub_categories?.length === 0 ? (
        <h2 className="text-2xl font-bold uppercase">No Brands were found</h2>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sub_categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.title}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/categories/${category.category.slug!}`}
                  >
                    <Button type="button" variant="link">
                      {category.category.title!}
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/sub-categories/${category.slug}`}>
                    <Button type="button" variant="link">
                      <Link2 />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
};
export default page;
