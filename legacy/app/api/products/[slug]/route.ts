// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { Database } from '@/schema'
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'



export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  // Create a Supabase client configured to use cookies

  const slug = params.slug

  const supabase = await createClient()

  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
  const { data: product, error } = await supabase.from('products').select('*, brand(*), category(*), sub_category(*)').eq('slug', slug).single()



  return NextResponse.json({product})
}
