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
import { Avatar, AvatarFallback, AvatarImage } from "@boilerplate/ui/components/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@boilerplate/ui/components/table";
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { SettingsPage } from "./settings-profile";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function SettingsMembers() {
  const organization = authClient.useActiveOrganization();
  const session = authClient.useSession();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [inviting, setInviting] = useState(false);

  const currentMember = organization.data?.members.find(
    (member) => member.userId === session.data?.user.id,
  );
  const organizationId = organization.data?.id;
  const canManage = currentMember?.role === "owner" || currentMember?.role === "admin";
  const isOwner = currentMember?.role === "owner";

  return (
    <SettingsPage title="Members" description="Invite teammates and manage workspace access.">
      {canManage ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite a teammate</CardTitle>
            <CardDescription>Invitations expire after seven days.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-3 sm:flex-row sm:items-end"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!organization.data) return;
                setInviting(true);
                const result = await authClient.organization.inviteMember({
                  email: email.trim(),
                  role,
                  organizationId: organization.data.id,
                });
                setInviting(false);
                if (result.error) {
                  toast.error(result.error.message || result.error.statusText);
                  return;
                }
                setEmail("");
                toast.success("Invitation sent.");
              }}
            >
              <Field className="flex-1">
                <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                <Input
                  id="invite-email"
                  name="inviteEmail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  spellCheck={false}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value as "member" | "admin")}
                >
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    {isOwner ? <SelectItem value="admin">Admin</SelectItem> : null}
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit" disabled={inviting || !email.trim()}>
                <UserPlus />
                {inviting ? "Sending…" : "Invite"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Workspace members</CardTitle>
          <CardDescription>
            {organization.data?.members.length ?? 0} active members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-20">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization.data?.members.map((member) => {
                const isCurrent = member.userId === session.data?.user.id;
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {member.user.image ? (
                            <AvatarImage src={member.user.image} alt="" />
                          ) : null}
                          <AvatarFallback>{initials(member.user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{member.user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.user.email}
                          </p>
                        </div>
                        {isCurrent ? <Badge variant="outline">You</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isOwner && member.role !== "owner" ? (
                        <Select
                          value={member.role}
                          onValueChange={async (nextRole) => {
                            if (!nextRole || !organizationId) return;
                            const result = await authClient.organization.updateMemberRole({
                              memberId: member.id,
                              role: nextRole,
                              organizationId,
                            });
                            if (result.error) {
                              toast.error(result.error.message || result.error.statusText);
                              return;
                            }
                            await organization.refetch();
                            toast.success("Member role updated.");
                          }}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary" className="capitalize">
                          {member.role}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {canManage && !isCurrent && member.role !== "owner" ? (
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Remove ${member.user.name}`}
                              />
                            }
                          >
                            <Trash2 />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove {member.user.name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                They will immediately lose access to this workspace.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={async () => {
                                  if (!organizationId) return;
                                  const result = await authClient.organization.removeMember({
                                    memberIdOrEmail: member.id,
                                    organizationId,
                                  });
                                  if (result.error) {
                                    toast.error(result.error.message || result.error.statusText);
                                    return;
                                  }
                                  await organization.refetch();
                                  toast.success("Member removed.");
                                }}
                              >
                                Remove member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SettingsPage>
  );
}
