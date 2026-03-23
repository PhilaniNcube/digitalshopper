import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DashboardRouteStubProps = {
  title: string;
  description: string;
};

export function DashboardRouteStub({
  title,
  description,
}: DashboardRouteStubProps) {
  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>{title} dashboard</CardTitle>
            <CardDescription>
              This section is wired into the dashboard navigation and ready for implementation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add the data queries, actions, and table or form components for this admin area when the feature scope is ready.
            </p>
            <div>
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to overview</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}