import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dashboardItems = [
	"Catalog management",
	"Order monitoring",
	"Role-based operational surfaces",
	"Email and payment event workflows",
];

export default function DashboardPage() {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{dashboardItems.map((item) => (
				<Card key={item} className="bg-surface-low">
					<CardHeader>
						<CardTitle>{item}</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						Scaffolded and ready for the next implementation slice.
					</CardContent>
				</Card>
			))}
		</div>
	);
}