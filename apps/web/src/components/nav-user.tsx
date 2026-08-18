"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@boilerplate/ui/components/avatar";
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
  BellIcon,
  CommandIcon,
  CreditCardIcon,
  GraduationCapIcon,
  LifeBuoyIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import type { AppShellUser } from "@/components/app-shell";
import { authClient } from "@/lib/auth-client";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function NavUser({ user }: { user: AppShellUser }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger nativeButton={false} render={<Avatar className="size-8" />}>
        {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3">
            <Avatar className="size-10">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <span className="font-medium text-foreground">{user.name}</span> <br />
              <div className="max-w-full truncate text-muted-foreground text-xs">{user.email}</div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CommandIcon />
            Keyboard shortcuts
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LifeBuoyIcon />
            Help center
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GraduationCapIcon />
            Agent training
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings/billing")}>
            <CreditCardIcon />
            Subscription
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="w-full cursor-pointer"
            variant="destructive"
            onClick={() => {
              void authClient.signOut({
                fetchOptions: {
                  onSuccess: () => router.push("/"),
                },
              });
            }}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
