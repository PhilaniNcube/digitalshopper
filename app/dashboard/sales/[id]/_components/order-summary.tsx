/**
 * v0 by Vercel.
 * @see https://v0.dev/t/QMRgpTheVrf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Database } from "@/schema";

export default function Component({order}:{order:Database['public']['Tables']['orders']['Row']}) {
	return (
		<div className="grid gap-8">
			<div className="grid grid-cols-1 gap-8 px-4 sm:px-6 md:px-8 lg:grid-cols-5 lg:gap-12">
				<div className="lg:col-span-3">
					<Card>
						<CardHeader>
							<CardTitle>Order Items</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="grid gap-4">
								{order.order_items.map((item) => (
									<li key={item.product.id} className="flex items-center gap-4">
										<img
											src={item.product.images[0]}
											alt="Product"
											width={64}
											height={64}
											className="object-cover rounded-md aspect-square"
										/>
										<div className="grid">
											<h3 className="font-semibold">{item.product.title}</h3>
											<div className="flex items-center gap-2">
												<span>Quantity: {item.quantity}</span>
												<span>{item.product.price}</span>
											</div>
										</div>
									</li>
								))}
							</ul>
              <div>
                <p>{order.first_name}, {order.last_name}</p>
                <p>Address: {order.address}, {order.city}</p>
                <p>Phone: {order.phone}</p>
                <p>Email: {order.email}</p>
              </div>
						</CardContent>
					</Card>
				</div>
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Order Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="grid gap-2">
								<li className="flex items-center justify-between">
									<span>Subtotal</span>
									<span>{order.subtotal}</span>
								</li>
								<li className="flex items-center justify-between">
									<span>Shipping</span>
									<span>{order.shipping}</span>
								</li>

								<Separator className="my-2" />
								<li className="flex items-center justify-between font-semibold">
									<span>Total</span>
									<span>{order.total_amount}</span>
								</li>
							</ul>
						</CardContent>
						<CardFooter>
							<Button className="w-full">Complete Order</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
}



