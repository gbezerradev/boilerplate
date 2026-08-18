import type { LucideIcon } from "lucide-react";
import { BarChart3, Inbox, MessageCircle, Timer } from "lucide-react";

export type DashboardKpi = {
  label: string;
  value: string;
  change: string;
  comparison: string;
  icon: LucideIcon;
};

export const dashboardKpis: DashboardKpi[] = [
  { label: "Open queue", value: "38", change: "+12.4%", comparison: "vs. yesterday", icon: Inbox },
  {
    label: "Active conversations",
    value: "126",
    change: "+5.2%",
    comparison: "vs. last week",
    icon: MessageCircle,
  },
  {
    label: "Median first reply",
    value: "4.1m",
    change: "-18.6%",
    comparison: "vs. last week",
    icon: Timer,
  },
  {
    label: "CSAT (30d)",
    value: "94%",
    change: "+1.1%",
    comparison: "vs. prior 30d",
    icon: BarChart3,
  },
];

export const conversationVolume = [
  { label: "May 19", value: 38 },
  { label: "May 20", value: 52 },
  { label: "May 21", value: 44 },
  { label: "May 22", value: 68 },
  { label: "May 23", value: 57 },
  { label: "May 24", value: 76 },
  { label: "May 25", value: 64 },
  { label: "May 26", value: 89 },
  { label: "May 27", value: 72 },
  { label: "May 28", value: 94 },
  { label: "May 29", value: 82 },
  { label: "May 30", value: 108 },
  { label: "May 31", value: 96 },
  { label: "Jun 01", value: 126 },
  { label: "Jun 02", value: 112 },
  { label: "Jun 03", value: 138 },
  { label: "Jun 04", value: 121 },
  { label: "Jun 05", value: 151 },
  { label: "Jun 06", value: 143 },
  { label: "Jun 07", value: 168 },
  { label: "Jun 08", value: 158 },
  { label: "Jun 09", value: 180 },
  { label: "Jun 10", value: 166 },
  { label: "Jun 11", value: 191 },
  { label: "Jun 12", value: 176 },
  { label: "Jun 13", value: 202 },
  { label: "Jun 14", value: 186 },
  { label: "Jun 15", value: 210 },
  { label: "Jun 16", value: 198 },
  { label: "Jun 17", value: 226 },
];

export const channelBreakdown = [
  { label: "Direct", value: 44, color: "bg-chart-1" },
  { label: "Email", value: 36, color: "bg-chart-2" },
  { label: "Social", value: 20, color: "bg-chart-4" },
];

export const csatResponses = [82, 91, 88, 104, 97, 118, 109, 128, 121, 142];
export const firstReplyTimes = [5.4, 4.9, 5.2, 4.7, 4.5, 5, 4.1];

export const teamMembers = [
  {
    name: "Amelia Park",
    initials: "AP",
    status: "Online",
    assigned: 9,
    avatar: "from-chart-2 to-chart-4",
  },
  {
    name: "Noah Ibarra",
    initials: "NI",
    status: "Online",
    assigned: 7,
    avatar: "from-chart-1 to-chart-3",
  },
  {
    name: "Priya Desai",
    initials: "PD",
    status: "Away",
    assigned: 4,
    avatar: "from-chart-3 to-chart-5",
  },
  {
    name: "Marcus Chen",
    initials: "MC",
    status: "Online",
    assigned: 11,
    avatar: "from-chart-4 to-chart-5",
  },
  {
    name: "Emily Johnson",
    initials: "EJ",
    status: "Away",
    assigned: 2,
    avatar: "from-chart-1 to-chart-2",
  },
] as const;

export const recentConversations = [
  {
    customer: "Northwind Labs",
    topic: "Billing portal access",
    channel: "Email",
    wait: "6 minutes",
    status: "In queue",
  },
  {
    customer: "Blue River Co.",
    topic: "Shipment ETA",
    channel: "Chat",
    wait: "1 minute",
    status: "Active",
  },
  {
    customer: "Oak Street Studio",
    topic: "API rate limits",
    channel: "Email",
    wait: "Almost an hour",
    status: "Snoozed",
  },
  {
    customer: "Harbor Freight LLC",
    topic: "Workspace SSO",
    channel: "Chat",
    wait: "3 minutes",
    status: "Active",
  },
] as const;

export const workspaceActivity = [
  { title: "SLA warning cleared for Oak Street Studio", time: "12 min ago", initials: "OS" },
  { title: "Conversation escalated to Tier 2", time: "28 min ago", initials: "T2" },
  { title: "Macro ‘Refund approved’ updated", time: "1 hr ago", initials: "RA" },
  { title: "New customer segment synced from CRM", time: "3 hr ago", initials: "CR" },
] as const;
