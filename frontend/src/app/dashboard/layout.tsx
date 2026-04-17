import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AuthGuard from "@/components/dashboard/AuthGuard";


export default function DashboardLayout({
  children,
}: {
  children: ReactNode;

}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <DashboardHeader />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
