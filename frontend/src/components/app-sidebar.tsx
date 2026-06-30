"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Cog, Heart, Megaphone, Wallet } from "lucide-react"
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image";
import WelcomeCard from "./dashboard/WelcomeCard";
import Cashier02Icon from '@iconify-react/hugeicons/cashier-02';
import SparkleIcon from '@iconify-react/fluent-emoji-high-contrast/sparkle';
import CoinsIcon from '@iconify-react/majesticons/coins';
import SelectOutletCard from "./dashboard/SelectOutletCard";
import { useOutlet } from "@/lib/auth/OutletContext";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { outlets } = useOutlet();


  const sidebarItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: SparkleIcon,
      disabled: false,
    },
    {
      label: "Loyalty",
      href: "/dashboard/loyalty",
      icon: CoinsIcon,
      disabled: false,
    },
    {
      label: "Feedback",
      href: "/dashboard/feedback",
      icon: Heart,
      disabled: false,
    },
    {
      label: "Marketing",
      href: "/dashboard/marketing",
      icon: Megaphone,
      disabled: false,
    },
    {
      label: "Cashier Panel",
      href: "/dashboard/cashier-panel",
      activePath: "/dashboard/cashier-panel",
      icon: Cashier02Icon,
      disabled: false,
    },
    {
      label: "Account Settings",
      href: "/dashboard/settings",
      icon: Cog,
      disabled: false,
    },
  ];

  return (
    <Sidebar variant="inset" {...props} className="py-7 pb-5">
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <a href="#">
              <div className="flex items-start justify-start px-2">
                <Image
                  src="/logo.svg"
                  alt="Zuplin"
                  width={120}
                  height={32}
                  className="block dark:hidden"
                />
                <Image
                  src="/logo_dark.svg"
                  alt="Zuplin"
                  width={120}
                  height={32}
                  className="hidden dark:block"
                />
              </div>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <WelcomeCard />

      <SidebarContent>
        <div className="px-4 py-4 bg-background rounded-4xl mt-6 ml-2 w-66 text-[#48494C] dark:text-white">
          <SidebarMenu className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === (item.activePath ?? item.href)}
                    className="h-10 rounded-[28px] px-3 text-base font-poppins"
                    disabled={item.disabled}
                    asChild={!item.disabled}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
                        <Icon style={{ width: "22px", height: "22px" }} />
                        <span>{item.label}</span>
                      </div>
                    ) : (
                      <Link href={item.href} className="flex items-center gap-2">
                        <Icon style={{ width: "22px", height: "22px" }} />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="gap-2 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {outlets.length > 0 && (
              <SelectOutletCard />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}