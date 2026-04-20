import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

function NavGroupSkeleton({ label, count }: { label: string; count: number }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {Array.from({ length: count }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items have no meaningful key
            <SidebarMenuItem key={i}>
              <div className="flex items-center gap-3 px-2 py-1.5">
                <Skeleton className="size-4 shrink-0 rounded" />
                <Skeleton className="h-4 w-24 group-data-[collapsible=icon]:hidden" />
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function DashboardSidebarSkeleton() {
  return (
    <Sidebar collapsible="icon" className="border-r border-surface-elevated">
      <SidebarHeader className="border-b border-surface-elevated px-4 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-4 w-28 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavGroupSkeleton label="Main" count={5} />
        <NavGroupSkeleton label="Catalog" count={2} />
        <NavGroupSkeleton label="Operations" count={4} />
        <NavGroupSkeleton label="System" count={2} />
      </SidebarContent>

      <SidebarFooter className="border-t border-surface-elevated px-4 py-3">
        <Skeleton className="h-3 w-20 group-data-[collapsible=icon]:hidden" />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
