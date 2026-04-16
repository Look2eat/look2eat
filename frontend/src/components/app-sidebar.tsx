"use client"

import * as React from "react"
import {
  AxeIcon,
  BadgeIndianRupee,
  BadgeIndianRupeeIcon,
  BanIcon,
  BookOpen,
  Bot,
  Brain,
  Calendar1,
  Command,
  Frame,
  Home,
  IndianRupee,
  LifeBuoy,
  LucideSmile,
  Map,
  MessageCircleHeart,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  UsersRound,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartLine } from "./animate-ui/icons/chart-line"
import { AnimateIcon } from "./animate-ui/icons/icon"
import { ChartColumnIncreasing } from "./animate-ui/icons/chart-column-increasing"
import { LayoutDashboard } from "./animate-ui/icons/layout-dashboard"
import { ThemeToggle } from "./theme-toggle"
import { useRouter } from 'next/navigation';

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Sidebar variant="inset"  {...props}>
      <SidebarHeader className="px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="px-0">
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Zuplin</span>
                  <span className="truncate text-xs">Enterprise Plan</span>
                </div>
              </a>
            </SidebarMenuButton>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="my-2 h-11 rounded-xl px-4 py-3">
                <button className="flex items-center gap-2 cursor-pointer bg-primary font-semibold text-white px-3 py-2 rounded-md hover:bg-purple-300 transition w-full " onClick={() => { router.push("cashier"); }}>
                  <IndianRupee className="w-4 h-4" />
                  <span>Cashier Portal</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        {/* Core Navigation */}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"} className="h-11 rounded-xl px-4 py-3">
              <Link href="/dashboard">

                <LayoutDashboard animateOnHover />
                <span className="text-[14px]">Dashboard</span>


              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/loyalty"}
              className="h-11 rounded-xl px-4 py-3"
            >
              <Link href="/dashboard/loyalty">
                <MessageCircleHeart />
                <span>Loyalty Program</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/reviews"}
              className="h-11 rounded-xl px-4 py-3"
            >
              <Link href="/dashboard/reviews">
                <LucideSmile />
                <span>Reviews</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/customer"}
              className="h-11 rounded-xl px-4 py-3"
            >
              <Link href="/dashboard/customer">
                <UsersRound />
                <span>Customer Insight</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>



          </SidebarMenuItem> */}

        </SidebarMenu>

      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
