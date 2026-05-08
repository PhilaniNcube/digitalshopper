import Link from "next/link";
import NavCategories, { NavMobileCategories } from "./navigation/nav-categories";
import { Suspense } from "react";
import NavSearchInput from "./navigation/nav-search-input";
import AuthButtons from "./navigation/auth-buttons";

function NavCategoriesFallback() {
  return (
    <div className="items-center hidden min-w-0 gap-3 lg:flex">
      <div className="w-24 border rounded-full h-11 animate-pulse border-cyan-400/15 bg-cyan-400/10" />
      <div className="flex items-center gap-2">
        <div className="w-24 h-11 animate-pulse rounded-xl bg-white/6" />
        <div className="h-11 w-28 animate-pulse rounded-xl bg-white/6" />
        <div className="w-20 h-11 animate-pulse rounded-xl bg-white/6" />
        <div className="h-11 w-18 animate-pulse rounded-xl bg-white/6" />
      </div>
    </div>
  );
}

function NavSearchInputFallback() {
  return (
    <div className="ml-3 hidden h-11 w-65 animate-pulse rounded-[1.1rem] border border-white/10 bg-white/4 xl:ml-4 xl:w-72.5 lg:flex" />
  );
}

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
      <div className="flex items-center justify-between w-full gap-3 px-4 py-4 mx-auto max-w-7xl sm:gap-6 sm:px-6 lg:px-10">
        <div className="flex items-center min-w-0 gap-3 lg:gap-10">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight shrink-0 font-display text-primary-strong!"
          >
            Digital Shopper
          </Link>
          <nav className="flex items-center min-w-0">
            <Suspense fallback={<NavCategoriesFallback />}>
              <NavCategories />
            </Suspense>
            <Suspense fallback={<NavSearchInputFallback />}>
              <NavSearchInput />
            </Suspense>
          </nav>
        </div>
        {/* Right: auth + cart + hamburger — hamburger is always last/rightmost on mobile */}
        <div className="shrink-0 flex items-center gap-2">
          <Suspense fallback={<div className="w-9 h-9 animate-pulse rounded-full bg-white/6" />}>
            <AuthButtons />
          </Suspense>
          <Suspense fallback={<div className="size-9 animate-pulse rounded-full bg-white/6 lg:hidden" />}>
            <NavMobileCategories />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
