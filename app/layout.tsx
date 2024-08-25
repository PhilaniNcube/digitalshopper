import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Manrope } from "next/font/google";
import DesktopNav from "./DesktopNav";
import TabletNav from "./TabletNav";
import Footer from "./Footer";
import CartProvider from "@/components/Providers/CartProvider";
import Script from "next/script";
import analytics from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { createClient } from "@/utils/supabase/server";
import { fetchCategoriesFromDatabase } from "@/utils/fetchers/categories";
import { getAdmin, getSession } from "@/utils/fetchers/auth";

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


  const categories = await fetchCategoriesFromDatabase();
	const isAdmin = await getAdmin();
  console.log({isAdmin});

  const session = await getSession();


	await analytics.page();

	return (
		<html lang="en">
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-VH1WN9HDWH"
				strategy="afterInteractive"
			/>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-VH1WN9HDWH');
        `}
			</Script>

			<body className={manrope.className}>
				<noscript>
					{/* biome-ignore lint/a11y/useIframeTitle: <explanation> */}
					{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-W63KNR93"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
					></iframe>
				</noscript>
				<CartProvider>
					<nav className="text-white bg-black">
						{/** Desktop Navigation **/}
						<DesktopNav



						/>
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
