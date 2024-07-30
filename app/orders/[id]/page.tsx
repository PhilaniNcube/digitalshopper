import { Separator } from "@/components/ui/separator";
import { Database } from "@/schema";

const page = async ({params: {id}}:{params: {id:string}}) => {

     const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${id}`;

     const orderResponse = await fetch(url, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       },
       cache: "no-cache",
     })
       .then((res) => {
         if (!res.ok) {
           throw new Error(`Network response was not ok (${res.status})`);
         }
         return res.json();
       })
       .then((data) => {
         console.log(data);
         return data;
       })
       .catch((error) => console.log(error));

    //  console.log({orderResponse});

    const data:{message:string, status:number, data:Database['public']['Tables']['orders']['Row'] | null} = await orderResponse;


  return (
    <main className="container py-10 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold">Order ID {id.split('-')[0]}</h1>
          <Separator className="my-3" />
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">

              </div>
            </div>
          </form>
        </div>
      </div>
      {JSON.stringify(data.data, null, 2)}
    </main>
  );
};
export default page;
