"use client";

import { Badge } from "@boilerplate/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export default function DashboardOverview() {
  const projects = useQuery(trpc.projects.list.queryOptions());
  const billing = useQuery(trpc.billing.status.queryOptions());

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Workspace health, usage, and plan limits.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Projects"
          value={projects.isPending ? undefined : String(projects.data?.length ?? 0)}
          description={`of ${billing.data?.entitlements.maxProjects ?? "—"} included`}
        />
        <MetricCard
          title="Plan"
          value={billing.data?.entitlements.plan ?? undefined}
          description={billing.data?.enabled ? "Stripe billing enabled" : "Billing disabled"}
        />
        <MetricCard
          title="Audit log"
          value={billing.data?.entitlements.auditLog ? "Included" : "Upgrade"}
          description="Workspace activity history"
        />
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Tenant isolation</CardTitle>
              <CardDescription>
                Every product query is scoped by the active organization.
              </CardDescription>
            </div>
            <Badge variant="outline">Enforced server-side</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The current workspace is resolved from the authenticated session. Client-supplied tenant
            IDs are rejected by the API schemas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value?: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-xl capitalize">
          {value === undefined ? <Skeleton className="h-6 w-16" /> : value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  );
}
