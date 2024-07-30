import { Toaster } from '@/components/ui/toaster';
import './globals.css'
import {Manrope} from 'next/font/google'
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from '@/schema';
import DesktopNav from './DesktopNav';
import TabletNav from './TabletNav';
import Footer from './Footer';
import CartProvider from '@/components/Providers/CartProvider';
import Script from 'next/script';
import analytics from '@/lib/utils';
import { Metadata } from 'next';
import { ClerkProvider } from "@clerk/nextjs";

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: '--font-manrope'
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
  viewport: "width=device-width, initial-scale=1.0",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

     const cookieStore = cookies();

     const supabase = createServerClient<Database>(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return cookieStore.get(name)?.value;
           },
         },
       }
     );

   const {data: {session}} = await supabase.auth.getSession();

   const { data: categories, error } = await supabase
     .from("categories")
     .select("*")
     .order("title", { ascending: false })
     .neq("id", "1ee42d6c-11a4-41a1-af96-1479a544382f");
    //  .neq("id", "41e92af3-10d1-4ae4-9214-9ba17acab833")

   const { data: is_admin } = await supabase.rpc("is_admin").single();

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
                session={session}
                categories={categories!}
                is_admin={is_admin!}
              />
              {/** Desktop Navigation Ends**/}
              {/** Tablet Navigation Starts**/}
              <TabletNav session={session} categories={categories!} />
            </nav>
            {children}
            <Toaster />
            <Footer categories={categories!} />
          </CartProvider>
        </body>
      </html>

  );
}
