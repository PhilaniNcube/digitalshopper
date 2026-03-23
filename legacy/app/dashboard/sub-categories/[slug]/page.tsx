import BackButton from "@/components/BackButton";
import { Database } from "@/schema";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const page = async (props:{params: Promise<{slug:string}>}) => {
  const params = await props.params;

  const {
    slug
  } = params;

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

  const categoriesData = supabase
    .from("sub_categories")
    .select("*, category(*)")
    .eq("slug", slug)
    .single();

  const[{data:categories, error:categoriesError}] = await Promise.all([categoriesData])

  if(categoriesError){
    throw categoriesError.message
  }

  return <div className="w-full">
    <div className="w-full flex items-end justify-between">
      <h1 className="text-3xl font-bold">{categories?.title}</h1>
      <BackButton />
    </div>
  </div>;
};
export default page;
