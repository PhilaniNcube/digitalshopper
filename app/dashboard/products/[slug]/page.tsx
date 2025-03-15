import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductUpdateForm from "./ProductUpdateForm";

import { createClient } from "@/utils/supabase/server";

const page = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;

    const {
        slug
    } = params;

    const supabase = await createClient();

    const productData = supabase
		.from("products")
		.select("*, category(*), brand(*), sub_category(*), frame_style(*)")
		.eq("slug", slug)
		.single();
    const categoriesData = supabase
		.from("categories")
		.select("*")
		.order("title", { ascending: true });
    const brandsData = supabase
		.from("brands")
		.select("*")
		.order("name", { ascending: true });
    const sub_categoriesData = supabase
		.from("sub_categories")
		.select("*, category(*)")
		.order("title", { ascending: true });
    const frameStylesData = supabase
		.from("frame_styles")
		.select("*")
		.order("title", { ascending: true });
    const coloursData = supabase.from("colour").select("*");
    const sizeData = supabase.from("size").select("*");

    const [
		{ data: product, error: productError },
		{ data: categories, error: categoriesError },
		{ data: brands, error: brandsError },
		{ data: sub_categories, error: sub_categoriesError },
		{ data: colours, error: coloursError },
		{ data: sizes, error: sizesError },
		{ data: frame_styles, error: frameStylesError },
	] = await Promise.all([
		productData,
		categoriesData,
		brandsData,
		sub_categoriesData,
		coloursData,
		sizeData,
		frameStylesData,
	]);

    return (
		<div className="w-full">
			<div className="flex items-end justify-between w-full">
				<h1 className="text-3xl font-bold">Products</h1>
				<Link href="/dashboard/products">
					<Button type="button">
						<ArrowLeft />
						<span className="ml-2">Back</span>
					</Button>
				</Link>
			</div>
			<Separator className="my-4" />
			{!product ||
			!colours ||
			!sizes ||
			!categories ||
			!sub_categories ||
			!brands ||
			!frame_styles ? null : (
				<ProductUpdateForm
          //@ts-ignore
					product={product}
					colours={colours}
					sizes={sizes}
					categories={categories}
					sub_categories={sub_categories}
					brands={brands}
					frame_styles={frame_styles}
				/>
			)}
		</div>
	);
};
export default page;
