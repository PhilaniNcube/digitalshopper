"use client"

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatter from "@/lib/currency";
import type { Database } from "@/schema";
import { ChevronLeft, ChevronRight, Link2Icon, TrashIcon } from "lucide-react";
import Link from "next/link";
import ToggleFeatured from "./ToggleFeatured";
import ToggleInStock from "./ToggleInStock";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  category: Database["public"]["Tables"]["categories"]["Row"];
  brand: Database["public"]["Tables"]["brands"]["Row"];
  sub_category: Database["public"]["Tables"]["sub_categories"]["Row"];
};

type ProductsTableProps = {
  products: Product[]
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: string | string[];
  search: string | string[];
};

const ProductsTable = ({
  products,
  hasPrevPage,
  hasNextPage,
  page,
  search
}: ProductsTableProps) => {

  const router = useRouter()


const supabase = createClient()

  const deleteProduct = async (id: string) => {

    const {  error } = await supabase.from("products").delete().match({ id });

    if (error) {
      console.log(error);
      toast({
							title: "Error",
							description: `Error deleting product ${error.message}`,
						});
    }

    toast({
      title: "Success",
      description: "Product deleted successfully",
    })

    router.refresh();

  }


  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>In Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>{formatter(product.price)}</TableCell>
              <TableCell>{product.brand.name}</TableCell>
              <TableCell>{product.category.title}</TableCell>
              <TableCell>
              {product.sub_category.title}
              </TableCell>
              <TableCell>
                <ToggleFeatured featured={product.featured || false} id={product.id} />
              </TableCell>
              <TableCell>
                <ToggleInStock instock={product.instock || false} id={product.id} />
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <Link href={`/dashboard/products/${product.slug}`}>
                  <Button variant="link" type="button">
                    <Link2Icon />
                  </Button>
                </Link>{" "}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="link" type="button">
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-transparent hover:bg-transparent" onClick={() => deleteProduct(product.id)} type="button">
                        <Button >
                          Delete
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center w-full mt-2 space-x-2">
        {hasPrevPage && (
          <Link
            href={{
              pathname: "/dashboard/products",
              query: {
                search: search,
                page: hasPrevPage ? Number(page) - 1 : Number(page),
              },
            }}
          >
            <Button
              // disabled={hasPrevPage}
              variant="outline"
              className="rounded-none"
            >
              {" "}
              <ChevronLeft /> Prev
            </Button>
          </Link>
        )}
        {hasNextPage && (
          <Link
            href={{
              pathname: "/dashboard/products",
              query: {
                search: search,
                page: hasNextPage ? Number(page) + 1 : Number(page),
              },
            }}
          >
            <Button
              // disabled={hasNextPage}
              variant="outline"
              className="rounded-none"
            >
              {" "}
              <ChevronRight /> Next
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
export default ProductsTable;
