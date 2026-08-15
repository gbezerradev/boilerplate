"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@boilerplate/ui/components/alert-dialog";
import { Badge } from "@boilerplate/ui/components/badge";
import { Button } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@boilerplate/ui/components/field";
import { Input } from "@boilerplate/ui/components/input";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@boilerplate/ui/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";
import { formatDateTime } from "@/lib/format";

import { SettingsPage } from "./settings-profile";

export default function SettingsIntegrations() {
  const queryClient = useQueryClient();
  const integrations = useQuery(trpc.integrations.list.queryOptions());
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<Array<"project.created" | "project.deleted">>([
    "project.created",
  ]);
  const [newSecret, setNewSecret] = useState<string>();
  const create = useMutation(
    trpc.integrations.create.mutationOptions({
      onSuccess: async (endpoint) => {
        setName("");
        setUrl("");
        setNewSecret(endpoint.secret);
        await queryClient.invalidateQueries({ queryKey: trpc.integrations.list.queryKey() });
        toast.success("Webhook created. Save its signing secret now.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const remove = useMutation(
    trpc.integrations.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: trpc.integrations.list.queryKey() });
        toast.success("Webhook deleted.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );
  const test = useMutation(
    trpc.integrations.test.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: trpc.integrations.list.queryKey() });
        toast.success("Test event queued.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  if (integrations.isPending) return <Skeleton className="h-80 max-w-3xl" />;
  if (integrations.isError) {
    return <p className="text-sm text-destructive">{integrations.error.message}</p>;
  }

  return (
    <SettingsPage title="Integrations" description="Send signed events to external systems.">
      {newSecret ? (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Save your signing secret</CardTitle>
            <CardDescription>This secret is shown only once.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input value={newSecret} readOnly aria-label="Webhook signing secret" />
            <Button
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(newSecret);
                toast.success("Secret copied.");
              }}
            >
              <Copy /> Copy
            </Button>
            <Button variant="ghost" onClick={() => setNewSecret(undefined)}>
              Done
            </Button>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Create webhook</CardTitle>
          <CardDescription>Only public HTTPS destinations are accepted.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              create.mutate({ name, url, events });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="webhook-name">Name</FieldLabel>
                <Input
                  id="webhook-name"
                  name="webhookName"
                  autoComplete="off"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  minLength={2}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="webhook-url">Endpoint URL</FieldLabel>
                <Input
                  id="webhook-url"
                  name="webhookUrl"
                  autoComplete="off"
                  spellCheck={false}
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com/webhooks"
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Events</FieldLabel>
              <div className="flex flex-wrap gap-4">
                {integrations.data.eventTypes.map((eventType) => (
                  <label key={eventType} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={events.includes(eventType)}
                      onChange={(event) =>
                        setEvents((value) =>
                          event.target.checked
                            ? [...new Set([...value, eventType])]
                            : value.filter((item) => item !== eventType),
                        )
                      }
                    />
                    {eventType}
                  </label>
                ))}
              </div>
              <FieldDescription>
                Deliveries are signed with HMAC-SHA256 and retried by the worker.
              </FieldDescription>
            </Field>
            <Button
              type="submit"
              className="w-fit"
              disabled={create.isPending || events.length === 0}
            >
              {create.isPending ? "Validating…" : "Create webhook"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Webhook endpoints</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {integrations.data.endpoints.length === 0 ? (
            <p className="text-sm text-muted-foreground">No webhook endpoints configured.</p>
          ) : (
            integrations.data.endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="flex flex-col gap-3 border p-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{endpoint.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{endpoint.url}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {endpoint.events.map((event) => (
                      <Badge key={event} variant="outline">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => test.mutate({ id: endpoint.id })}
                >
                  <Send /> Test
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${endpoint.name}`}
                      />
                    }
                  >
                    <Trash2 />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {endpoint.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Future events will no longer be delivered to this endpoint.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => remove.mutate({ id: endpoint.id })}
                      >
                        Delete webhook
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {integrations.data.deliveries.length ? (
                integrations.data.deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell>{delivery.eventType}</TableCell>
                    <TableCell>
                      <Badge variant={delivery.status === "failed" ? "destructive" : "secondary"}>
                        {delivery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(delivery.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                    No deliveries yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SettingsPage>
  );
}
