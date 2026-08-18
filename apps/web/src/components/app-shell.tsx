import { SidebarInset, SidebarProvider } from "@boilerplate/ui/components/sidebar";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

export interface AppShellUser {
  name: string;
  email: string;
  image?: string | null;
}

interface AppShellProps {
  children: React.ReactNode;
  user: AppShellUser;
  isPlatformAdmin: boolean;
}

export default function AppShell({ children, user, isPlatformAdmin }: AppShellProps) {
  return (
    <div className="overflow-hidden">
      <SidebarProvider className="relative h-svh">
        <AppSidebar isPlatformAdmin={isPlatformAdmin} />
        <SidebarInset id="main-content" className="md:peer-data-[variant=inset]:ml-0">
          <AppHeader user={user} />
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
