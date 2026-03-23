"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  FolderTree,
  Settings,
  BarChart3,
  Truck,
  CreditCard,
  Mail,
  Shield,
  Store,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainNav = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { title: "Customers", href: "/dashboard/customers", icon: Users },
];

const catalogNav = [
  { title: "Brands", href: "/dashboard/brands", icon: Tags },
  { title: "Inventory", href: "/dashboard/inventory", icon: Store },
];

const operationsNav = [
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Shipping", href: "/dashboard/shipping", icon: Truck },
  { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { title: "Emails", href: "/dashboard/emails", icon: Mail },
];

const systemNav = [
  { title: "Users & Roles", href: "/dashboard/users", icon: Shield },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-surface-elevated">
      <SidebarHeader className="border-b border-surface-elevated px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Store className="size-5 text-primary-strong" />
          <span className="font-display text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Digital Shopper
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Main" items={mainNav} pathname={pathname} />
        <NavGroup label="Catalog" items={catalogNav} pathname={pathname} />
        <NavGroup label="Operations" items={operationsNav} pathname={pathname} />
        <NavGroup label="System" items={systemNav} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-surface-elevated px-4 py-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground group-data-[collapsible=icon]:hidden">
          Admin Panel
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
