/**
 * v0 by Vercel.
 * @see https://v0.dev/t/x8qNSNRXGAB
 */
import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="relative w-full aspect-[8/5] lg:aspect-[8/3]">
      <Image
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
        height="1397"
        src="/images/banner.png"
        width="2560"
      />
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center bg-black/80">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-7xl">
            Welcome to Our Store
          </h1>
          <p className="mt-4 text-lg text-white sm:text-2xl">
            Discover exclusive deals and discounts
          </p>
          <Link
            className="rounded-none inline-flex mt-8 items-center justify-center text-lg bg-brand px-8 py-3 uppercase tracking-wide font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
            href="/products"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
