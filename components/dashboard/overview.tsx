import { CategoryCountCard } from "@/components/dashboard/category-count-card";
import { OrderCountCard } from "@/components/dashboard/order-count-card";
import { PaidRevenueCard } from "@/components/dashboard/paid-revenue-card";
import { PendingOrdersCard } from "@/components/dashboard/pending-orders-card";
import { ProductCountCard } from "@/components/dashboard/product-count-card";
import { UserCountCard } from "@/components/dashboard/user-count-card";

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-white">Dashboard</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-white">
          Operations overview
        </h1>
        <p className="max-w-2xl text-sm text-white">
          A live snapshot of the catalog, customer base, order pipeline, and confirmed revenue.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <ProductCountCard />
        <CategoryCountCard />
        <UserCountCard />
        <OrderCountCard />
        <PendingOrdersCard />
        <PaidRevenueCard />
      </div>
    </div>
  );
}