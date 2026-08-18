"use client";

import { Button } from "@boilerplate/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@boilerplate/ui/components/input-group";
import { useForm } from "@tanstack/react-form";
import { Building2Icon, LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

function createSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateOrganizationForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.organization.create(
        {
          name: value.name.trim(),
          slug: value.slug,
        },
        {
          onSuccess: () => {
            toast.success("Workspace created.");
            router.push("/dashboard");
            router.refresh();
          },
          onError: ({ error }) => {
            toast.error(error.message || error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().trim().min(2, "Workspace name must be at least 2 characters"),
        slug: z
          .string()
          .min(2, "Slug must be at least 2 characters")
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
      }),
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid = field.state.meta.errors.length > 0;

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>Workspace name</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Building2Icon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    autoComplete="organization"
                    placeholder="Acme Inc."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value);
                      form.setFieldValue("slug", createSlug(event.target.value));
                    }}
                    aria-invalid={isInvalid}
                  />
                </InputGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="slug">
          {(field) => {
            const isInvalid = field.state.meta.errors.length > 0;

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>Workspace slug</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <LinkIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="acme-inc"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(createSlug(event.target.value))}
                    aria-invalid={isInvalid}
                  />
                </InputGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            );
          }}
        </form.Field>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ canSubmit, isSubmitting }) => (
            <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Creating workspace…" : "Create workspace"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
