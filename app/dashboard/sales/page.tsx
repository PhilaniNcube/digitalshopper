import { Separator } from "@/components/ui/separator";
import type { Database } from "@/schema";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export const dynamic = "force-dynamic";

const page = async () => {

    const cookieStore = cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )


  const {data:orders,error} = await supabase.from("orders").select("*").order("created_at", {ascending: false}).eq('paid', true);

  return <div className="w-full">
    <h1 className="text-2xl">Orders</h1>
   <Separator />
   {orders === null || orders.length === 0 ? <p>No orders yet.</p> :
   <Table>

      <TableHeader>
        <TableHead>Order ID</TableHead>
        <TableHead>Customer</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Address</TableHead>
        <TableHead>City</TableHead>
        <TableHead>Created At</TableHead>
        <TableHead>
          View
        </TableHead>
      </TableHeader>

    <TableBody>
      {orders.map((order) => (
        <TableRow key={order.id}>
          <TableCell>{order.id}</TableCell>
          <TableCell>{order.first_name} {order.last_name}</TableCell>
          <TableCell>{order.total_amount}</TableCell>
          <TableCell>{order.address}</TableCell>
          <TableCell>{order.city}</TableCell>
          <TableCell>{order.created_at}</TableCell>
          <TableCell>
            <Link href={`/dashboard/sales/${order.id}`}>
              View
           </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
   </Table>
   }

  </div>;
};
export default page;
