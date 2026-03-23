import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import formatter from "@/lib/currency";
import { fetchRevenue } from "@/utils/fetchers/dashboard";
import { DollarSign } from "lucide-react";

export default async function RevenueCard() {

    const total_revenue = await fetchRevenue();


    return (

        <Card 
        className="cursor-pointer hover:shadow-md transition-shadow" 
       
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatter(total_revenue || 0)}</div>
       
        </CardContent>
      </Card>
    )
}