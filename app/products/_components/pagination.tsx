import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const Pagination = ({ hasPrevPage,hasNextPage,  search, page, count }:{hasNextPage:boolean, hasPrevPage:boolean, count:number, search:string | string[] , page:string | string[]}) => {
  return (
    <div className="flex items-center w-full mt-2 space-x-2">
      {hasPrevPage && (
        <Link
          href={{
            pathname: "/dashboard/products",
            query: {
              search: search,
              page: hasPrevPage ? Number(page) - 1 : Number(page),
            },
          }}
        >
          <Button
            // disabled={hasPrevPage}
            variant="outline"
            className="rounded-none"
          >
            {" "}
            <ChevronLeft /> Prev
          </Button>
        </Link>
      )}
      {hasNextPage && (
        <Link
          href={{
            pathname: "/dashboard/products",
            query: {
              search: search,
              page: hasNextPage ? Number(page) + 1 : Number(page),
            },
          }}
        >
          <Button
            // disabled={hasNextPage}
            variant="outline"
            className="rounded-none"
          >
            {" "}
            <ChevronRight /> Next
          </Button>
        </Link>
      )}
    </div>
  );
};
export default Pagination;
