/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LOKQAHxebjZ
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignIn from "@/components/Auth/SignIn";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function Component() {

  const forgotPasswordAction = async (formData:FormData) => {
    "use server"
    const cookieStore = cookies();

      const supabase = createServerClient(
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

      const email = formData.get('email');
      console.log({email})

      if(typeof !email === "string" || email === null) {
        return;
      } else if (typeof email === "string") {
        await supabase.auth.resetPasswordForEmail(email);
      } else {
        return;
      }

  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto space-y-8">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
          Forgot your password
        </h2>
        <form action={forgotPasswordAction} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                id="email-address"
                name="email"
                placeholder="email@example.com"
                required
                type="email"
              />
            </div>
          </div>
          <div>
            <Button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              type="submit"
            >
              Reset password
            </Button>
          </div>
        <p className="mt-3 text-sm">You will receive a link with to reset your password in your email inbox</p>
        </form>
      </div>
    </div>
  );
}
