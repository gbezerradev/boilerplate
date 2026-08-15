"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@boilerplate/ui/components/avatar";
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function SettingsProfile() {
  const session = authClient.useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session.data?.user) return;
    setName(session.data.user.name);
    setImage(session.data.user.image ?? "");
  }, [session.data?.user]);

  const user = session.data?.user;

  return (
    <SettingsPage title="Profile" description="Manage your personal account information.">
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>
          <CardDescription>
            This information is visible to your workspace teammates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-6"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!name.trim()) return;
              setSaving(true);
              const result = await authClient.updateUser({
                name: name.trim(),
                image: image.trim() || null,
              });
              setSaving(false);
              if (result.error) {
                toast.error(result.error.message || result.error.statusText);
                return;
              }
              await session.refetch();
              toast.success("Profile updated.");
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                {image ? <AvatarImage src={image} alt="" /> : null}
                <AvatarFallback>{initials(name || "User")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Profile picture</p>
                <p className="text-xs text-muted-foreground">Use a public HTTPS image URL.</p>
              </div>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                <Input
                  id="profile-name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                <Input id="profile-email" name="email" value={user?.email ?? ""} disabled />
                <FieldDescription>
                  Email changes require a separate verified-email workflow.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-image">Image URL</FieldLabel>
                <Input
                  id="profile-image"
                  name="imageUrl"
                  type="url"
                  autoComplete="off"
                  spellCheck={false}
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  placeholder="https://example.com/avatar.png"
                />
              </Field>
            </FieldGroup>
            <Button type="submit" className="w-fit" disabled={saving || !name.trim()}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </SettingsPage>
  );
}

export function SettingsPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid max-w-3xl gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      {children}
    </div>
  );
}
