"use client";

import { Button, buttonVariants } from "@boilerplate/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@boilerplate/ui/components/input-group";
import { useForm } from "@tanstack/react-form";
import { AtSignIcon, LockKeyholeIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { AuthDivider } from "@/components/auth-divider";
import { authClient } from "@/lib/auth-client";

export default function SignInForm({
  callbackURL,
  onSwitchToSignUp,
}: {
  callbackURL: string;
  onSwitchToSignUp: () => void;
}) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push(callbackURL as Route);
            toast.success("Signed in successfully");
          },
          onError: ({ error }) => {
            const message =
              error.code === "EMAIL_NOT_VERIFIED"
                ? "Verify your email address before signing in."
                : error.message || error.statusText;
            toast.error(message);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  return (
    <div className="flex flex-col gap-4">
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

          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={isInvalid || undefined}>
                  <div className="flex items-center justify-between gap-4">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className={buttonVariants({ variant: "link", size: "xs" })}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <LockKeyholeIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
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
                {isSubmitting ? "Signing in…" : "Continue with email"}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <AuthDivider>NEW HERE?</AuthDivider>

      <Button type="button" className="w-full" variant="outline" onClick={onSwitchToSignUp}>
        Create an account
      </Button>
    </div>
  );
}
