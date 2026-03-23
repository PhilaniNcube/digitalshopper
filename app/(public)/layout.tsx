
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PublicLayoutProps = {
	children: React.ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
	return (
		<div className="min-h-screen">
			<SiteHeader />
			<main>{children}</main>
			<SiteFooter />
		</div>
	);
}