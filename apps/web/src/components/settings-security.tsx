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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import { Input } from "@boilerplate/ui/components/input";
import { Skeleton } from "@boilerplate/ui/components/skeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Laptop, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { formatDate } from "@/lib/format";

import { SettingsPage } from "./settings-profile";

const sessionsKey = ["account", "sessions"] as const;

export default function SettingsSecurity() {
  const queryClient = useQueryClient();
  const currentSession = authClient.useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const sessions = useQuery({
    queryKey: sessionsKey,
    queryFn: async () => {
      const result = await authClient.listSessions();
      if (result.error) throw new Error(result.error.message || result.error.statusText);
      return result.data;
    },
  });

  return (
    <SettingsPage title="Security" description="Change your password and review active sessions.">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Other signed-in devices will be disconnected.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setChanging(true);
              const result = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
              });
              setChanging(false);
              if (result.error) {
                toast.error(result.error.message || result.error.statusText);
                return;
              }
              setCurrentPassword("");
              setNewPassword("");
              await queryClient.invalidateQueries({ queryKey: sessionsKey });
              toast.success("Password changed and other sessions revoked.");
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">Current password</FieldLabel>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                />
                <FieldDescription>Use at least 8 characters.</FieldDescription>
              </Field>
            </FieldGroup>
            <Button type="submit" className="w-fit" disabled={changing || newPassword.length < 8}>
              {changing ? "Changing…" : "Change password"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Active sessions</CardTitle>
            <CardDescription>Devices that can currently access your account.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const result = await authClient.revokeOtherSessions();
              if (result.error) {
                toast.error(result.error.message || result.error.statusText);
                return;
              }
              await queryClient.invalidateQueries({ queryKey: sessionsKey });
              toast.success("Other sessions revoked.");
            }}
          >
            <ShieldCheck />
            Revoke others
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {sessions.isPending ? (
            <Skeleton className="h-20 w-full" />
          ) : sessions.isError ? (
            <p className="text-sm text-destructive">Could not load active sessions.</p>
          ) : (
            sessions.data?.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border p-3">
                <Laptop className="size-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {item.userAgent || "Unknown device"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.ipAddress || "Unknown IP"} · expires {formatDate(item.expiresAt)}
                  </p>
                </div>
                {item.token === currentSession.data?.session.token ? (
                  <Badge variant="secondary">Current</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      const result = await authClient.revokeSession({ token: item.token });
                      if (result.error) {
                        toast.error(result.error.message || result.error.statusText);
                        return;
                      }
                      await queryClient.invalidateQueries({ queryKey: sessionsKey });
                      toast.success("Session revoked.");
                    }}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </SettingsPage>
  );
}
