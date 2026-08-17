import { Avatar, AvatarFallback } from "@boilerplate/ui/components/avatar";
import { Badge } from "@boilerplate/ui/components/badge";
import { Button } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@boilerplate/ui/components/table";
import { ArrowUpRight, Mail, MessageCircle, MoreHorizontal, Radio, UserRound } from "lucide-react";

import { recentConversations, teamMembers, workspaceActivity } from "./dashboard-data";

export function TeamOnDutyCard() {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Team on duty</CardTitle>
            <CardDescription className="mt-1">Availability and assigned queue.</CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Manage team">
            <MoreHorizontal />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="divide-y divide-border/60">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex items-center gap-3 py-3">
              <div className="relative">
                <Avatar
                  size="sm"
                  className={`bg-gradient-to-br ${member.avatar} text-primary-foreground after:border-background`}
                >
                  <AvatarFallback className="bg-transparent text-[0.625rem] font-semibold text-primary-foreground">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute right-0 bottom-0 size-2 rounded-full ring-2 ring-card ${member.status === "Online" ? "bg-chart-2" : "bg-muted-foreground/50"}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{member.name}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">{member.status}</p>
              </div>
              <span className="text-xs font-medium tabular-nums">{member.assigned}</span>
              <Button variant="ghost" size="icon-xs" aria-label={`More options for ${member.name}`}>
                <MoreHorizontal />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentConversationsCard() {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0 xl:col-span-2">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Recent conversations</CardTitle>
            <CardDescription className="mt-1">
              The latest activity across your inbox.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            View all <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Customer</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Wait</TableHead>
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentConversations.map((conversation) => (
              <TableRow key={conversation.customer}>
                <TableCell className="pl-5 font-medium">{conversation.customer}</TableCell>
                <TableCell className="max-w-40 truncate text-muted-foreground">
                  {conversation.topic}
                </TableCell>
                <TableCell>
                  <ChannelIcon channel={conversation.channel} />
                </TableCell>
                <TableCell className="text-muted-foreground">{conversation.wait}</TableCell>
                <TableCell className="pr-5">
                  <StatusBadge status={conversation.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ChannelIcon({ channel }: { channel: string }) {
  const Icon = channel === "Email" ? Mail : MessageCircle;
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-3.5" />
      {channel}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  const isSnoozed = status === "Snoozed";
  const className = isActive
    ? "border-chart-2/30 bg-chart-2/10 text-chart-2"
    : isSnoozed
      ? "border-border bg-muted text-muted-foreground"
      : "border-chart-4/30 bg-chart-4/10 text-chart-4";
  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
}

export function WorkspaceActivityCard() {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Workspace activity</CardTitle>
            <CardDescription className="mt-1">A pulse on recent changes.</CardDescription>
          </div>
          <Radio className="size-4 text-chart-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="divide-y divide-border/60">
          {workspaceActivity.map((activity) => (
            <div key={activity.title} className="flex items-start gap-3 py-3">
              <Avatar size="sm">
                <AvatarFallback className="text-[0.625rem]">{activity.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-5">{activity.title}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-3 w-full rounded-lg text-xs">
          <UserRound className="size-3.5" />
          View all activity
        </Button>
      </CardContent>
    </Card>
  );
}
