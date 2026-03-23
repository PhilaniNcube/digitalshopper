import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";
import { cookies } from "next/headers";
import { Database } from "@/schema";
import { AlignHorizontalDistributeStartIcon, BanIcon, BoxIcon, BoxesIcon, CoinsIcon, GemIcon, PieChartIcon, User2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const layout = async ({children}:{children:ReactNode}) => {

  const supabase = await createClient()

  const {data} = await supabase.rpc("is_admin").single()

  console.log({dashboard:data});

  if(data === false) {
    redirect("/");
  }



  return (
    <main className="dashboard">
      <div className="flex h-full">
        <aside className="flex w-[300px] shadow px-4 py-4">
          <div className="flex flex-col w-full h-full">
            <span className="flex items-center w-full space-x-4">
              <PieChartIcon className="text-blue-600" size={24} />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </span>
            <Separator className="my-4" />
            <div className="w-full">
              <Link
                href="/dashboard/sales"
                className="flex items-center w-full space-x-4"
              >
                <CoinsIcon className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Sales</h2>
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center w-full mt-2 space-x-4"
              >
                <BoxesIcon className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Products</h2>
              </Link>
              <Link
                href="/dashboard/categories"
                className="flex items-center w-full mt-2 space-x-4"
              >
                <AlignHorizontalDistributeStartIcon className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Categories</h2>
              </Link>
              <Link
                href="/dashboard/sub-categories"
                className="flex items-center w-full mt-2 space-x-4"
              >
                <BoxIcon className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Sub Categories</h2>
              </Link>
              <Link
                href="/dashboard/brands"
                className="flex items-center w-full mt-2 space-x-4"
              >
                <GemIcon className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Brands</h2>
              </Link>
              <Link
                href="/dashboard/users"
                className="flex items-center w-full mt-2 space-x-4"
              >
                <User2 className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Customers</h2>
              </Link>
            </div>
          </div>
        </aside>
        <div className="flex-1 h-full bg-slate-100">
          <ScrollArea className="container h-[calc(100dvh-40px)] py-6">{children}</ScrollArea>
        </div>
      </div>
    </main>
  );
};
export default layout;
