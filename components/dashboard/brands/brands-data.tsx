import { getAdminBrands } from "@/dal/queries/brands";
import { BrandsTable } from "./brands-table";

type BrandsDataProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BrandsData({ searchParams }: BrandsDataProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(getSingleValue(resolvedSearchParams.page) ?? "1");
  const pageSize = Number(getSingleValue(resolvedSearchParams.pageSize) ?? "20");
  const { items, pagination } = await getAdminBrands({ page, pageSize });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
        <p className="text-white">
          Manage all catalog brands. {pagination.totalItems} brand item(s) total.
        </p>
      </div>
      <BrandsTable brands={items} pagination={pagination} />
    </div>
  );
}