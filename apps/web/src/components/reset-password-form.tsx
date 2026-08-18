"use client";

import { Button } from "@boilerplate/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@boilerplate/ui/components/input-group";
import { useForm } from "@tanstack/react-form";
import { LockKeyholeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.resetPassword(
        {
          newPassword: value.password,
          token,
        },
        {
          onSuccess: () => {
            router.push("/login?reset=true");
          },
          onError: ({ error }) => {
            toast.error(error.message || error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters"),
          passwordConfirmation: z.string().min(8, "Confirm your new password"),
        })
        .refine((value) => value.password === value.passwordConfirmation, {
          message: "Passwords do not match",
          path: ["passwordConfirmation"],
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
        <form.Field name="password">
          {(field) => {
            const isInvalid = field.state.meta.errors.length > 0;

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <LockKeyholeIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                  />
                </InputGroup>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="passwordConfirmation">
          {(field) => {
            const isInvalid = field.state.meta.errors.length > 0;

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>Confirm new password</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <LockKeyholeIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
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
              {isSubmitting ? "Updating password…" : "Update password"}
            </Button>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}
