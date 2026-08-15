import { getOrganizationEntitlements } from "@boilerplate/billing";
import { db } from "@boilerplate/db";
import * as schema from "@boilerplate/db/schema/auth";
import {
  assertEmailConfiguration,
  sendOrganizationInvitationEmail,
  sendPasswordResetEmail as deliverPasswordResetEmail,
  sendVerificationEmail as deliverVerificationEmail,
} from "@boilerplate/email";
import { env } from "@boilerplate/env/server";
import { enqueueJob } from "@boilerplate/jobs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

import { organizationAccessControl, organizationRoles } from "./permissions";

type EmailJob =
  | { type: "email.password-reset"; payload: { to: string; name: string; url: string } }
  | { type: "email.verification"; payload: { to: string; name: string; url: string } }
  | {
      type: "email.organization-invitation";
      payload: {
        to: string;
        url: string;
        organizationName: string;
        inviterName: string;
      };
      idempotencyKey: string;
    };

async function deliverEmail(job: EmailJob, inline: () => Promise<unknown>) {
  if (env.EMAIL_DELIVERY_MODE === "queued") {
    await enqueueJob({
      type: job.type,
      payload: job.payload,
      idempotencyKey: "idempotencyKey" in job ? job.idempotencyKey : undefined,
    });
    return;
  }

  await inline();
}

function logEmailFailure(kind: string, error: unknown) {
  console.error(
    JSON.stringify({
      level: "error",
      event: "email.failed",
      kind,
      message: error instanceof Error ? error.message : "Unknown email error",
    }),
  );
}

export function createAuth() {
  assertEmailConfiguration();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      async sendResetPassword({ user, url }) {
        void deliverEmail(
          { type: "email.password-reset", payload: { to: user.email, name: user.name, url } },
          () => deliverPasswordResetEmail({ to: user.email, name: user.name, url }),
        ).catch((error) => logEmailFailure("password-reset", error));
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      async sendVerificationEmail({ user, url }) {
        void deliverEmail(
          { type: "email.verification", payload: { to: user.email, name: user.name, url } },
          () => deliverVerificationEmail({ to: user.email, name: user.name, url }),
        ).catch((error) => logEmailFailure("verification", error));
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      ipAddress: {
        ipAddressHeaders: ["x-connection-ip"],
      },
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [
      organization({
        ac: organizationAccessControl,
        roles: organizationRoles,
        organizationLimit: 5,
        membershipLimit: async (_user, currentOrganization) =>
          (await getOrganizationEntitlements(currentOrganization.id)).maxMembers,
        invitationExpiresIn: 60 * 60 * 24 * 7,
        requireEmailVerificationOnInvitation: true,
        async sendInvitationEmail(data) {
          const url = new URL("/accept-invitation", env.CORS_ORIGIN);
          url.searchParams.set("id", data.id);

          const payload = {
            to: data.email,
            url: url.toString(),
            organizationName: data.organization.name,
            inviterName: data.inviter.user.name,
          };
          void deliverEmail(
            {
              type: "email.organization-invitation",
              payload,
              idempotencyKey: `email:organization-invitation:${data.id}`,
            },
            () => sendOrganizationInvitationEmail(payload),
          ).catch((error) => logEmailFailure("organization-invitation", error));
        },
      }),
    ],
  });
}

export const auth = createAuth();
