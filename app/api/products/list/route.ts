import { fetchCatalogProducts, fetchProductsByIds } from "@/dal/queries/products";
import { type NextRequest } from "next/server";

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

  const products = await fetchCatalogProducts({
    page,
    pageSize,
    q,
    category,
    sort: "featured",
  });

  return Response.json(products);
}
