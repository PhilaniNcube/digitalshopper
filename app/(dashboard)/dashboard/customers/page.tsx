import { Suspense } from "react";
import CustomersData from "@/components/dashboard/customers/customers-data";

type DashboardCustomersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DashboardCustomersPage({ searchParams }: DashboardCustomersPageProps) {
  return (
    <div className="container">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
              <p className="text-white">Loading customers...</p>
            </div>
          </div>
        }
      >
        <CustomersData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}