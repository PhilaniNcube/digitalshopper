

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { BarChart3, BoxesIcon, DollarSign, ShoppingCart, Users } from "lucide-react";


import RevenueCard from "./_components/revenue-card";
import ProductsCard from "./_components/products-card";

// Mock data for the dashboard
// In a real application, you would fetch this data from your API


const DashboardPage = () => {
  




  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RevenueCard />

       <ProductsCard />

       

      </div>

      <div className="grid gap-4 md:grid-cols-2">
       

      
      </div>
    </div>
  );
};

export default DashboardPage;
