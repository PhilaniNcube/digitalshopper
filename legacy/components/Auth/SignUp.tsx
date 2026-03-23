"use client"
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
import { CircleDashed } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr'
import { Database } from "@/schema";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  })
});

const SignUp = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  // Create a Supabase client configured to use cookies
    const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${location}/auth/callback`,
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
        }
      },
    });

    if(error) {
     toast({
       variant: "destructive",
       title: "Error",
       description: error.message,
       action: (
         <ToastAction onClick={() => setOpen(false)} altText="Close">
           Close
         </ToastAction>
       ),
     });
     setLoading(false);
    } else {
      toast({
        title: "Success",
        description: "Check your email for the confirmation link.",
        action: <ToastAction onClick={() => {
          router.refresh();
          setOpen(false)
        }} altText="Close">Close</ToastAction>
      })
      setLoading(false);

      // setOpen(false);
    }

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="px-4 py-2 ml-3 text-white ">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Your Account</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>

                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>

                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
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
                  <FormItem>
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
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SignUp;
