import { fetchProductById } from "@/dal/queries/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Package, Tag, Layers, Barcode, Calendar } from "lucide-react";

interface Props {
    paramsPromise: Promise<{ productId: string }>
}

export default async function ProductDetail({ paramsPromise }: Props) {
    const { productId } = await paramsPromise;
    const product = await fetchProductById(productId);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6 text-white max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <Badge variant={product.inStock ? "default" : "destructive"}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <Badge variant={product.active ? "outline" : "secondary"} className="text-white border-slate-700">
                            {product.active ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-surface-elevated border-surface-elevated text-white shadow-none">
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-400">Supplier SKU</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Barcode className="w-4 h-4 text-slate-400" />
                                        {product.supplierSku}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-400">Brand</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-slate-400" />
                                        {product.brand?.name ?? "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-400">Category</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-slate-400" />
                                        {product.category?.name ?? "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-400">Price</p>
                                    <p className="font-medium text-lg text-primary-strong">
                                        {formatCurrency(product.price)}
                                    </p>
                                </div>
                            </div>

                            {product.shortDescription && (
                                <>
                                    <Separator className="bg-slate-700" />
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">Summary</h3>
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {product.shortDescription}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-surface-elevated border-surface-elevated text-white shadow-none">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div 
                                className="prose prose-invert max-w-none text-sm text-slate-300 prose-p:leading-relaxed prose-a:text-primary-strong"
                                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {product.featuredImage && (
                        <Card className="bg-surface-elevated border-surface-elevated text-white overflow-hidden shadow-none">
                            <div className="relative aspect-square w-full bg-white">
                                <Image
                                    src={product.featuredImage}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-4"
                                />
                            </div>
                        </Card>
                    )}

                    <Card className="bg-surface-elevated border-surface-elevated text-white shadow-none">
                        <CardHeader>
                            <CardTitle>Inventory</CardTitle>
                            <CardDescription className="text-slate-400">Stock availability across warehouses.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between font-medium">
                                <span className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-slate-400" />
                                    Total Stock
                                </span>
                                <span>{product.totalStock}</span>
                            </div>
                            {product.inventory.length > 0 && (
                                <>
                                    <Separator className="bg-slate-700" />
                                    <div className="space-y-3">
                                        {product.inventory.map(inv => (
                                            <div key={inv.id} className="flex justify-between items-center text-sm">
                                                <span className="text-slate-300">Warehouse {inv.warehouseCode}</span>
                                                <Badge variant="outline" className="text-white border-slate-700">
                                                    {inv.quantity} units
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            {product.nextShipmentEta && (
                                <>
                                    <Separator className="bg-slate-700" />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            Next Shipment
                                        </span>
                                        <span>{product.nextShipmentEta}</span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}