import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AdminGuard } from "@/components/dashboard/admin-guard";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <TooltipProvider>
		<Suspense fallback={null}>
          <AdminGuard />
		</Suspense>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex h-14 items-center gap-3 border-b border-surface-elevated px-6">
            <SidebarTrigger className="-ml-2 text-white" />
          
           
          </header>
          <main className="flex-1 px-6 ">{children}</main>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}
