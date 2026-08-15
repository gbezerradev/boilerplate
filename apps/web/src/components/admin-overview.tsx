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
import { Button } from "@boilerplate/ui/components/button";

import { trpc } from "@/utils/trpc";
import { formatDate } from "@/lib/format";

export default function AdminOverview() {
  const overview = useQuery(trpc.admin.overview.queryOptions());

  if (overview.isPending) return <Skeleton className="h-96 w-full" />;
  if (overview.isError) return <p className="text-sm text-destructive">{overview.error.message}</p>;

  const { counts, recentJobs, recentUsers } = overview.data;
  const totalJobs = Object.values(counts.jobs).reduce((sum, value) => sum + value, 0);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Platform administration</h1>
        <p className="text-sm text-muted-foreground">
          Operational overview restricted by a server-side allowlist.
        </p>
        <Button className="mt-4" variant="outline" render={<Link href="/admin/feature-flags" />}>
          Manage feature flags
        </Button>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={counts.users} />
        <StatCard label="Workspaces" value={counts.organizations} />
        <StatCard label="Subscriptions" value={counts.subscriptions} />
        <StatCard label="Jobs" value={totalJobs} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent users</CardTitle>
            <CardDescription>Latest accounts created on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent jobs</CardTitle>
            <CardDescription>Queue activity and retry state.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-xs text-muted-foreground">Attempt {item.attempts}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "failed" ? "destructive" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
