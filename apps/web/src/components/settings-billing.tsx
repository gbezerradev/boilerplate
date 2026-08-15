"use client";

import { Badge } from "@boilerplate/ui/components/badge";
import { Button } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

import { SettingsPage } from "./settings-profile";

export default function SettingsBilling() {
  const billing = useQuery(trpc.billing.status.queryOptions());
  const checkout = useMutation(
    trpc.billing.checkout.mutationOptions({
      onSuccess: ({ url }) => window.location.assign(url),
      onError: (error) => toast.error(error.message),
    }),
  );
  const portal = useMutation(
    trpc.billing.portal.mutationOptions({
      onSuccess: ({ url }) => window.location.assign(url),
      onError: (error) => toast.error(error.message),
    }),
  );

  if (billing.isPending) {
    return <Skeleton className="h-80 max-w-3xl" />;
  }

  if (billing.isError) {
    return <p className="text-sm text-destructive">Could not load billing information.</p>;
  }

  const { entitlements, enabled } = billing.data;
  const isPro = entitlements.plan === "pro";

  return (
    <SettingsPage title="Billing" description="Manage your plan and workspace entitlements.">
      {!enabled ? (
        <Card>
          <CardHeader>
            <CardTitle>Billing is disabled</CardTitle>
            <CardDescription>
              Configure Stripe environment variables to enable checkout and the customer portal.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={!isPro ? "border-primary" : undefined}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Free</CardTitle>
              {!isPro ? <Badge>Current plan</Badge> : null}
            </div>
            <CardDescription>Everything needed to validate a new SaaS idea.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <PlanFeature label="Up to 3 projects" />
            <PlanFeature label="Up to 2 members" />
            <PlanFeature label="Core workspace features" />
          </CardContent>
        </Card>
        <Card className={isPro ? "border-primary" : undefined}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Pro</CardTitle>
              {isPro ? <Badge>Current plan</Badge> : null}
            </div>
            <CardDescription>
              For growing teams that need higher limits and audit logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <PlanFeature label="Up to 100 projects" />
            <PlanFeature label="Up to 100 members" />
            <PlanFeature label="Audit log access" />
            {isPro ? (
              <Button
                variant="outline"
                className="mt-3"
                disabled={!enabled || portal.isPending}
                onClick={() => portal.mutate()}
              >
                <CreditCard />
                {portal.isPending ? "Opening…" : "Manage subscription"}
              </Button>
            ) : (
              <Button
                className="mt-3"
                disabled={!enabled || checkout.isPending}
                onClick={() => checkout.mutate()}
              >
                {checkout.isPending ? "Opening checkout…" : "Upgrade to Pro"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        Current limits: {entitlements.maxProjects} projects and {entitlements.maxMembers} members.
      </p>
    </SettingsPage>
  );
}

function PlanFeature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="size-4 text-primary" />
      <span>{label}</span>
    </div>
  );
}
