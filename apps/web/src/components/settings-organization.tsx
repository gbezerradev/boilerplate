"use client";

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
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { SettingsPage } from "./settings-profile";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export default function SettingsOrganization() {
  const organization = authClient.useActiveOrganization();
  const session = authClient.useSession();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!organization.data) return;
    setName(organization.data.name);
    setSlug(organization.data.slug);
  }, [organization.data]);

  const currentMember = organization.data?.members.find(
    (member) => member.userId === session.data?.user.id,
  );
  const canManage = currentMember?.role === "owner" || currentMember?.role === "admin";

  return (
    <SettingsPage title="Workspace" description="Update the identity of the active workspace.">
      <Card>
        <CardHeader>
          <CardTitle>Workspace details</CardTitle>
          <CardDescription>Changes apply to every member of this workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!organization.data || !canManage) return;
              setSaving(true);
              const result = await authClient.organization.update({
                organizationId: organization.data.id,
                data: { name: name.trim(), slug: slugify(slug) },
              });
              setSaving(false);
              if (result.error) {
                toast.error(result.error.message || result.error.statusText);
                return;
              }
              await organization.refetch();
              toast.success("Workspace updated.");
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
                <Input
                  id="workspace-name"
                  name="workspaceName"
                  autoComplete="organization"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={!canManage}
                  maxLength={100}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="workspace-slug">Slug</FieldLabel>
                <Input
                  id="workspace-slug"
                  name="workspaceSlug"
                  autoComplete="off"
                  spellCheck={false}
                  value={slug}
                  onChange={(event) => setSlug(slugify(event.target.value))}
                  disabled={!canManage}
                  pattern="[a-z0-9-]+"
                  required
                />
                <FieldDescription>Used in human-readable workspace URLs.</FieldDescription>
              </Field>
            </FieldGroup>
            {canManage ? (
              <Button type="submit" className="w-fit" disabled={saving || !name.trim() || !slug}>
                {saving ? "Saving…" : "Save workspace"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Only workspace owners and admins can edit these details.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </SettingsPage>
  );
}
