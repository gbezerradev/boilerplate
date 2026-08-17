"use client";

import { Badge } from "@boilerplate/ui/components/badge";
import { Button } from "@boilerplate/ui/components/button";
import { Plus, Search, Sparkles } from "lucide-react";

import { DashboardKpiCard } from "./dashboard/dashboard-kpi-card";
import {
  ChannelBreakdownCard,
  ConversationVolumeChart,
  TrendChartCard,
} from "./dashboard/dashboard-charts";
import { dashboardKpis } from "./dashboard/dashboard-data";
import {
  RecentConversationsCard,
  TeamOnDutyCard,
  WorkspaceActivityCard,
} from "./dashboard/dashboard-sections";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      <header className="flex flex-col gap-5 border-b border-border/60 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Overview</span>
            <span className="text-border">/</span>
            <span className="text-foreground">Today</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Good morning, welcome back
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Here’s what’s happening across your customer workspace today.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="rounded-lg">
            <Search className="size-4" />
            Search
          </Button>
          <Button className="rounded-lg">
            <Plus className="size-4" />
            New conversation
          </Button>
        </div>
      </header>

      <section aria-labelledby="metrics-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="metrics-heading" className="text-sm font-medium">
            Workspace pulse
          </h2>
          <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-chart-2/30 bg-chart-2/10 text-chart-2"
          >
            <span className="size-1.5 rounded-full bg-chart-2" />
            Demo data
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardKpis.map((kpi) => (
            <DashboardKpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </section>

      <section aria-labelledby="analytics-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="analytics-heading" className="text-sm font-medium">
            Analytics
          </h2>
          <Button variant="ghost" size="sm" className="hidden text-xs sm:inline-flex">
            Customize dashboard
          </Button>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <ConversationVolumeChart />
          <ChannelBreakdownCard />
          <TrendChartCard kind="csat" />
          <TrendChartCard kind="reply" />
        </div>
      </section>

      <section aria-labelledby="operations-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="operations-heading" className="text-sm font-medium">
            Operations
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            Updated a few seconds ago
          </span>
        </div>
        <div className="grid gap-3 xl:grid-cols-4">
          <TeamOnDutyCard />
          <RecentConversationsCard />
          <WorkspaceActivityCard />
        </div>
      </section>
    </div>
  );
}
