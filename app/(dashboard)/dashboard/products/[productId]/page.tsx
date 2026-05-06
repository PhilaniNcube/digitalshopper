import { Suspense } from "react";
import ProductDetail from "@/components/dashboard/products/product-detail";
import { ProductDetailSkeleton } from "@/components/dashboard/products/product-detail-skeleton";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ productId: string }>
}) {
    return (
        <div className=" py-8">
            <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductDetail paramsPromise={params} />
            </Suspense>
        </div>
    );
}