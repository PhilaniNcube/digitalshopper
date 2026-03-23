import { Inter, Space_Grotesk, Geist } from "next/font/google";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
	title: "Digital Shopper",
	description:
		"A fresh Digital Shopper rebuild on Next.js 16.2.1 with Better Auth, Neon, Zustand, nuqs, and Payfast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={cn(inter.variable, spaceGrotesk.variable, "font-sans", geist.variable)}>
			<body>
				<NuqsAdapter>
					{children}
					<Toaster richColors theme="dark" position="top-right" />
				</NuqsAdapter>
			</body>
		</html>
	);
}