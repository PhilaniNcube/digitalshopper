import { Separator } from "@/components/ui/separator";
import type { Database } from "@/schema";
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
import { createClient } from "@/utils/supabase/server";
import { fetchSubCategories } from "@/utils/fetchers/categories";

interface Category {
	id: string;
	title: string;
	slug: string;
	category: {
		slug: string;
		title: string;
	};
}

export const dynamic = "force-dynamic";

const page = async () => {

  const supabase = await createClient()

  const categoriesData = supabase.from("categories").select("*");

   const sub_categoriesData = fetchSubCategories();

     const [sub_categories, { data: categories, error: categoriesError }] =
						await Promise.all([sub_categoriesData, categoriesData]);



  return (
			<section className="w-full">
				<div className="flex items-center justify-between w-full">
					<h1 className="text-3xl font-bold">Sub Categories</h1>
					{categories && <CreateSubCategoryDialog categories={categories} />}
				</div>
				<Separator className="my-2" />
				{sub_categories?.length === 0 ? (
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
										{category.categories && (
											<Link
											href={`/dashboard/categories/${category.categories.slug}`}
											>
												<Button type="button" variant="link">
													{category.categories.title}
												</Button>
											</Link>
										)}
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
