
import { Database } from '@/schema'
import { CookieOptions, createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ServerAction() {
  const addTodo = async (formData: FormData) => {
    'use server'
    const title = formData.get('title')

    if (title) {
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
              set(name: string, value: string, options: CookieOptions) {
                cookieStore.set({ name, value, ...options });
              },
              remove(name: string, options: CookieOptions) {
                cookieStore.set({ name, value: "", ...options });
              },
            },
          }
        );

      // This assumes you have a `todos` table in Supabase. Check out
      // the `Create Table and seed with data` section of the README 👇
      // https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md
      await supabase.from('todos').insert({ title })
      revalidatePath('/server-action-example')
    }
  }

  return (
    <form action={addTodo}>
      <input name="title" />
    </form>
  )
}
