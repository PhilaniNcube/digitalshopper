"use client"

import { Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MenuDrawer from "./MenuDrawer";
import { Database } from "@/schema";
import Image from "next/image";
import { Session } from "@supabase/supabase-js";
import SearchInput from "@/components/Products/SearchInput";


const TabletNav = ({
  session,
  categories,
}: {
  session: Session | null;
  categories: Database["public"]["Tables"]["categories"]["Row"][];
}) => {
  return (
    <div className="container flex items-center justify-between py-2 border-b lg:hidden border-slate-100">
      <div className="flex items-center space-x-4">
        <MenuDrawer categories={categories} />
        <Link href="/" className="font-bold">
          <Image
            src="/images/new-ds-logo.webp"
            className="object-cover w-16"
            alt="Logo"
            width={400}
            height={400}
          />
        </Link>
      </div>
      <div className="flex items-center justify-end flex-1 ml-4 gap-3">
        <SearchInput />
        <span>
          <ShoppingCart />
        </span>
      </div>
    </div>
  );
};
export default TabletNav;
