import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "@/schema";
import { createServerClient } from "@supabase/ssr";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

const BrandLogoUpload = () => {
    const cookieStore = (cookies() as unknown as UnsafeUnwrappedCookies);

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

  async function upload(data:FormData) {
    "use server"

    const file:File|null = data.get("file") as unknown as File;

    if(!file) {
      throw new Error("No file was uploaded");
    }

    const fileName = file.name;

    const randomString = Math.random().toString(36).substring(2, 15);

    const { data: fileData, error } = await supabase.storage
      .from("brands")
      .upload(randomString, file);

    if(error) {
      throw new Error(error.message);
    } else {
      console.log(fileData);
    }
  }


  return <form action={upload} className="flex items-center space-x-3">
    <Input type="file" name="file" id="file" />
    <Button type="submit">Upload</Button>
  </form>;
};
export default BrandLogoUpload;
