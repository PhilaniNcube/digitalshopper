
import { Database } from '@/schema';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ServerComponent() {
  // Create a Supabase client configured to use cookies
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

  // This assumes you have a `todos` table in Supabase. Check out
  // the `Create Table and seed with data` section of the README 👇
  // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
  const { data: todos } = await supabase.from('todos').select()

  return <pre>{JSON.stringify(todos, null, 2)}</pre>
}
