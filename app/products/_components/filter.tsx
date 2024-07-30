
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database } from "@/schema";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const Filter = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string[] | string | undefined };
}) => {

    const cookieStore = cookies();

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

  const { data: categories, error } = await supabase.from("categories").select("*");

  return (
    <div className="mt-2">
      <aside className="col-span-1 bg-white lg:min-w-[200px] p-4">
        <h2 className="mb-4 text-lg font-semibold md:text-xl">Filters</h2>
        {categories && (
          <div className="flex flex-row flex-wrap gap-4 lg:flex-col lg:gap-3">
            {categories.map((category) => (
              <Link className="text-sm" key={category.id} href={{
                pathname: `/categories/${category.slug}`,


              }}>
                {category.title}
              </Link>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};
export default Filter;
