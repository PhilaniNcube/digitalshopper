
import { Database } from "@/schema";
import { cookies } from "next/headers";

import CreateBrandDialog from "./CreateBrandDialog";
import { Separator } from "@/components/ui/separator";

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
import { createServerClient } from "@supabase/ssr";


const page = async () => {

     const cookieStore = cookies();

     const supabase = createServerClient<Database>(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return cookieStore.get(name)?.value;
           },
         },
       }
     );

   const { data: brands, error } = await supabase.from("brands").select();



  return (
    <section className="w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold">Brands</h1>
          <CreateBrandDialog />
      </div>
      <Separator className="my-2" />
      {error || brands.length === 0 ? (<h2 className="text-2xl font-bold uppercase">No Brands were found</h2>) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>slug</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.slug}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/brands/${brand.slug}`} >
                   <Button type="button" variant="link">
                    <Link2 />
                   </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button type="button">Actions</Button>
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
