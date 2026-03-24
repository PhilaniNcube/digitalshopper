import { Suspense } from "react";
import BrandsData from "@/components/dashboard/brands/brands-data";

type DashboardBrandsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DashboardBrandsPage({ searchParams }: DashboardBrandsPageProps) {
  return (
    <div className="container">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
              <p className="text-white">Loading brands...</p>
            </div>
          </div>
        }
      >
        <BrandsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}