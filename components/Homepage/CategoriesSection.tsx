import { Database } from "@/schema";
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const CategoriesSection = async () => {

    const cookieStore = cookies()

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

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("title", { ascending: false })
    .neq("id", "1ee42d6c-11a4-41a1-af96-1479a544382f");
    // .neq("id", "41e92af3-10d1-4ae4-9214-9ba17acab833")

  return <section>
    <div className="container py-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories?.map((category) => (
        <Link href={`/categories/${category.slug}`} className="w-full bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:shadow-md">
          <Image src={category.image_url} width={1280} height={1080} alt={category.title} className="w-full object-cover aspect-video" />
          <div className="p-4 w-full flex flex-col justify-center items-center">
           <h3 className="text-black font-bold uppercase text-lg">{category.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  </section>;
};
export default CategoriesSection;
