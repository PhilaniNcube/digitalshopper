"use client"

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { useState } from "react";

interface Props {
  children: React.ReactNode;

}

const CartProvider = ({children}:Props) => {



  return <Provider store={store}>{children}</Provider>;
};
export default CartProvider;
