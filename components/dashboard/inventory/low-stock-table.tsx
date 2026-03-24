import { getLowStockProducts } from "@/dal/queries/inventory";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export async function LowStockTable() {
	const items = await getLowStockProducts();

	return (
		<Card className="bg-surface-low ring-white/6">
			<CardHeader className="gap-3">
				<div className="space-y-1">
					<p className="text-[10px] uppercase tracking-[0.24em] text-white">
						Inventory
					</p>
					<CardTitle className="text-white">
						Low &amp; Out-of-Stock Products
					</CardTitle>
				</div>
				<CardDescription>
					Products with 5 or fewer total units. Showing up to 50 items sorted by
					lowest stock first.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{items.length === 0 ? (
					<p className="py-8 text-center text-sm text-white/60">
						All products are well stocked.
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
									<TableHead className="text-slate-100">Next Shipment</TableHead>
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
												{item.inStock ? "Low" : "Out"}
											</Badge>
										</TableCell>
										<TableCell className="text-sm text-white/70">
											{item.nextShipmentEta ?? "—"}
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

export function LowStockTableSkeleton() {
	return (
		<Card className="bg-surface-low ring-white/6">
			<CardHeader className="gap-3">
				<div className="space-y-2">
					<Skeleton className="h-3 w-20 rounded-none" />
					<Skeleton className="h-5 w-56 rounded-none" />
				</div>
				<Skeleton className="h-4 w-80 rounded-none" />
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					<div className="flex gap-4">
						{Array.from({ length: 8 }, (_, i) => (
							<Skeleton key={i} className="h-4 w-20 rounded-none" />
						))}
					</div>
					{Array.from({ length: 5 }, (_, i) => (
						<div key={i} className="flex gap-4">
							{Array.from({ length: 8 }, (_, j) => (
								<Skeleton key={j} className="h-5 w-20 rounded-none" />
							))}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
