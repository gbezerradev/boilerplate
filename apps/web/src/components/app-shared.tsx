import {
  ActivityIcon,
  BarChart3Icon,
  HelpCircleIcon,
  LayoutGridIcon,
  ListChecksIcon,
  MessageSquareTextIcon,
  PlugIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

function isActivePath(pathname: string, path?: string) {
  if (!path || path === "#") return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function getNavGroups(pathname: string, isPlatformAdmin = false): SidebarNavGroup[] {
  return [
    {
      items: [
        {
          title: "Overview",
          path: "/dashboard",
          icon: <LayoutGridIcon />,
          isActive: isActivePath(pathname, "/dashboard"),
        },
      ],
    },
    {
      label: "Today",
      items: [
        {
          title: "Queue",
          path: "/projects",
          icon: <ListChecksIcon />,
          isActive: isActivePath(pathname, "/projects"),
        },
        {
          title: "Team insights",
          path: "/files",
          icon: <BarChart3Icon />,
          isActive: isActivePath(pathname, "/files"),
        },
      ],
    },
    {
      label: "Inbox",
      items: [
        {
          title: "Conversations",
          icon: <MessageSquareTextIcon />,
          subItems: [
            { title: "Unassigned", path: "/dashboard" },
            { title: "Assigned to me", path: "/dashboard" },
            { title: "Recently closed", path: "/dashboard" },
          ],
        },
        {
          title: "Customers",
          path: "/projects",
          icon: <UsersIcon />,
        },
        {
          title: "Channels",
          path: "/files",
          icon: <PlugIcon />,
        },
      ],
    },
    {
      label: "Organization",
      items: [
        {
          title: "Workspace",
          icon: <SettingsIcon />,
          isActive: pathname.startsWith("/settings/"),
          subItems: [
            { title: "Branding", path: "/settings/organization" },
            { title: "Team & roles", path: "/settings/members" },
            { title: "API keys", path: "/settings/integrations" },
            { title: "Webhooks", path: "/settings/integrations" },
            { title: "Billing", path: "/settings/billing" },
            ...(isPlatformAdmin ? [{ title: "Platform", path: "/admin" }] : []),
          ].map((item) => ({
            ...item,
            isActive: isActivePath(pathname, item.path),
          })),
        },
      ],
    },
  ];
}

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    path: "#",
    icon: <HelpCircleIcon />,
  },
  {
    title: "System status",
    path: "#",
    icon: <ActivityIcon />,
  },
];

export function getNavLinks(pathname: string, isPlatformAdmin = false) {
  return [
    ...getNavGroups(pathname, isPlatformAdmin).flatMap((group) =>
      group.items.flatMap((item) => (item.subItems?.length ? [item, ...item.subItems] : [item])),
    ),
    ...footerNavLinks,
  ];
}
