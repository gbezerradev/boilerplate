import { Button } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@boilerplate/ui/components/dropdown-menu";
import { cn } from "@boilerplate/ui/lib/utils";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import {
  channelBreakdown,
  conversationVolume,
  csatResponses,
  firstReplyTimes,
} from "./dashboard-data";

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <CardHeader className="gap-1 border-b border-border/60 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        {action}
      </div>
    </CardHeader>
  );
}

export function ConversationVolumeChart() {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0 lg:col-span-2">
      <SectionHeading
        title="Conversation volume"
        description="New threads per day for the selected window."
        action={<RangeMenu />}
      />
      <CardContent className="pt-5">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-3xl font-semibold tracking-tight">2,486</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="size-3 text-chart-2" />
              <span className="font-medium text-chart-2">2.4%</span> compared to previous period
            </p>
          </div>
          <div className="hidden items-center gap-4 text-[0.6875rem] text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-chart-2" />
              New threads
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-muted-foreground/35" />
              Resolved
            </span>
          </div>
        </div>
        <BarLineChart data={conversationVolume} />
      </CardContent>
    </Card>
  );
}

function RangeMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="h-7 rounded-lg px-2.5 text-[0.6875rem]" />
        }
      >
        Last 30 days
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Last 7 days</DropdownMenuItem>
        <DropdownMenuItem>Last 30 days</DropdownMenuItem>
        <DropdownMenuItem>Last 90 days</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BarLineChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value));
  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 92 - (item.value / max) * 76;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative h-48 w-full">
      <div className="absolute inset-0 flex flex-col justify-between text-[0.625rem] text-muted-foreground/70">
        {["200", "150", "100", "50", "0"].map((label) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-6 text-right">{label}</span>
            <span className="h-px flex-1 border-t border-dashed border-border/70" />
          </div>
        ))}
      </div>
      <svg
        className="absolute inset-y-2 left-10 right-1 h-[calc(100%-0.5rem)] w-[calc(100%-2.75rem)] overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label="Conversation volume trend"
      >
        <defs>
          <linearGradient id="volume-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,100 ${points} 100,100`}
          fill="url(#volume-fill)"
          stroke="none"
          className="text-chart-2"
        />
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          vectorEffect="non-scaling-stroke"
          className="text-chart-2"
        />
      </svg>
      <div className="absolute right-0 bottom-0 left-10 flex justify-between text-[0.625rem] text-muted-foreground/70">
        {data
          .filter((_, index) => index % 5 === 0)
          .map((item) => (
            <span key={item.label}>{item.label}</span>
          ))}
      </div>
    </div>
  );
}

export function ChannelBreakdownCard() {
  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0">
      <SectionHeading
        title="Traffic by channel"
        description="Share of new conversations in the last 7 days."
      />
      <CardContent className="pt-5">
        <div className="flex items-center gap-6">
          <div
            className="relative size-32 shrink-0 rounded-full"
            style={{
              background:
                "conic-gradient(var(--color-chart-1) 0 44%, var(--color-chart-2) 44% 80%, var(--color-chart-4) 80% 100%)",
            }}
          >
            <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-card text-center">
              <span className="text-2xl font-semibold">+2.4</span>
              <span className="text-[0.625rem] text-muted-foreground">percentage points</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {channelBreakdown.map((channel) => (
              <div key={channel.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className={cn("size-2 rounded-full", channel.color)} />
                  {channel.label}
                </span>
                <span className="font-medium">{channel.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendChartCard({ kind }: { kind: "csat" | "reply" }) {
  const isCsat = kind === "csat";
  const values = isCsat ? csatResponses : firstReplyTimes;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 88 - ((value - min) / (max - min || 1)) * 68;
      return `${x},${y / 2.2}`;
    })
    .join(" ");

  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0">
      <SectionHeading
        title={isCsat ? "CSAT responses" : "Median first reply"}
        description={
          isCsat
            ? "Post-resolution surveys submitted per day by channel."
            : "Median time to first reply across all conversations."
        }
      />
      <CardContent className="pt-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-semibold">{isCsat ? "94%" : "4.1m"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isCsat ? "+1.1% vs. prior 30d" : "-18.6% vs. last week"}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2 py-1 text-[0.625rem] font-medium text-secondary-foreground">
            Last 10 days
          </span>
        </div>
        <svg
          className="mt-6 h-20 w-full overflow-visible"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          role="img"
          aria-label={isCsat ? "CSAT response trend" : "Median first reply trend"}
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            vectorEffect="non-scaling-stroke"
            className="text-chart-2"
          />
          {values.map((value, index) => {
            const x = (index / (values.length - 1)) * 100;
            const y = 88 - ((value - min) / (max - min || 1)) * 68;
            return (
              <circle
                key={`${value}-${index}`}
                cx={x}
                cy={y / 2.2}
                r="1.7"
                className="fill-background stroke-chart-2"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
