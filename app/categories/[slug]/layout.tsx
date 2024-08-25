import CategoryHeader from "@/components/CategoriesPage/CategoryHeader";
import type { ReactNode } from "react";
import Filter from "./Filter";
import {
	fetchCategoryBySlug,
	fetchFrameStyles,
	fetchSubCategoriesByCategorySlug,
} from "@/utils/fetchers/categories";

const layout = async ({
	children,
	params: { slug },
}: {
	children: ReactNode;
	params: { slug: string };
}) => {
	const frameSylesData = fetchFrameStyles();
	const categoryData = fetchCategoryBySlug(slug);
	const subCategoriesData = fetchSubCategoriesByCategorySlug(slug);

	const [frame_styles, category, sub_categories] = await Promise.all([
		frameSylesData,
		categoryData,
		subCategoriesData,
	]);

	return (
		<main>
			{category ? (
				<CategoryHeader title={category.title} />
			) : (
				<CategoryHeader title="Category" />
			)}
			<div className="container flex py-10">
				{category ? (
					<Filter
						filter_title={category.title}
						sub_categories={sub_categories}
						slug={slug}
						frame_styles={frame_styles}
					/>
				) : null}

				{children}
			</div>
		</main>
	);
};
export default layout;
