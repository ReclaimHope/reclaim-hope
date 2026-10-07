"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain, NavSection } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersRound,
  HandCoins,
  CreditCard,
  Mail,
  ClipboardList,
  FlaskConical,
  LogOut,
  Globe,
  Loader2,
} from "lucide-react"
import { FaChild } from "react-icons/fa6"
import { GoSponsorTiers } from "react-icons/go"
import { Button } from "./ui/button"
import Image from "next/image"
import { logoutAction } from "@/app/actions/auth"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLoggingOut, startLogout] = React.useTransition()
  const { data: attention } = useSWR<{
    pendingSponsorships: number
    pendingDonations: number
    unsponsoredChildren: number
  }>("/api/admin/attention", fetcher, { revalidateOnFocus: false })

  const sections: NavSection[] = [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/admin", icon: <LayoutDashboardIcon /> },
      ],
    },
    {
      label: "Fundraising",
      items: [
        { title: "Sponsors", url: "/admin/sponsors", icon: <GoSponsorTiers />, badge: attention?.pendingSponsorships },
        { title: "Donors", url: "/admin/donors", icon: <UsersRound /> },
        { title: "Donations", url: "/admin/donations", icon: <HandCoins />, badge: attention?.pendingDonations },
        { title: "Payments", url: "/admin/payments", icon: <CreditCard /> },
      ],
    },
    {
      label: "Content",
      items: [
        { title: "Children", url: "/admin/children", icon: <FaChild />, badge: attention?.unsponsoredChildren },
        { title: "Newsletters", url: "/admin/newsletters", icon: <Mail /> },
        { title: "Reports", url: "/admin/reports", icon: <ClipboardList /> },
      ],
    },
    
  ]

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction()
    })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Brand: logo + name link back to the public homepage */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Back to Reclaim Hope homepage"
              className="h-auto py-2"
            >
              <Link href="/" className="flex items-center gap-3">
                <Image
                  alt="Reclaim Hope logo"
                  src="/logo.png"
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-full bg-white object-contain ring-1 ring-sidebar-border"
                  priority
                />
                <span className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-bold">
                    Reclaim Hope
                  </span>
                  <span className="text-[11px] font-medium text-sidebar-foreground/60">
                    Rwanda &middot; Admin Console
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain sections={sections} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View public website">
              <Link href="/" target="_blank" rel="noreferrer">
                <Globe />
                <span>View Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="my-1" />
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Logout"
          className="w-full justify-start gap-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="size-4 shrink-0 animate-spin" />
              <span className="group-data-[collapsible=icon]:hidden">Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </>
          )}
        </Button>
        <p className="px-2 pt-1 text-[10px] text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden">
          Tip: press <kbd className="rounded border border-sidebar-border px-1 font-mono">Ctrl</kbd>+
          <kbd className="rounded border border-sidebar-border px-1 font-mono">B</kbd> to collapse
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
