"use client";

import { Button } from "@boilerplate/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@boilerplate/ui/components/sidebar";
import { PlusIcon, SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { getNavGroups, footerNavLinks } from "@/components/app-shared";
import { LatestChange } from "@/components/latest-change";
import { LogoIcon } from "@/components/logo";
import { NavGroup } from "@/components/nav-group";

export function AppSidebar({ isPlatformAdmin }: { isPlatformAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const navGroups = getNavGroups(pathname, isPlatformAdmin);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton render={<a href="/dashboard" />}>
          <LogoIcon />
          <span className="font-medium">SaaS</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              tooltip="Quick Create"
              onClick={() => router.push("/projects")}
            >
              <PlusIcon />
              <span>New Conversation</span>
            </SidebarMenuButton>
            <Button
              aria-label="Search conversations"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              size="icon"
              variant="outline"
              onClick={() => router.push("/files")}
            >
              <SearchIcon />
              <span className="sr-only">Search conversations</span>
            </Button>
          </SidebarMenuItem>
        </SidebarGroup>
        {navGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <LatestChange />
        <SidebarMenu className="mt-2">
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="text-muted-foreground"
                isActive={item.isActive}
                size="sm"
                render={<a href={item.path} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
