"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const router = useRouter()

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );


  // create a handlePasswordReset function which checks if the password is the same as the confirm password
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast({
        title: 'Confirm Password does not match',
        description: 'Please check that your password and confirm password are the same',
      })
      return;
    } else {

       const { data, error } = await supabase.auth.updateUser({
         email: email,
         password: password,
       });

       if(error) {
        toast({
          title: 'Error',
          description: error.message,
        })
       } else if (data) {
        toast({
          title: 'Success',
          description: 'Your password has been reset',
        })

        router.push("/")
       }

    }
  }


  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto space-y-8">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <form onSubmit={handlePasswordReset} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="space-y-2 pb-4">
              <Label htmlFor="email-address">Email address</Label>
              <Input
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                id="email-address"
                name="email"
                placeholder="Email address"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 pb-4">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                id="new-password"
                name="new-password"
                placeholder="New password"
                required
                type="password"
              />
            </div>
            <div className="space-y-2 pb-4">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                id="confirm-password"
                name="confirm-password"
                placeholder="Confirm new password"
                required
                type="password"
              />
            </div>
          </div>
          <div>
            <Button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              type="submit"
            >
              Change password
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
