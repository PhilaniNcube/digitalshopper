import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const FeaturedBathProduct = () => {
  return (
    <section>
      <div className="container py-10 relative">
        <Image
          src="https://wrdsrupthgeuaredfstv.supabase.co/storage/v1/object/public/categories/bath-products.webp"
          width={1920}
          height={1080}
          alt="Bath Salts"
          className="w-full aspect-square lg:aspect-[3/1] object-cover"
        />
        <div className="flex absolute inset-0 flex-col justify-center items-start p-16 lg:p-20">
          <h2 className="text-2xl lg:text-3xl font-bold text-black">
           Skin Care
          </h2>
          <Link href="/categories/cosmetics?sub_category=skincare">
            <Button
              type="button"
              className="mt-4 bg-transparent text-xl uppercase hover:border-brand hover:text-brand hover:bg-transparent border-2 border-black text-black rounded-none"
            >
              See Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default FeaturedBathProduct;
