import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Manrope } from "next/font/google";
import DesktopNav from "./DesktopNav";
import TabletNav from "./TabletNav";
import Footer from "./Footer";
import CartProvider from "@/components/Providers/CartProvider";
import type { Metadata, Viewport } from "next";
import { fetchCategoriesFromDatabase } from "@/utils/fetchers/categories";
import { getAdmin, getSession } from "@/utils/fetchers/auth";
import { GoogleTagManager } from "@next/third-parties/google";
import { sendGTMEvent } from "@next/third-parties/google";

type Category = {
	created_at: string;
	id: string;
	image_url: string;
	slug: string;
	title: string;
};

const manrope = Manrope({
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	subsets: ["latin"],
	variable: "--font-manrope",
});

export const metadata: Metadata = {
	title: "Digital Shopper",
	description:
		"Digital Shopper for a personalised online shopping experience. Shop for your favourite products and get them delivered to your doorstep. As a small team we give each of our customers the best experience possible.",
	openGraph: {
		type: "website",
		url: "https://www.digitalshopper.co.za",
		title: "Digital Shopper",
		description:
			"Digital Shopper for a personalised online shopping experience. Shop for your favourite products and get them delivered to your doorstep. As a small team we give each of our customers the best experience possible.",
	},
	alternates: {
		canonical: "https://www.digitalshopper.co.za",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	viewportFit: "cover",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {


	const isAdmin = await getAdmin();



	return (
		<html lang="en">
			<GoogleTagManager gtmId="GTM-W63KNR93" />
			<body className={manrope.className}>

				<CartProvider>
					<nav className="text-white bg-black">
						{/** Desktop Navigation **/}
						<DesktopNav />
						{/** Desktop Navigation Ends**/}
						{/** Tablet Navigation Starts**/}
						<TabletNav />
					</nav>
					{children}
					<Toaster />
					<Footer />
				</CartProvider>
			</body>
		</html>
	);
}
