"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	increment,
	decrement,
	deleteItem,
	isOpen,
	toggleCart,
	closeCart,
} from "@/store/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { totalCartItems, totalCartPrice } from "@/store/features/cartSlice";
import { MinusIcon, PlusIcon, ShoppingBag, Trash2Icon } from "lucide-react";
import Image from "next/image";
import formatter from "@/lib/currency";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendGTMEvent } from "@next/third-parties/google";

const CartSheet = () => {
	const router = useRouter();

	const dispatch = useAppDispatch();

	const open = useAppSelector(isOpen);

	const cartItems = useAppSelector((state) => state.cart.cartItems);

	// biome-ignore lint/complexity/noUselessTernary: <explanation>
	const emptyCart = cartItems.length === 0 ? true : false;

	console.log(emptyCart);

	const totalPrice = useAppSelector(totalCartPrice);
	const totalItems = useAppSelector(totalCartItems);

	const trackAddToCart = () => {
		sendGTMEvent({
			event: "add_to_cart",
			value: totalPrice,
			items: cartItems.map((item) => ({
				item_id: item.product.product.id,
				item_name: item.product.product.title,
				price: item.product.product.price,
				quantity: item.qty,
			})),
		});
	};

	const trackRemoveFromCart = () => {
		sendGTMEvent({
			event: "remove_form_cart",
			value: totalPrice,
			items: cartItems.map((item) => ({
				item_id: item.product.product.id,
				item_name: item.product.product.title,
				price: item.product.product.price,
				quantity: item.qty,
			})),
		});
	};

	return (
		<Sheet
			defaultOpen={false}
			open={open}
			onOpenChange={() => dispatch(toggleCart())}
		>
			<SheetTrigger asChild>
				<Button
					onClick={() => {
						sendGTMEvent({
							event: "view_cart",
						});
					}}
					className="relative"
				>
					<ShoppingBag />
					{totalItems > 0 && (
						<span className="absolute flex items-center justify-center w-4 h-4 text-white bg-red-700 rounded-full -top-1 -right-1">
							{totalItems}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Cart</SheetTitle>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					{cartItems.map((item, index) => (
						<div key={item.product.product.id} className="relative">
							<Button
								size="sm"
								onClick={() => {
									dispatch(deleteItem(item.product));
									trackRemoveFromCart();
								}}
								className="absolute bottom-0 right-0 text-white bg-red-700"
							>
								<Trash2Icon />
							</Button>
							<div className="flex flex-col items-start justify-between md:flex-row md:justify-start">
								<Image
									src={item.product.product.images[0]}
									alt={item.product.product.title}
									width={150}
									height={150}
									className="w-[150px] md:w-[20%] aspect-square object-cover"
								/>
								<div className="flex flex-col items-start justify-between">
									<h3 className="text-md">{item.product.product.title}</h3>
									{item.product.selectedVariant !== "" && (
										<p className="text-sm font-semibold">
											{item.product.selectedVariant}
										</p>
									)}
									<h3 className="text-md">
										{formatter(item.product.product.price)} * {item.qty}
									</h3>
									<div className="flex items-center mt-2 space-x-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												dispatch(decrement(item.product));
												trackRemoveFromCart();
											}}
										>
											<MinusIcon />
										</Button>
										<strong>{item.qty}</strong>
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												dispatch(increment(item.product));
												sendGTMEvent({
													event: "add_to_cart",
													value: totalPrice,
													items: [
														{
															item_id: item.product.product.id,
															item_name: item.product.product.title,
															price: item.product.product.price,
															quantity: item.qty,
														},
													],
												});
											}}
										>
											<PlusIcon />
										</Button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				<Separator />
				<div>
					<SheetClose onClick={() => dispatch(closeCart())} asChild>
						<div className="w-full">
							<div className="w-full">
								<div className="flex items-center justify-between my-4 font-extrabold">
									<h3 className="text-md">Cart Total</h3>
									<h3 className="text-md">{formatter(totalPrice)}</h3>
								</div>
							</div>
							<Link href="/checkout">
								<Button
									className="w-full rounded-none bg-brand hover:bg-brand_light"
									type="button"
									// aria-disabled={emptyCart}
									// disabled={emptyCart}
									onClick={() => {
										if (emptyCart) {
											alert(
												"Please add an item to your cart in order to continue to checkout",
											);
											return;
										}
										sendGTMEvent({
											event: "begin_checkout",
										});
									}}
								>
									Chekout
								</Button>
							</Link>
						</div>
					</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
};
export default CartSheet;
