import { Separator } from "@/components/ui/separator";
import { Database } from "@/schema";
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
    const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <div className="w-full">
    <h1 className="text-2xl">Users</h1>
   <Separator />
   {typeof profiles === null || !profiles?.length || profiles.length === 0 ? <p>No users yet</p> :
   <Table>
    <TableHeader>
      <TableRow>
        <TableHeader>Email</TableHeader>
        <TableHeader>First Name</TableHeader>
        <TableHeader>Last Name</TableHeader>
        <TableHeader>Date</TableHeader>
      </TableRow>
    </TableHeader>
    <TableBody>
      {profiles.map((profile) => (
        <TableRow key={profile.id}>
          <TableCell>{profile.email}</TableCell>
          <TableCell>{profile.first_name}</TableCell>
          <TableCell>{profile.last_name}</TableCell>
          <TableCell>{profile.updated_at}</TableCell>
        </TableRow>
      ))}
    </TableBody>
   </Table>
   }
  </div>;
};
export default page;
