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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@boilerplate/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { trpc } from "@/utils/trpc";
import { formatDateTime } from "@/lib/format";

import { SettingsPage } from "./settings-profile";

const pageSize = 25;

export default function SettingsAudit() {
  const [offset, setOffset] = useState(0);
  const audit = useQuery(trpc.audit.list.queryOptions({ limit: pageSize, offset }));

  return (
    <SettingsPage title="Audit log" description="Review security-sensitive workspace activity.">
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Immutable records are scoped to the active workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          {audit.isPending ? (
            <Skeleton className="h-56 w-full" />
          ) : audit.isError ? (
            <div className="grid justify-items-start gap-3 py-6">
              <p className="text-sm text-muted-foreground">{audit.error.message}</p>
              {audit.error.message.includes("Pro") ? (
                <Button render={<Link href="/settings/billing" />}>View plans</Button>
              ) : null}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.data.events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No audit events yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    audit.data.events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant="outline">{event.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{event.actorName ?? "System"}</p>
                          <p className="text-xs text-muted-foreground">{event.actorEmail}</p>
                        </TableCell>
                        <TableCell>
                          {event.resourceType}
                          {event.resourceId ? ` · ${event.resourceId.slice(0, 8)}` : ""}
                        </TableCell>
                        <TableCell>{formatDateTime(event.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{audit.data.total} events</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset === 0}
                    onClick={() => setOffset((value) => Math.max(0, value - pageSize))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={offset + pageSize >= audit.data.total}
                    onClick={() => setOffset((value) => value + pageSize)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </SettingsPage>
  );
}
