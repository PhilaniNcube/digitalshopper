"use client"
import { Database } from "@/schema";
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const SignOut = () => {

    const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const router = useRouter();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <Button onClick={signOut} className="text-red-600" variant="ghost" type="submit">
      Sign Out
    </Button>
  );
};
export default SignOut;
