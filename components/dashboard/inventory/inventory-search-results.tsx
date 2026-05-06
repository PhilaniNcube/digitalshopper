import { searchInventoryProducts } from "@/dal/queries/inventory";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type InventorySearchResultsProps = {
	q: string;
};

export async function InventorySearchResults({ q }: InventorySearchResultsProps) {
	if (!q) return null;

	const items = await searchInventoryProducts(q);

	return (
		<Card className="bg-surface-low ring-white/6 border-primary-strong/20">
			<CardHeader>
				<CardTitle className="text-white text-lg">
					Search Results: "{q}"
				</CardTitle>
			</CardHeader>
			<CardContent>
				{items.length === 0 ? (
					<p className="py-8 text-center text-sm text-white/60">
						No products found matching your search.
					</p>
				) : (
					<div className="overflow-x-auto">
						<Table className="text-slate-100">
							<TableHeader>
								<TableRow>
									<TableHead className="text-slate-100">Product</TableHead>
									<TableHead className="text-slate-100">SKU</TableHead>
									<TableHead className="text-right text-slate-100">Total</TableHead>
									<TableHead className="text-right text-slate-100">CPT</TableHead>
									<TableHead className="text-right text-slate-100">JHB</TableHead>
									<TableHead className="text-right text-slate-100">DBN</TableHead>
									<TableHead className="text-slate-100">Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.id}>
										<TableCell className="max-w-[24ch] truncate font-medium">
											{item.title}
										</TableCell>
										<TableCell className="font-mono text-xs">
											{item.supplierSku}
										</TableCell>
										<TableCell className="text-right font-semibold">
											{item.totalStock}
										</TableCell>
										<TableCell className="text-right">{item.cpt}</TableCell>
										<TableCell className="text-right">{item.jhb}</TableCell>
										<TableCell className="text-right">{item.dbn}</TableCell>
										<TableCell>
											<Badge variant={item.inStock ? "default" : "outline"}>
												{item.inStock ? "In Stock" : "Out"}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
