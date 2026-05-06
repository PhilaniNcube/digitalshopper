"use cache";

import Link from "next/link";
import { Image as ImageIcon, Code, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { NewsletterForm } from "./newsletter-form";

export async function SiteFooter() {
  return (
    <footer className="bg-background text-foreground border-t border-border/40">
      <div className="container px-4 py-16 md:px-6 lg:px-8 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-wider text-primary-strong! uppercase">
                DIGITAL SHOPPER
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Digital Shopper is your one-stop shop for everything electronic.
              We specialize in cutting-edge laptops, PC hardware, TVs, and
              essential power solutions like portable stations. Discover a
              curated selection of premium gear designed to keep you connected
              and productive in a digital world.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-background/50 border-border/50 hover:bg-muted hover:text-foreground"
              >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Gallery</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-background/50 border-border/50 hover:bg-muted hover:text-foreground"
              >
                <Code className="h-4 w-4" />
                <span className="sr-only">Code</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-background/50 border-border/50 hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </div>

          {/* Column 2: Hub Resources */}
          <div className="space-y-6 text-white!">
            <h3 className="text-sm font-medium tracking-widest  uppercase">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="space-y-6 text-white!">
            <h3 className="text-sm font-medium tracking-widest uppercase">
              Useful Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/products"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors tracking-wide uppercase"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div className="space-y-6 lg:pl-4">
            <div className="bg-card/30 border border-border/50 rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-widest text-primary-strong uppercase">
                Subscribe for Drops
              </h3>
              <p className="text-xs text-white">
                Priority access to limited retail allocations and partner
                product launches.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-border/40" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            &copy; {new Date().getFullYear()} Digital Shopper. Authorized
            Partner Hub. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
