import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductsCount } from "@/utils/fetchers/products";
import { BoxesIcon } from "lucide-react";

export default async function ProductsCard() {

    const count = await getProductsCount();



    return <Card
        className="cursor-pointer hover:shadow-md transition-shadow"

    >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <BoxesIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">+{count}</div>

        </CardContent>
    </Card>
}