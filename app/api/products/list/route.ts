import { fetchCatalogProducts, fetchProductsByIds } from "@/dal/queries/products";
import { type NextRequest } from "next/server";

const SORTS = ["featured", "price-asc", "price-desc"] as const;
const STOCKS = ["all", "in-stock"] as const;

type ProductSort = (typeof SORTS)[number];
type ProductStock = (typeof STOCKS)[number];

function parseSort(value: string | null): ProductSort {
	return SORTS.includes(value as ProductSort) ? (value as ProductSort) : "featured";
}

function parseStock(value: string | null): ProductStock {
	return STOCKS.includes(value as ProductStock) ? (value as ProductStock) : "all";
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;

	const idsParam = searchParams.get("ids");
	if (idsParam) {
		const ids = idsParam.split(",").filter(Boolean);
		if (ids.length > 0) {
			const items = await fetchProductsByIds(ids);
			return Response.json({ items });
		}
	}

	const page = parseInt(searchParams.get("page") ?? "1", 10);
	const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
	const q = searchParams.get("q") ?? undefined;
	const category = searchParams.get("category") ?? undefined;
	const sort = parseSort(searchParams.get("sort"));
	const stock = parseStock(searchParams.get("stock"));

	const products = await fetchCatalogProducts({
		page,
		pageSize,
		q,
		category,
		sort,
		stock,
	});

	return Response.json(products);
}
