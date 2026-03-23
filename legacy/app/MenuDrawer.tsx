"use client"
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
import { Menu, ShoppingCart } from "lucide-react";

import Link from "next/link";

import { useState } from "react";
import { Database } from "@/schema";

const MenuDrawer = ({categories}:{categories: Database['public']['Tables']['categories']['Row'][]}) => {

  const [open, setOpen] = useState(false);

  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Menu />
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Navigation Menu</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col" onClick={() => setOpen(false)}>
        {categories.map((link) => (
          <Link
            className="font-medium hover:text-slate-300"
            href={`/categories/${link.slug}`}
            key={link.id}
          >
            {link.title}
          </Link>
        ))}
      </div>
    </SheetContent>
  </Sheet>;
};
export default MenuDrawer;
