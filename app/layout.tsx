import { Inter, Space_Grotesk, Geist } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Digital Shopper | Tech & Electronics Online in South Africa",
    template: "%s | Digital Shopper",
  },
  description:
    "Shop the latest tech, electronics, and computer hardware online. Trusted brands, fast delivery, and expert support across South Africa.",
  metadataBase: new URL("https://digitalshopper.co.za"),
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Digital Shopper",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GTM_ID = "GTM-W63KNR93";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        spaceGrotesk.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body>
        <NuqsAdapter>
          {children}
          <Toaster richColors theme="dark" position="top-right" />
        </NuqsAdapter>
        {/* Defer GTM until browser idle time to avoid blocking LCP/FCP on slow networks */}
        <Script
          id="gtm-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </body>
    </html>
  );
}
