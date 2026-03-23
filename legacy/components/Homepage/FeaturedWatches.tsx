import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const FeaturedWatches = () => {
  return (
    <section>
      <div className="container py-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
          <Image
            src="/images/amazfit.jpg"
            width={1920}
            height={1280}
            alt="Watches"
            className="w-full aspect-video object-cover"
          />
          <div className="w-full aspect-video flex flex-col justify-center items-start px-10 lg:px-20 bg-slate-200 text-black">
            <h2 className="text-2xl uppercase md:text-4xl font-bold text-black mb-5">
              Elegant Watches
            </h2>
            <Link
              href="/categories/electronics?sub_category=smartwatches"
              className=""
            >
              <Button
                type="button"
                className="border-2 border-black text-black rounded-none uppercase text-2xl font-medium hover:border-brand bg-transparent hover:bg-brand"
              >
                See Watches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturedWatches;
