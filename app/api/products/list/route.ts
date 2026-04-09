import { fetchProducts } from "@/dal/queries/products";
import {type NextRequest} from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20", 10);
    const category = searchParams.get("category") ?? undefined;
    const brand = searchParams.get("brand") ?? undefined;


    // TODO: Implement pagination and filtering by category, brand, etc.

    const products = await fetchProducts({
        page,
        pageSize,    
    })

    return new Response(JSON.stringify(products));

}