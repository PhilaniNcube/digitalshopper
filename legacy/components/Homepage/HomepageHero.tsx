import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const HomepageHero = () => {
  return (
    <section className="w-full bg-black relative">

      <div className="">
        <div className="container py-10">
          <section className="w-full py-12">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <Image
                  alt="South African Ecommerce"
                  className="mx-auto aspect-video overflow-hidden rounded-xl lg:rounded-md object-cover object-center sm:w-full lg:order-last"
                  height={1728}
                  src="/images/delivery.png"
                  width={2752}
                />
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                      Shop the Best of South Africa
                    </h1>
                    <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
                      Discover unique products, crafted with love and delivered
                      right to your doorstep.
                    </p>
                  </div>
                  <Link href="/products" passHref>
                    <Button className="bg-brand hover:bg-brand_light text-white uppercase rounded-none w-[200px]">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
export default HomepageHero;
