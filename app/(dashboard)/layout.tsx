import { requireAdmin } from "@/lib/session";

type DashboardLayoutProps = {
	children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
	

	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 lg:px-10 lg:py-16">
			<div className="space-y-3">
				<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Admin surface</p>
				<h1 className="font-display text-5xl font-semibold tracking-[-0.04em] text-white">
					Welcome back
				</h1>
				<p className="max-w-3xl text-base leading-7 text-muted-foreground">
					This is the protected operational area for Digital Shopper administrators.
				</p>
			</div>
			{children}
		</section>
	);
}