"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { CircleDashed, MailCheck } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Database } from "@/schema";
import Link from "next/link";


const FormSchema = z.object({

  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignIn = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        action: <ToastAction onClick={() => setOpen(false)} altText="Close">Close</ToastAction>
      });
      setLoading(false);
      // setOpen(false);
      // console.log(error.message)

    }  else {
      toast({
        title: "Success",
        description: "You have successfully signed in.",
        action: (
          <ToastAction onClick={() => setOpen(false)} altText="Close">
            Close
          </ToastAction>
        ),
      });
      router.refresh()
      setLoading(false);
      setOpen(false);
    }

  }

  const signInWithGoogle = async () => {


    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    console.log(error)
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-4 py-2 ml-3 text-white ">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="2@example.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="" {...field} />
                    </FormControl>

                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="flex items-center justify-center w-full mt-4 text-black rounded-none bg-amber-600"
              >
                {loading ? (
                  <CircleDashed className="animate-spin" />
                ) : (
                  <>
                    <MailCheck size={16} className="mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="flex justify-center my-1">
            <h3>OR</h3>
          </div>

          <Button
            className="flex w-full space-x-3 font-bold text-black outline-black"
            variant="outline"
            type="button"
            onClick={signInWithGoogle}
          >
            <Image
              src="/images/google-icon.png"
              alt="Google Icon"
              width={20}
              height={20}
              className="object-cover w-4 mr-2"
            />
            Sign In With Google
          </Button>
        </div>
        <div className="mt-3" onClick={() => setOpen(false)}>
          <Link href="/forgot-password">
            Forgot Password?
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SignIn;
