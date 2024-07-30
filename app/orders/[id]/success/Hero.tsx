"use client"
import Image from "next/image";
import {
  clearCart,
} from "@/store/features/cartSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";

const Hero = () => {

    const dispatch = useAppDispatch();

    //clear the cart after successful order
    useEffect(() => {
      dispatch(clearCart());
    },[])

  return <div className="w-full relative">
    <Image src="/images/orders.jpg" width={1920} height={1280} alt="Hero" className="w-full aspect-3/2 lg:aspect-3/1 object-cover" />
    <div className="absolute inset-0 bg-slate-300/80">
      <div className="container mx-auto px-4 h-full w-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl md:text-4xl font-bold text-black">Order Successful</h1>
          <p className="text-md md:text-xl font-semibold">Please check your email for your order details</p>
        </div>
      </div>
    </div>
  </div>;
};
export default Hero;
