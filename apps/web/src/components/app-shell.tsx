"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@boilerplate/ui/components/avatar";
import { Button } from "@boilerplate/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@boilerplate/ui/components/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@boilerplate/ui/components/sheet";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import { cn } from "@boilerplate/ui/lib/utils";
import {
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  FolderKanban,
  Files,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Plug,
  ScrollText,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  isPlatformAdmin: boolean;
}

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/files", label: "Files", icon: Files },
] as const;

const settingsNavigation = [
  { href: "/settings/profile", label: "Profile", icon: UserRound },
  { href: "/settings/security", label: "Security", icon: ShieldCheck },
  { href: "/settings/organization", label: "Workspace", icon: Building2 },
  { href: "/settings/members", label: "Members", icon: Users },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings/audit", label: "Audit log", icon: ScrollText },
  { href: "/settings/integrations", label: "Integrations", icon: Plug },
] as const;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AppShell({ children, user, isPlatformAdmin }: AppShellProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const organizations = authClient.useListOrganizations();
  const activeOrganization = authClient.useActiveOrganization();

  useEffect(() => {
    if (organizations.isPending || activeOrganization.isPending || isActivating) return;

    const firstOrganization = organizations.data?.[0];
    if (!firstOrganization) {
      router.replace("/onboarding");
      return;
    }

    if (!activeOrganization.data) {
      setIsActivating(true);
      void authClient.organization.setActive(
        { organizationId: firstOrganization.id },
        {
          onSuccess: () => {
            setIsActivating(false);
            router.refresh();
          },
          onError: ({ error }) => {
            setIsActivating(false);
            toast.error(error.message || error.statusText);
          },
        },
      );
    }
  }, [
    activeOrganization.data,
    activeOrganization.isPending,
    isActivating,
    organizations.data,
    organizations.isPending,
    router,
  ]);

  const shellNavigation = (
    <ShellNavigation
      onNavigate={() => setMobileOpen(false)}
      organizationName={activeOrganization.data?.name}
      isPlatformAdmin={isPlatformAdmin}
    />
  );
  const workspaceReady = Boolean(activeOrganization.data) && !isActivating;

  return (
    <div className="min-h-svh bg-muted/20 lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r bg-background lg:block">{shellNavigation}</aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
                <Menu />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Application navigation</SheetTitle>
                  <SheetDescription>Navigate your workspace and settings.</SheetDescription>
                </SheetHeader>
                {shellNavigation}
              </SheetContent>
            </Sheet>
            <OrganizationSwitcher
              organizations={organizations.data ?? []}
              activeOrganizationId={activeOrganization.data?.id}
              loading={organizations.isPending || activeOrganization.isPending || isActivating}
            />
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <AppUserMenu user={user} />
          </div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-6xl p-4 md:p-6 lg:p-8">
          {workspaceReady ? children : <Skeleton className="h-48 w-full" />}
        </main>
      </div>
    </div>
  );
}

function ShellNavigation({
  onNavigate,
  organizationName,
  isPlatformAdmin,
}: {
  onNavigate: () => void;
  organizationName?: string;
  isPlatformAdmin: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-svh flex-col p-3">
      <Link
        href="/dashboard"
        className="px-2 py-3 font-mono text-sm font-semibold"
        onClick={onNavigate}
      >
        SaaS Boilerplate
      </Link>
      <p className="truncate px-2 pb-3 text-xs text-muted-foreground">
        {organizationName ?? "Loading workspace…"}
      </p>
      <nav aria-label="Main navigation" className="grid gap-1">
        {navigation.map((item) => (
          <NavigationLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
        ))}
      </nav>
      <div className="my-4 border-t" />
      <p className="px-2 pb-2 text-[0.6875rem] font-medium tracking-wider text-muted-foreground uppercase">
        Settings
      </p>
      <nav aria-label="Settings navigation" className="grid gap-1">
        {settingsNavigation.map((item) => (
          <NavigationLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
        ))}
      </nav>
      {isPlatformAdmin ? (
        <>
          <div className="my-4 border-t" />
          <p className="px-2 pb-2 text-[0.6875rem] font-medium tracking-wider text-muted-foreground uppercase">
            Platform
          </p>
          <nav aria-label="Platform navigation" className="grid gap-1">
            <NavigationLink
              item={{ href: "/admin", label: "Administration", icon: Wrench }}
              pathname={pathname}
              onClick={onNavigate}
            />
          </nav>
        </>
      ) : null}
    </div>
  );
}

function NavigationLink({
  item,
  pathname,
  onClick,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
  pathname: string;
  onClick: () => void;
}) {
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href as Route}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 items-center gap-2 px-2 text-xs font-medium transition-colors hover:bg-muted",
        active && "bg-muted text-foreground",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
}

function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
  loading,
}: {
  organizations: Array<{ id: string; name: string }>;
  activeOrganizationId?: string;
  loading: boolean;
}) {
  const router = useRouter();
  const activeOrganization = organizations.find((item) => item.id === activeOrganizationId);

  if (loading) return <Skeleton className="h-8 w-40" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="max-w-52" />}>
        <Building2 />
        <span className="truncate">{activeOrganization?.name ?? "Select workspace"}</span>
        <ChevronDown className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((organization) => (
          <DropdownMenuItem
            key={organization.id}
            onClick={() => {
              void authClient.organization.setActive(
                { organizationId: organization.id },
                {
                  onSuccess: () => router.refresh(),
                  onError: ({ error }) => {
                    toast.error(error.message || error.statusText);
                  },
                },
              );
            }}
          >
            <Check
              className={cn("size-4", organization.id !== activeOrganizationId && "opacity-0")}
            />
            {organization.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/onboarding")}>
          <Plus />
          New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppUserMenu({ user }: { user: AppShellProps["user"] }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-9 px-1.5" />}>
        <Avatar size="sm">
          {user.image ? <AvatarImage src={user.image} alt="" /> : null}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate sm:inline">{user.name}</span>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <span className="block truncate">{user.name}</span>
          <span className="block truncate font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              void authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/"),
                },
              });
            }}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
