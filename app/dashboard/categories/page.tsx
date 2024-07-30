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
import CreateCategoryDialog from "./CreateCategoryDialog";


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

  const categoriesData = supabase
    .from("categories")
    .select("*");

  const [{ data: categories, error: categoriesError }] =
    await Promise.all([categoriesData]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold">Categories</h1>
        <CreateCategoryDialog />
      </div>
      <Separator className="my-2" />
      {categoriesError || categories?.length === 0 ? (
        <h2 className="text-2xl font-bold uppercase">No Brands were found</h2>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>slug</TableHead>

              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.title}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/categories/${category.slug}`}>
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
