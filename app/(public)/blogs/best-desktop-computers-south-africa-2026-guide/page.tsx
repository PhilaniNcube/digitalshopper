import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogFeaturedProducts } from "@/components/blogs/blog-featured-products";
import { ShoppingCart } from "lucide-react";
import { fetchProductsByIds } from "@/dal/queries/products";
import { formatCurrency, getDisplayPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Best Desktop Computers for Home, Office, and Gaming in South Africa (2026 Guide) | Digital Shopper Blog",
  description:
    "Finding the right desktop computer in South Africa can be overwhelming. In this guide, we break down the best desktop computers available right now based on exactly what you need them to do.",
  keywords: [
    "desktop computers",
    "best desktop computers South Africa",
    "home office mini PC",
    "budget mini PC",
    "business desktop PC",
    "entry-level gaming PC South Africa",
    "pre-built gaming PC",
    "budget desktop PC",
    "office computer"
  ],
  authors: [{ name: "Admin" }],
  alternates: {
    canonical: "https://www.digitalshopper.co.za/blogs/best-desktop-computers-south-africa-2026-guide",
  },
  openGraph: {
    title: "Best Desktop Computers for Home, Office, and Gaming in South Africa (2026 Guide)",
    description:
      "Finding the right desktop computer in South Africa can be overwhelming. In this guide, we break down the best desktop computers available right now based on exactly what you need them to do.",
    images: ["/images/desktop-computers-guide-hero.png"],
    type: "article",
  },
};

export default async function DesktopComputersGuidePage() {
  const featuredProductIds = [
    "1b6f34df-31db-448f-980e-fa5b419d18b7", // PCBuilder CUBE Intel i3-1315U Mini PC
    "173bbb24-470c-4e71-9e51-cc1332a37028", // PCBuilder Intel i5-14400 OFFICE Master Desktop PC
    "647c6e4c-f7b9-422c-a436-bd59b2d25c92", // PCBuilder Ryzen 5 5600XT SENTINEL Gaming PC
  ];

  const dbProducts = await fetchProductsByIds(featuredProductIds);
  const miniPc = dbProducts.find(p => p.id === "1b6f34df-31db-448f-980e-fa5b419d18b7");
  const officePc = dbProducts.find(p => p.id === "173bbb24-470c-4e71-9e51-cc1332a37028");
  const gamingPc = dbProducts.find(p => p.id === "647c6e4c-f7b9-422c-a436-bd59b2d25c92");

  const miniPcPriceFormatted = miniPc ? formatCurrency(getDisplayPrice(miniPc)) : "R11,499.00";
  const officePcPriceFormatted = officePc ? formatCurrency(getDisplayPrice(officePc)) : "R15,999.00";
  const gamingPcPriceFormatted = gamingPc ? formatCurrency(getDisplayPrice(gamingPc)) : "R17,999.00";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 lg:px-8 font-sans">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the difference between an HDD and an SSD in a desktop computer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Hard Disk Drive (HDD) is older technology that uses spinning magnetic platters to store data; it is cheap but very slow. A Solid State Drive (SSD) uses flash memory, making it up to 10 times faster. An SSD ensures your computer boots up instantly and applications load without lag."
                }
              },
              {
                "@type": "Question",
                "name": "Can I upgrade a pre-built desktop computer later?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, traditional tower desktops are highly upgradeable. You can easily add more RAM, install a larger SSD for storage, or upgrade the graphics card. Mini PCs are generally limited to RAM and storage upgrades only."
                }
              }
            ]
          })
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-white transition-colors">
          Blog
        </Link>
        <span>/</span>
      </nav>

      {/* Hero Image */}
      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
        <Image
          src="/images/desktop-computers-guide-hero.png"
          alt="Best Desktop Computers Guide 2026"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight font-display mb-4">
          Best Desktop Computers for Home, Office, and Gaming in South Africa (2026 Guide)
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <time dateTime="2026-07-11T16:00:00.000Z">July 11, 2026</time>
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span>By Admin</span>
        </div>
      </header>

      {/* Intro */}
      <div className="prose prose-invert text-neutral-200 max-w-none space-y-6 leading-relaxed mb-12">
        <p className="text-lg text-neutral-300">
          Finding the right desktop computer in South Africa can be overwhelming. If you browse a massive marketplace, you are often hit with hundreds of confusing specs, outdated processors, and generic descriptions that don&apos;t tell you if a PC will actually run your accounting software or your favorite games smoothly.
        </p>
        <p>
          Whether you are setting up a remote work home office, outfitting a small business, or looking for your first 1080p gaming rig, you don&apos;t need to overspend. In this guide, we break down the best desktop computers available right now based on exactly what you need them to do.
        </p>
      </div>

      {/* Products list */}
      <div className="space-y-12">
        {/* Product 1 */}
        <section className="p-6 md:p-8 rounded-3xl bg-surface-low/40 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl">
          <div className="md:grid md:grid-cols-2 md:gap-8 items-start">
            {/* Image Col */}
            <div className="mb-6 md:mb-0 flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-inner">
                <Image
                  src="https://www.syntech.co.za/wp-content/uploads/2025/06/PCB_CUBE_I316G_OFFICE_PCBuilder-CUBE-i3-1315U-16GB-DDR4-512GB-Windows-11-Pro-Mini-PC_wr_01a.jpg"
                  alt="PCBuilder CUBE Intel i3-1315U Mini PC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <Link
                href="/products/pcbuilder-cube-intel-i3-1315u-16gb-ddr4-512gb-windows-11-pro-mini-pc-pcb-cube-i316g-office"
                className="mt-4 w-full max-w-xs inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-primary hover:text-black hover:border-transparent transition-all duration-300 shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                View on Digital Shopper
              </Link>
            </div>

            {/* Description Col */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight font-display">
                1. Best for the Home Office & Students: The Affordable Mini PC
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {miniPcPriceFormatted}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                  Model: PCBuilder CUBE Intel i3
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                If your daily tasks involve web browsing, Microsoft Office, watching YouTube, and Zoom calls, you do not need a massive, noisy desktop tower. The <strong>PCBuilder CUBE Intel i3 Mini PC</strong> packs a punch without taking up space.
              </p>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">Recommended Specs vs. Built Specs</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-3">
                  While standard home office guidelines recommend an Intel Core i3 with 8GB RAM and 256GB SSD, this premium mini PC doubles down with <strong>16GB DDR4 RAM</strong> and a massive <strong>512GB SSD</strong>, pre-installed with Windows 11 Pro for professional environments.
                </p>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">Why Mini PCs are winning in 2026</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The trend for home offices is shifting rapidly toward Mini PCs. These ultra-compact units mount directly to the back of your monitor (via a VESA mount), freeing up valuable desk space. Despite their size, modern Mini PCs pack full-sized solid-state drives (SSDs) ensuring Windows 11 boots up in seconds. They draw significantly less power than a traditional tower, which is a massive bonus during loadshedding if you are running your setup off an inverter or portable power station.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product 2 */}
        <section className="p-6 md:p-8 rounded-3xl bg-surface-low/40 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl">
          <div className="md:grid md:grid-cols-2 md:gap-8 items-start">
            {/* Image Col */}
            <div className="mb-6 md:mb-0 flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-inner">
                <Image
                  src="https://www.syntech.co.za/wp-content/uploads/2025/11/PCB_OFFICE_I516G_CSM_PCBuilder-Intel-i5-14400-OFFICE-Master-Windows-11-Desktop-PC_wr_01b.jpg"
                  alt="PCBuilder Intel i5-14400 OFFICE Master Desktop PC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <Link
                href="/products/pcbuilder-intel-i5-14400-office-master-windows-11-desktop-pc-pcb-office-i516g-csm"
                className="mt-4 w-full max-w-xs inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-primary hover:text-black hover:border-transparent transition-all duration-300 shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                View on Digital Shopper
              </Link>
            </div>

            {/* Description Col */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight font-display">
                2. Best for Small Businesses & Multitasking: The Professional Tower
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {officePcPriceFormatted}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                  Model: PCBuilder Intel i5 OFFICE Master
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                When you are running multiple spreadsheets, accounting software (like Sage or Xero), and heavy web applications simultaneously, an entry-level processor will start to freeze. The <strong>PCBuilder Intel i5 OFFICE Master Desktop PC</strong> is engineered to eliminate bottlenecks.
              </p>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">Powerhouse Business Specs</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-3">
                  Equipped with a 14th Gen Intel Core i5 processor, 16GB of DDR4 memory, and a fast solid-state drive, this configuration ensures lightning-fast load times and flawless multitasking.
                </p>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">Why this tier matters</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  For small businesses, reliability and multitasking speed are money. Upgrading to a mid-tier processor (like an Intel i5) paired with 16GB of RAM is the sweet spot. 16GB of RAM ensures that having 20 browser tabs open while running heavy local software won&apos;t crash your system. We highly recommend traditional form-factor towers for businesses because they are incredibly easy to upgrade or repair down the line, extending the lifespan of your investment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product 3 */}
        <section className="p-6 md:p-8 rounded-3xl bg-surface-low/40 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl">
          <div className="md:grid md:grid-cols-2 md:gap-8 items-start">
            {/* Image Col */}
            <div className="mb-6 md:mb-0 flex flex-col items-center">
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-inner">
                <Image
                  src="https://www.syntech.co.za/wp-content/uploads/2024/08/PCB_SENTINEL_01_wr_01e.jpg"
                  alt="PCBuilder Ryzen 5 5600XT SENTINEL Gaming PC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
              <Link
                href="/products/pcbuilder-ryzen-5-5600xt-sentinel-windows-11-gaming-pc-pcb-sentinel-01"
                className="mt-4 w-full max-w-xs inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-primary hover:text-black hover:border-transparent transition-all duration-300 shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                View on Digital Shopper
              </Link>
            </div>

            {/* Description Col */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white leading-tight font-display">
                3. Best Entry-Level Gaming & Content Creation: The 1080p Sweet Spot
              </h2>
              
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {gamingPcPriceFormatted}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                  Model: PCBuilder Ryzen 5 SENTINEL
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                Buying a gaming PC doesn&apos;t mean you have to spend R40,000. If you are looking to play popular titles like Fortnite, Apex Legends, or Valorant at smooth frame rates on a standard 1080p monitor, you need a balanced entry-level pre-built like the <strong>PCBuilder Ryzen 5 SENTINEL Gaming PC</strong>.
              </p>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">Balanced Gaming Specifications</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-3">
                  This build features a powerful AMD Ryzen 5 CPU, 16GB of high-speed RAM, and a dedicated GPU configuration capable of high framerate 1080p gaming and quick export times in popular video editing suites.
                </p>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">What to look for</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  The biggest mistake first-time buyers make on big marketplaces is buying a &quot;Gaming PC&quot; that doesn&apos;t actually have a dedicated graphics card (GPU). Our entry-level gaming rigs feature dedicated GPUs (like the NVIDIA RTX series or AMD Radeon RX series), which not only push high frame rates in games but drastically reduce render times if you are editing videos for YouTube or TikTok using Adobe Premiere.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Summary Table */}
      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="text-2xl font-bold text-white mb-6 font-display">
          Summary: Which Desktop PC Should You Choose?
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface-low/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-sm font-semibold text-white">
                <th className="p-4">Model</th>
                <th className="p-4">Price</th>
                <th className="p-4">Key Specs</th>
                <th className="p-4">Best Used For</th>
              </tr>
            </thead>
            <tbody className="text-sm text-neutral-300 divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-white">PCBuilder CUBE Mini PC</td>
                <td className="p-4 text-emerald-400 font-medium">{miniPcPriceFormatted}</td>
                <td className="p-4">Intel i3-1315U | 16GB RAM | 512GB SSD</td>
                <td className="p-4">Home office, students, loadshedding backup setups</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-white">PCBuilder OFFICE Master</td>
                <td className="p-4 text-emerald-400 font-medium">{officePcPriceFormatted}</td>
                <td className="p-4">Intel i5-14400 | 16GB RAM | 512GB SSD</td>
                <td className="p-4">Office workstations, multitasking, business software</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-white">PCBuilder SENTINEL Gaming PC</td>
                <td className="p-4 text-emerald-400 font-medium">{gamingPcPriceFormatted}</td>
                <td className="p-4">Ryzen 5 5600XT | 16GB RAM | 1TB SSD | Dedicated GPU</td>
                <td className="p-4">1080p gaming, content creation, video editing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQs */}
      <section className="mt-16 border-t border-white/10 pt-10">
        <h2 className="text-2xl font-bold text-white mb-6 font-display">
          Frequently Asked Questions (FAQ)
        </h2>
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-surface-low/30 border border-white/5 space-y-2">
            <h4 className="text-md font-semibold text-white flex items-start gap-2.5 font-display">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-strong">Q</span>
              What is the difference between an HDD and an SSD in a desktop computer?
            </h4>
            <p className="text-sm text-neutral-300 pl-8.5 leading-relaxed font-sans">
              A Hard Disk Drive (HDD) is older technology that uses spinning magnetic platters to store data; it is cheap but very slow. A Solid State Drive (SSD) uses flash memory, making it up to 10 times faster. An SSD ensures your computer boots up instantly and applications load without lag. We only recommend desktops with an SSD as the primary drive.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-low/30 border border-white/5 space-y-2">
            <h4 className="text-md font-semibold text-white flex items-start gap-2.5 font-display">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-strong">Q</span>
              Can I upgrade a pre-built desktop computer later?
            </h4>
            <p className="text-sm text-neutral-300 pl-8.5 leading-relaxed font-sans">
              Yes, traditional tower desktops (like business towers and gaming PCs) are highly upgradeable. You can easily add more RAM, install a larger SSD for storage, or upgrade the graphics card in the future as your needs grow. Mini PCs are generally limited to RAM and storage upgrades.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Mentioned Section */}
      <BlogFeaturedProducts productIds={featuredProductIds} />

      {/* Back link */}
      <div className="mt-12 border-t border-white/8 pt-8">
        <Link
          href="/blogs"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
