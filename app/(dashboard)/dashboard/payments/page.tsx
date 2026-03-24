import { Suspense } from "react";
import PaymentsData from "@/components/dashboard/payments/payments-data";

type DashboardPaymentsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DashboardPaymentsPage({ searchParams }: DashboardPaymentsPageProps) {
  return (
    <div className="container">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
              <p className="text-white">Loading payments...</p>
            </div>
          </div>
        }
      >
        <PaymentsData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}