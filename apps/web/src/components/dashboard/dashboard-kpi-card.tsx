import { Card, CardContent, CardHeader } from "@boilerplate/ui/components/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import type { DashboardKpi } from "./dashboard-data";

export function DashboardKpiCard({ kpi }: { kpi: DashboardKpi }) {
  const Icon = kpi.icon;
  const isImproving = kpi.change.startsWith("-");

  return (
    <Card className="rounded-2xl border border-border/70 bg-card/70 shadow-none ring-0 transition-colors hover:bg-card">
      <CardHeader className="gap-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
          <span className="flex size-8 items-center justify-center rounded-xl bg-muted/80 text-muted-foreground">
            <Icon className="size-4" />
          </span>
        </div>
        <div className="text-3xl font-semibold tracking-tight">{kpi.value}</div>
      </CardHeader>
      <CardContent className="flex items-center gap-1.5 pt-3 text-[0.6875rem]">
        <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 font-medium text-secondary-foreground">
          {isImproving ? (
            <ArrowDownRight className="size-3" />
          ) : (
            <ArrowUpRight className="size-3" />
          )}
          {kpi.change}
        </span>
        <span className="text-muted-foreground">{kpi.comparison}</span>
      </CardContent>
    </Card>
  );
}
