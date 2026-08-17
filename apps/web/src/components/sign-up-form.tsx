"use client";

import { Button } from "@boilerplate/ui/components/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@boilerplate/ui/components/input-group";
import { useForm } from "@tanstack/react-form";
import { AtSignIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { AuthDivider } from "@/components/auth-divider";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm({
  callbackURL,
  onSwitchToSignIn,
}: {
  callbackURL: string;
  onSwitchToSignIn: () => void;
}) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      const verificationCallback = new URL("/login", window.location.origin);
      verificationCallback.searchParams.set("verified", "true");
      verificationCallback.searchParams.set("callbackURL", callbackURL);

      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          callbackURL: verificationCallback.toString(),
        },
        {
          onSuccess: () => {
            toast.success("Check your inbox to verify your email address.");
            onSwitchToSignIn();
          },
          onError: ({ error }) => {
            toast.error(error.message || error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        name: z.string().trim().min(2, "Name must be at least 2 characters"),
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
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.errors.length > 0;

              return (
                <Field data-invalid={isInvalid || undefined}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <UserRoundIcon />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      autoComplete="name"
                      placeholder="Your name"
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
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
              <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <AuthDivider>ALREADY A MEMBER?</AuthDivider>

      <Button type="button" className="w-full" variant="outline" onClick={onSwitchToSignIn}>
        Back to sign in
      </Button>
    </div>
  );
}
