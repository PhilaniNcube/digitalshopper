"use client"
import { Separator } from "@/components/ui/separator";
import { Database } from "@/schema";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

type FilterProps = {
  sub_categories: Database["public"]["Tables"]["sub_categories"]["Row"][] | [];
  filter_title: string;
  slug: string;
  frame_styles: Database["public"]["Tables"]["frame_styles"]["Row"][] | [];
};

const Filter = ({sub_categories, filter_title, slug, frame_styles}:FilterProps) => {

  const searchParams = useSearchParams()

  const sub_category = searchParams.get('sub_category') || '';

  const frame_style = searchParams.get('frame_style') || '';

  const gender = searchParams.get('gender') || '';



  return (
    <aside className="hidden md:flex flex-col min-w-[200px] max-w-[300px]">
      <h3 className="text-2xl font-bold">{filter_title}</h3>

      <div className="flex flex-col">
        {sub_categories?.map((sub_category) => (
          <Link
            className="font-medium transition-all duration-200 text-md text-slate-900 hover:text-slate-700"
            key={sub_category.slug}
            href={`/categories/${slug}?sub_category=${sub_category.slug}`}
          >
            {sub_category.title}
          </Link>
        ))}
      </div>
      <Separator className="my-4" />
      {slug === "eyewear" && (
        <>
          <h3 className="text-2xl font-bold">Frame Shapes</h3>

          <div className="flex flex-col">
            {frame_styles?.map((style) => (
              <Link
                className="font-medium transition-all duration-200 text-md text-slate-900 hover:text-slate-700"
                key={style.slug}
                href={{
                  pathname: `/categories/${slug}`,
                  query: {

                    frame_style: style.slug,
                  },
                }}
              >
                {style.title}
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          <h3 className="text-2xl font-bold">Gender</h3>
          <div className="flex flex-col">
            <Link
              className="font-medium transition-all duration-200 text-md text-slate-900 hover:text-slate-700"
              href={{
                pathname: `/categories/${slug}`,
                query: {
                  gender: "men"
                },
              }}
            >
              Men
            </Link>
            <Link
              className="font-medium transition-all duration-200 text-md text-slate-900 hover:text-slate-700"
              href={{
                pathname: `/categories/${slug}`,
                query: {
                  gender: "women"
                },
              }}
            >
              Women
            </Link>
            <Link
              className="font-medium transition-all duration-200 text-md text-slate-900 hover:text-slate-700"
              href={{
                pathname: `/categories/${slug}`,
                query: {
                  gender: "unisex"
                },
              }}
            >
              Unisex
            </Link>
          </div>
        </>
      )}
    </aside>
  );
};
export default Filter;
