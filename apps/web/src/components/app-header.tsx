"use client";

import { Button } from "@boilerplate/ui/components/button";
import { Separator } from "@boilerplate/ui/components/separator";
import { cn } from "@boilerplate/ui/lib/utils";
import { BellIcon, SendIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { getNavLinks } from "@/components/app-shared";
import type { AppShellUser } from "@/components/app-shell";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { NavUser } from "@/components/nav-user";

export function AppHeader({ user }: { user: AppShellUser }) {
  const pathname = usePathname();
  const navLinks = getNavLinks(pathname);
  const activeItem = navLinks.find((item) => item.isActive) ?? navLinks[0];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6",
      )}
    >
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <Button aria-label="Send feedback" size="icon-sm" variant="outline">
          <SendIcon />
        </Button>
        <Button aria-label="Notifications" size="icon-sm" variant="outline">
          <BellIcon />
        </Button>
        <Separator className="h-4 data-[orientation=vertical]:self-center" orientation="vertical" />
        <NavUser user={user} />
      </div>
    </header>
  );
}
