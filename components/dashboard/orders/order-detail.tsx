import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/dal/queries/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const statusVariant: Record<
	string,
	"default" | "secondary" | "destructive" | "outline"
> = {
	paid: "default",
	pending: "outline",
	failed: "destructive",
	cancelled: "secondary",
};

type OrderDetailProps = {
	params: Promise<{ orderId: string }>;
};

export default async function OrderDetail({ params }: OrderDetailProps) {
	const { orderId } = await params;
	const order = await getOrderById(orderId);

	if (!order) {
		notFound();
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-100">
						Order Details
					</h1>
					<p className="text-sm text-slate-400 font-mono mt-1">{order.id}</p>
				</div>
				<div className="flex items-center gap-3">
					<Badge
						variant={statusVariant[order.status] ?? "secondary"}
						className="capitalize text-sm px-3 py-1"
					>
						{order.status}
					</Badge>
					<Button asChild variant="outline" size="sm">
						<Link href="/dashboard/orders">← Back to orders</Link>
					</Button>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Customer Information */}
				<Card className="bg-slate-800 border-slate-700">
					<CardHeader>
						<CardTitle className="text-slate-100 text-base">
							Customer
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-slate-300">
						<p className="font-medium text-slate-100">
							{order.firstName} {order.lastName}
						</p>
						<p>{order.email}</p>
						<p>{order.phone}</p>
						{order.userId && (
							<p className="text-xs text-slate-500 font-mono">
								User ID: {order.userId}
							</p>
						)}
					</CardContent>
				</Card>

				{/* Shipping Address */}
				<Card className="bg-slate-800 border-slate-700">
					<CardHeader>
						<CardTitle className="text-slate-100 text-base">
							Shipping Address
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-1 text-sm text-slate-300">
						<p>{order.addressLine1}</p>
						{order.addressLine2 && <p>{order.addressLine2}</p>}
						<p>
							{order.city}, {order.province} {order.postalCode}
						</p>
					</CardContent>
				</Card>

				{/* Payment Information */}
				<Card className="bg-slate-800 border-slate-700">
					<CardHeader>
						<CardTitle className="text-slate-100 text-base">
							Payment
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-slate-300">
						<div className="flex justify-between">
							<span>Status</span>
							<Badge
								variant={statusVariant[order.status] ?? "secondary"}
								className="capitalize"
							>
								{order.status}
							</Badge>
						</div>
						{order.payfastPaymentId && (
							<div className="flex justify-between">
								<span>Payfast ID</span>
								<span className="font-mono text-xs text-slate-400">
									{order.payfastPaymentId}
								</span>
							</div>
						)}
						{order.paidAt && (
							<div className="flex justify-between">
								<span>Paid at</span>
								<span>
									{new Date(order.paidAt).toLocaleString("en-ZA")}
								</span>
							</div>
						)}
						<div className="flex justify-between">
							<span>Placed on</span>
							<span>
								{new Date(order.createdAt).toLocaleString("en-ZA")}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Order Summary */}
				<Card className="bg-slate-800 border-slate-700">
					<CardHeader>
						<CardTitle className="text-slate-100 text-base">
							Order Summary
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2 text-sm text-slate-300">
						<div className="flex justify-between">
							<span>Subtotal</span>
							<span>{formatCurrency(order.subtotal)}</span>
						</div>
						<div className="flex justify-between">
							<span>Shipping</span>
							<span>{formatCurrency(order.shipping)}</span>
						</div>
						<Separator className="bg-slate-600" />
						<div className="flex justify-between font-semibold text-slate-100">
							<span>Total</span>
							<span>{formatCurrency(order.total)}</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Order Items */}
			<Card className="bg-slate-800 border-slate-700">
				<CardHeader>
					<CardTitle className="text-slate-100 text-base">
						Items ({order.items.length})
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<Table>
						<TableHeader>
							<TableRow className="border-slate-700 hover:bg-slate-700/50">
								<TableHead className="text-slate-300 pl-6">Product</TableHead>
								<TableHead className="text-slate-300 text-right">
									Unit Price
								</TableHead>
								<TableHead className="text-slate-300 text-right">
									Qty
								</TableHead>
								<TableHead className="text-slate-300 text-right pr-6">
									Line Total
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{order.items.map((item) => (
								<TableRow
									key={item.id}
									className="border-slate-700 hover:bg-slate-700/50"
								>
									<TableCell className="pl-6">
										<div className="flex items-center gap-3">
											{item.image && (
												<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-600 bg-slate-700">
													<Image
														src={item.image}
														alt={item.title}
														fill
														className="object-contain"
														sizes="48px"
													/>
												</div>
											)}
											<span className="text-sm text-slate-100 line-clamp-2">
												{item.title}
											</span>
										</div>
									</TableCell>
									<TableCell className="text-right text-slate-300 text-sm">
										{formatCurrency(item.price)}
									</TableCell>
									<TableCell className="text-right text-slate-300 text-sm">
										{item.quantity}
									</TableCell>
									<TableCell className="text-right text-slate-100 font-medium text-sm pr-6">
										{formatCurrency(item.price * item.quantity)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
