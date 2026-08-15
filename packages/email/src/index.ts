import { env } from "@boilerplate/env/server";
import { createElement } from "react";
import { render, toPlainText } from "react-email";

import { createEmailProvider, type EmailProvider } from "./provider";
import { AuthEmail } from "./templates/auth-email";

interface AuthEmailInput {
  to: string;
  name?: string;
  url: string;
}

interface OrganizationInvitationEmailInput extends AuthEmailInput {
  organizationName: string;
  inviterName: string;
}

interface SendAuthEmailInput extends AuthEmailInput {
  subject: string;
  preview: string;
  heading: string;
  body: string;
  actionLabel: string;
}

async function sendAuthEmail(input: SendAuthEmailInput, provider = createEmailProvider()) {
  const html = await render(
    createElement(AuthEmail, {
      preview: input.preview,
      heading: input.heading,
      body: input.body,
      actionLabel: input.actionLabel,
      actionUrl: input.url,
      recipientName: input.name,
    }),
  );

  await provider.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: input.subject,
    html,
    text: toPlainText(html),
  });
}

export function sendVerificationEmail(input: AuthEmailInput, provider?: EmailProvider) {
  return sendAuthEmail(
    {
      ...input,
      subject: "Verify your email address",
      preview: "Confirm your email address to activate your account.",
      heading: "Verify your email address",
      body: "Confirm your email address to finish creating your account.",
      actionLabel: "Verify email",
    },
    provider,
  );
}

export function sendPasswordResetEmail(input: AuthEmailInput, provider?: EmailProvider) {
  return sendAuthEmail(
    {
      ...input,
      subject: "Reset your password",
      preview: "Use this secure link to choose a new password.",
      heading: "Reset your password",
      body: "We received a request to reset your password. This link will expire for your security.",
      actionLabel: "Reset password",
    },
    provider,
  );
}

export function sendOrganizationInvitationEmail(
  input: OrganizationInvitationEmailInput,
  provider?: EmailProvider,
) {
  return sendAuthEmail(
    {
      ...input,
      subject: `You are invited to ${input.organizationName}`,
      preview: `${input.inviterName} invited you to join ${input.organizationName}.`,
      heading: `Join ${input.organizationName}`,
      body: `${input.inviterName} invited you to collaborate in their workspace. Sign in with this email address to accept the invitation.`,
      actionLabel: "Accept invitation",
    },
    provider,
  );
}

export { assertEmailConfiguration, createEmailProvider } from "./provider";
export type { EmailMessage, EmailProvider } from "./provider";
