import { Suspense } from "react";
import ShippingData from "@/components/dashboard/shipping/shipping-data";

type DashboardShippingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function DashboardShippingPage({ searchParams }: DashboardShippingPageProps) {
  return (
    <div className="container">
      <Suspense
        fallback={
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Shipping</h1>
              <p className="text-white">Loading shipping data...</p>
            </div>
          </div>
        }
      >
        <ShippingData searchParams={searchParams} />
      </Suspense>
    </div>
  );
}