import { cache } from "react";
import { createClient } from "../supabase/server";


export  const getAdmin = cache(async() => {

  const supabase = await createClient();

  const {data:is_admin} = await supabase.rpc("is_admin").single();

  console.log(is_admin  );

 return is_admin;
});

export const getSession = cache(async() => {

  const supabase = await createClient();

  const {data:{session}} = await supabase.auth.getSession();



  return session;
});
