"use client"
import type { Database } from "@/schema";
import { FormEvent, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {  useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { CircleDashed, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { totalCartItems, totalCartPrice } from "@/store/features/cartSlice";
import formatter from "@/lib/currency";
import type { PayfastData } from "@/interfaces";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  first_name: z.string().min(2, "First Name Is Too Short!").max(20, "First Name Is Too Long!"),
  last_name: z.string().min(2, "Last Name Is Too Short!").max(20, "Last Name Is Too Long!"),
  email: z.string().email("Invalid Email Address!"),
  phone: z.string().min(10, "Phone Number Is Too Short!").max(10, "Phone Number Is Too Long!"),
  address: z.string().min(5, "Address Is Too Short!").max(50, "Address Is Too Long!"),
  city: z.string().min(2, "City Is Too Short!").max(20, "City Is Too Long!"),
  province: z.string(),
  postal_code: z.string(),
});

const CheckoutForm = () => {

    const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [newOrder, setNewOrder] = useState<Database['public']['Tables']['orders']['Row'] | null>(null);

  const [signature, setSignature] = useState<PayfastData>();

  const payfastFormRef = useRef<HTMLFormElement>(null);

  const submitForm = () => {
    console.log("submitting form")
    setLoading(false);
    const payfastForm = payfastFormRef.current;
    const x = payfastFormRef.current?.attributes;

    console.log({ x })
    payfastForm?.submit();

  }

  const router = useRouter();

  const dispatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.cartItems);

    // disable checkout if cart is empty
    const disableCheckout = cartItems.length === 0;

    const subtotal = useAppSelector(totalCartPrice);
    const shippingPrice = subtotal > 1200 ? 0 : 80;
    const totalItems = useAppSelector(totalCartItems);


      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
      });

      async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true)
        console.log("data", data);
        const { data: order, error } = await supabase.from("orders").insert([{
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          postal_code: data.postal_code,
          order_items: cartItems.map((item) => {
            return {
              product: item.product.product,
              quantity: item.qty,
              variant: item.product.selectedVariant,
            }
          }),
          subtotal: subtotal,
          shipping: shippingPrice,
          total_amount: subtotal + shippingPrice,
        }]).select("*").single()

        if (error) {
          toast({
            title: "Error",
            description: error.message,
          })
          setLoading(false)
        } else {
          toast({
            title: "Success",
            description: "Order Placed Successfully",
          })
          setNewOrder(order)

          // console.log({ order })
          // router.push(`/orders/${order?.id}`)

          const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${order.id}`;

          const request = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-cache",
            body: JSON.stringify(order),
          })
            .then((res) => res.json())
            .then((data) => data)
            .catch((error) => console.log(error));

          const result:PayfastData = await request;

          console.log({ result })

          setSignature(result)

          submitForm();


        }
      }


  return (
			<>
				{newOrder && (
					<form
						className="hidden"
						hidden
						action={process.env.NEXT_PUBLIC_PAYFAST_URL}
						ref={payfastFormRef}
						method="POST"
					>
						<input
							type="hidden"
							name="merchant_id"
							value={process.env.NEXT_PUBLIC_MERCHANT_ID}
						/>
						<input
							type="hidden"
							name="merchant_key"
							value={process.env.NEXT_PUBLIC_MERCHANT_KEY}
						/>
						<input
							type="hidden"
							name="return_url"
							value={`${process.env.NEXT_PUBLIC_SITE_URL}/orders/${newOrder.id}/success`}
						/>
						<input
							type="hidden"
							name="cancel_url"
							value={`${process.env.NEXT_PUBLIC_SITE_URL}/orders/${newOrder.id}/cancel`}
						/>
						<input
							type="hidden"
							name="notify_url"
							value={`${process.env.NEXT_PUBLIC_SITE_URL}/api/notify?order_id=${newOrder.id}`}
						/>
						<input
							type="hidden"
							name="name_first"
							value={newOrder.first_name}
						/>
						<input type="hidden" name="name_last" value={newOrder.last_name} />
						<input type="hidden" name="email_address" value={newOrder.email} />
						<input type="hidden" name="cell_number" value={newOrder.phone} />
						<input type="hidden" name="amount" value={newOrder.total_amount} />
						<input type="hidden" name="item_name" value={newOrder.id} />
						<input type="hidden" name="custom_str1" value={newOrder.address} />
						<input type="hidden" name="custom_str2" value={newOrder.city} />
						<input type="hidden" name="signature" value={signature?.hash} />
						<input type="submit" value="Pay Now" />
					</form>
				)}

				<Form {...form}>
					<h1 className="text-4xl font-semibold text-black uppercase">
						Checkout
					</h1>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3"
					>
						<div className="flex w-full col-span-1 gap-4 lg:col-span-2">
							<div className="w-full">
								<h2 className="text-lg font-bold uppercase text-brand">
									Billing Details
								</h2>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="w-full">
										<FormField
											control={form.control}
											name="first_name"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														First Name
													</FormLabel>
													<FormControl>
														<Input placeholder="First Name..." {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full">
										<FormField
											control={form.control}
											name="last_name"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														Last Name
													</FormLabel>
													<FormControl>
														<Input placeholder="Last Name..." {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
									<div className="w-full">
										{" "}
										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														Email
													</FormLabel>
													<FormControl>
														<Input placeholder="Email" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full">
										{" "}
										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														Phone Number
													</FormLabel>
													<FormControl>
														<Input placeholder="Phone" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<h2 className="mt-8 text-lg font-bold uppercase text-brand">
									Shipping Details
								</h2>

								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="w-full">
										{" "}
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														Address
													</FormLabel>
													<FormControl>
														<Input placeholder="Address" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full">
										{" "}
										<FormField
											control={form.control}
											name="city"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														City
													</FormLabel>
													<FormControl>
														<Input placeholder="City" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
									<div className="w-full">
										{" "}
										<FormField
											control={form.control}
											name="province"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														Province
													</FormLabel>
													<FormControl>
														<Input placeholder="Province" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="w-full">
										{" "}
										<FormField
											control={form.control}
											name="postal_code"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-medium text-black">
														Postal Code
													</FormLabel>
													<FormControl>
														<Input placeholder="Postal Code" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-col justify-between col-span-1 rounded bg-slate-100">
							<div className="p-4">
								<h2 className="text-lg font-bold text-black uppercase">
									Summary
								</h2>
								<Separator className="my-3" />
								<div className="w-full">
									{cartItems.map((item) => (
										<div
											key={item.product.product.id}
											className="flex w-full gap-2"
										>
											{item.product.product.images && (
												<Image
													src={item.product.product.images[0] || ""}
													width={200}
													height={200}
													alt={item.product.product.title}
													className="object-cover w-1/4 aspect-square"
												/>
											)}

											<div className="flex items-start justify-between flex-1">
												<div className="flex-1">
													<h3 className="font-semibold text-black">
														{item.product.product.title} <br />
														{item.product.selectedVariant !== "" && (
															<span className="text-sm capitalize text-slate-700">
																{item.product.selectedVariant}
															</span>
														)}
													</h3>
													<p className="flex items-center space-x-2 text-sm text-gray-500">
														{formatter(item.product.product.price)} <XIcon />{" "}
														{item.qty}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="p-4">
								<Separator className="my-3" />
								<div className="flex items-center justify-between w-full">
									<h3 className="font-semibold text-black">Subtotal</h3>
									<p className="font-semibold text-black">
										{formatter(subtotal)}
									</p>
								</div>
								<div className="flex items-center justify-between w-full">
									<h3 className="font-semibold text-black">Shipping</h3>
									<p className="font-semibold text-black">
										{formatter(shippingPrice)}
									</p>
								</div>
								<Separator className="my-3" />
								<div className="flex items-center justify-between w-full mb-3">
									<h3 className="text-2xl font-semibold text-black">Total</h3>
									<p className="text-2xl font-semibold text-black">
										{formatter(shippingPrice + subtotal)}
									</p>
								</div>

								<Button
									type="submit"
									aria-disabled={disableCheckout}
									disabled={disableCheckout}
									className="w-full text-white rounded-none bg-brand hover:bg-brand_light"
								>
									{loading ? (
										<CircleDashed className="animate-spin" />
									) : (
										"Place Order"
									)}
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</>
		);
};
export default CheckoutForm;
