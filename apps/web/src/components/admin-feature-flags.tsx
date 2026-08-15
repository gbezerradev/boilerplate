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
import { Field, FieldLabel } from "@boilerplate/ui/components/field";
import { Input } from "@boilerplate/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@boilerplate/ui/components/select";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

export default function AdminFeatureFlags() {
  const queryClient = useQueryClient();
  const flags = useQuery(trpc.featureFlags.adminList.queryOptions());
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [flagId, setFlagId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const create = useMutation(
    trpc.featureFlags.create.mutationOptions({
      onSuccess: async () => {
        setKey("");
        setDescription("");
        await refresh();
        toast.success("Feature flag created.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const update = useMutation(
    trpc.featureFlags.update.mutationOptions({
      onSuccess: async () => {
        await refresh();
        toast.success("Feature flag updated.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const setOverride = useMutation(
    trpc.featureFlags.setOverride.mutationOptions({
      onSuccess: async () => {
        await refresh();
        toast.success("Workspace override saved.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: trpc.featureFlags.adminList.queryKey() });
  }

  if (flags.isPending) return <Skeleton className="h-96 w-full" />;
  if (flags.isError) return <p className="text-sm text-destructive">{flags.error.message}</p>;

  return (
    <div className="grid max-w-4xl gap-6">
      <header>
        <Button variant="link" className="h-auto px-0" render={<Link href="/admin" />}>
          ← Administration
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">Feature flags</h1>
        <p className="text-sm text-muted-foreground">
          Control global rollout and workspace overrides.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Create flag</CardTitle>
          <CardDescription>Keys are stable identifiers used in application code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              create.mutate({ key, description, enabled: false, rolloutPercentage: 100 });
            }}
          >
            <Field>
              <FieldLabel htmlFor="flag-key">Key</FieldLabel>
              <Input
                id="flag-key"
                name="flagKey"
                autoComplete="off"
                spellCheck={false}
                value={key}
                onChange={(event) => setKey(event.target.value.toLowerCase())}
                placeholder="new.checkout"
                pattern="[a-z][a-z0-9._-]+"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="flag-description">Description</FieldLabel>
              <Input
                id="flag-description"
                name="flagDescription"
                autoComplete="off"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
            <Button type="submit" disabled={create.isPending}>
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Flags</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {flags.data.flags.length ? (
            flags.data.flags.map((flag) => (
              <div
                key={flag.id}
                className="flex flex-col gap-3 border p-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium">{flag.key}</p>
                    <Badge variant={flag.enabled ? "default" : "secondary"}>
                      {flag.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {flag.description || "No description"} · {flag.rolloutPercentage}% rollout
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => update.mutate({ id: flag.id, enabled: !flag.enabled })}
                >
                  {flag.enabled ? "Disable" : "Enable"}
                </Button>
                <Input
                  className="w-24"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={flag.rolloutPercentage}
                  aria-label={`Rollout percentage for ${flag.key}`}
                  onBlur={(event) =>
                    update.mutate({ id: flag.id, rolloutPercentage: Number(event.target.value) })
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No feature flags yet.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Workspace override</CardTitle>
          <CardDescription>An override takes precedence over global rollout.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field className="flex-1">
            <FieldLabel>Flag</FieldLabel>
            <Select value={flagId} onValueChange={(value) => setFlagId(value ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {flags.data.flags.map((flag) => (
                  <SelectItem key={flag.id} value={flag.id}>
                    {flag.key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="flex-1">
            <FieldLabel>Workspace</FieldLabel>
            <Select
              value={organizationId}
              onValueChange={(value) => setOrganizationId(value ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {flags.data.organizations.map((organization) => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Button
            variant="outline"
            disabled={!flagId || !organizationId}
            onClick={() => setOverride.mutate({ flagId, organizationId, enabled: false })}
          >
            Force off
          </Button>
          <Button
            disabled={!flagId || !organizationId}
            onClick={() => setOverride.mutate({ flagId, organizationId, enabled: true })}
          >
            Force on
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
