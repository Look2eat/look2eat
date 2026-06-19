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
      <SidebarProvider >
        <AppSidebar />
        <SidebarInset className="bg-background flex-1 min-w-0">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
