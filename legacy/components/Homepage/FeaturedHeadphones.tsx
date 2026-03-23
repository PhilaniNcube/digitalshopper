import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const FeaturedHeadphones = () => {
  return (
    <section className="py-10">
      <div className="container ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 bg-brand">
          <div className="flex flex-col justify-end items-center overflow-clip">
            <Image
              src="/images/oneodia-pro-50.webp"
              width={500}
              height={500}
              alt="Silenco"
              className="w-full aspect-square object-cover"
            />
          </div>
          <div className="w-full flex flex-col justify-center items-center text-center lg:text-start lg:items-start text-white p-4">
            <h3 className="text-2xl font-bold uppercase md:text-3xl lg:text-4xl max-w-[25ch]">
              Oneodio Pro 50 - Professional Wired DJ/Studio Headphones
            </h3>
            <p className="text-slate-200 text-sm md:text-md tracking-wider max-w-[450px]">
              Studio Pro 50 headphones meet the industry benchmark for reference
              audio sound and accurate sound reproduction. Deliver a top-notch
              impulse and exceptional isolation in a perfectly neutral listening
              environment.
            </p>
            <Link href="/products/oneodio-pro-50-wired-over-ear-headphones">
              <Button
                type="button"
                className="rounded-none max-w-[220px] bg-black text-white font-bold uppercase mt-6"
              >
                See Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturedHeadphones;
