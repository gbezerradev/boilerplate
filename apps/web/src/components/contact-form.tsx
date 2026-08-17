"use client";

import { Button } from "@boilerplate/ui/components/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@boilerplate/ui/components/field";
import { Input } from "@boilerplate/ui/components/input";
import { Textarea } from "@boilerplate/ui/components/textarea";
import { CheckCircle2Icon, SendIcon } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-first-name">First name</FieldLabel>
            <Input
              autoComplete="given-name"
              id="contact-first-name"
              name="firstName"
              placeholder="Jane"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-last-name">Last name</FieldLabel>
            <Input
              autoComplete="family-name"
              id="contact-last-name"
              name="lastName"
              placeholder="Doe"
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="contact-email">Work email</FieldLabel>
          <Input
            autoComplete="email"
            id="contact-email"
            name="email"
            placeholder="jane@company.com"
            required
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-company">Company</FieldLabel>
          <Input
            autoComplete="organization"
            id="contact-company"
            name="company"
            placeholder="Acme Inc."
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Tell us what you are building and how we can help."
            required
            rows={5}
          />
          <FieldDescription>
            Demo handler included. Connect it to your support or CRM provider before launch.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Button className="mt-8 w-full" type="submit">
        <SendIcon data-icon="inline-start" />
        Send message
      </Button>

      {submitted ? (
        <p
          className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-sm"
          role="status"
        >
          <CheckCircle2Icon className="size-4" />
          Form validated. Add your delivery provider to send messages.
        </p>
      ) : null}
    </form>
  );
}
