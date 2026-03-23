import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const supportPoints = [
  {
    label: "Official warranty support",
    icon: ShieldCheck,
  },
  {
    label: "Expert technical advice",
    icon: Headphones,
  },
  {
    label: "Global authorized shipping",
    icon: Globe2,
  },
];

const spotlightStats = [
  {
    value: "120+",
    label: "authorized brands",
  },
  {
    value: "48h",
    label: "dispatch on stocked lines",
  },
  {
    value: "24/7",
    label: "after-sales response window",
  },
];

export function Hero() {
  return (
    <section className="border-b border-white/5 bg-[#08111b]">
      <div className="border-b border-cyan-400/10 bg-[#071019]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-cyan-300/85 lg:px-10">
          {supportPoints.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 whitespace-nowrap text-primary-strong"
            >
              <Icon className="size-3.5 text-primary-strong" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="py-10 mx-auto max-w-7xl lg:py-14">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block" />
          <div className="absolute inset-0 " />
          <div className="grid items-center gap-12 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:py-16">
            <div className="relative z-10 max-w-2xl">
              

              <h1 className="mt-8 max-w-[10ch] font-display text-5xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                  <span className="block">South</span>
                  <span className="block text-primary-strong">Africa&apos;s</span>
                  <span className="block">Tech Picks</span>
              </h1>

              <p className="max-w-xl mt-8 text-base leading-8 text-slate-300 sm:text-lg">
                  Shop top tech and everyday essentials with pricing, delivery,
                  and support built for South African customers. Discover trusted
                  brands in one place, from the latest devices to must-have home
                  upgrades.
              </p>

              <div className="flex flex-col gap-4 mt-10 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-none bg-primary-strong! px-6 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-primary-foreground!"
                >
                  <Link href="/products">
                    Explore catalog
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="lg"
                  className="h-12 rounded-none border bg-white/8 px-6 text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-white! hover:text-white! hover:bg-primary-strong!"
                >
                  <Link href="/products?sort=brand-asc" className="">
                  Brands
                  <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 pt-6 mt-10 border-t border-white/8 sm:grid-cols-3">
                {spotlightStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="px-4 py-4 border rounded-2xl border-white/6 bg-white/3 backdrop-blur-sm"
                  >
                    <div className="text-2xl font-semibold tracking-[-0.04em] text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div className="relative mx-auto aspect-[1.02/0.92] w-full max-w-lg overflow-hidden rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_35%_28%,rgba(220,232,232,0.2),transparent_0_22%),radial-gradient(circle_at_65%_24%,rgba(2,12,18,0.32),transparent_0_52%),linear-gradient(180deg,#0a1518_0%,#071015_68%,#05090d_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_30px_70px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(19,12,7,0.1)_24%,rgba(62,41,24,0.55)_100%)]" />
                <div className="absolute inset-x-[9%] bottom-[16%] h-0.5 bg-[linear-gradient(90deg,transparent,rgba(255,231,204,0.45),transparent)] blur-[1px]" />
                <div className="absolute inset-x-[8%] bottom-[8%] h-[18%] rounded-t-[40%] bg-[linear-gradient(180deg,rgba(110,76,48,0.05),rgba(110,76,48,0.16))]" />
                <Image
                  src="/images/banner.webp"
                  alt="Featured wearable technology selection"
                  width={2048}
                  height={1152}
                  priority
                  className="absolute inset-x-[6%] bottom-0 w-[88%] translate-y-[5%] drop-shadow-[0_18px_28px_rgba(0,0,0,0.6)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
