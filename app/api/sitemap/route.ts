import { Database } from '@/schema'
import { CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const cookieStore = cookies()


  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    })

  try {

        const { data: productSlugs, error:productError } = await supabase.from("products").select("slug");
    const { data: categorySlugs, error:categoryError } = await supabase.from("categories").select("slug");

    return NextResponse.json({
      productSlugs,
      categorySlugs
    })

  } catch (error) {
    console.log(error);
    return new NextResponse("There was an error", {status: 500});

  }



  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md



}
