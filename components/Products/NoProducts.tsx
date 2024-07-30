"use client"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NoProducts() {

  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center ">
      <svg
        className=" w-16 h-16 text-zinc-500 dark:text-zinc-400"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
      <h2 className="text-2xl font-semibold mt-4">No Products Found</h2>
      <p className="text-zinc-500 dark:text-zinc-400 mt-2">
        We couldn't find any products matching your search.
      </p>
      <Button onClick={() => router.back()} className="mt-6" variant="outline">
        Go Back
      </Button>
    </section>
  );
}
