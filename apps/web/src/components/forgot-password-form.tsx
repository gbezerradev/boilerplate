"use client";

import { Button } from "@boilerplate/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@boilerplate/ui/components/input-group";
import { useForm } from "@tanstack/react-form";
import { AtSignIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: `${window.location.origin}/reset-password`,
        },
        {
          onSuccess: () => {
            toast.success("If that account exists, a password reset link is on its way.");
            form.reset();
          },
          onError: ({ error }) => {
            toast.error(error.message || error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Enter a valid email address"),
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
        <form.Field name="email">
          {(field) => {
            const isInvalid = field.state.meta.errors.length > 0;

            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <AtSignIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
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
              {isSubmitting ? "Sending link…" : "Send reset link"}
            </Button>
          )}
        </form.Subscribe>
        <Button
          type="button"
          className="w-full"
          variant="outline"
          onClick={() => router.push("/login")}
        >
          Back to sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
