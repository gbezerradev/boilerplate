import { auth } from "@boilerplate/auth";
import { isPlatformAdminEmail } from "@boilerplate/auth/platform-admin";
import { getOrganizationEntitlements } from "@boilerplate/billing";
import { initTRPC, TRPCError } from "@trpc/server";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const organizationProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.organizationId || !ctx.member) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Select an organization before accessing this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      organizationId: ctx.organizationId,
      member: ctx.member,
    },
  });
});

export const billingManageProcedure = organizationProcedure.use(async ({ ctx, next }) => {
  const permission = await auth.api.hasPermission({
    headers: ctx.requestHeaders,
    body: {
      organizationId: ctx.organizationId,
      permissions: {
        billing: ["manage"],
      },
    },
  });

  if (!permission.success) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Owner permission is required to manage billing",
    });
  }

  return next({ ctx });
});

export const auditReadProcedure = organizationProcedure.use(async ({ ctx, next }) => {
  const [permission, entitlements] = await Promise.all([
    auth.api.hasPermission({
      headers: ctx.requestHeaders,
      body: { organizationId: ctx.organizationId, permissions: { audit: ["read"] } },
    }),
    getOrganizationEntitlements(ctx.organizationId),
  ]);

  if (!permission.success) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin permission is required" });
  }
  if (!entitlements.auditLog) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Audit logs require the Pro plan" });
  }

  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!isPlatformAdminEmail(ctx.session.user.email)) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Platform administrator access required" });
  }
  return next({ ctx });
});

export const integrationReadProcedure = organizationProcedure.use(async ({ ctx, next }) => {
  const permission = await auth.api.hasPermission({
    headers: ctx.requestHeaders,
    body: {
      organizationId: ctx.organizationId,
      permissions: { integrations: ["read"] },
    },
  });
  if (!permission.success) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Integration permission required" });
  }
  return next({ ctx });
});

export const integrationManageProcedure = organizationProcedure.use(async ({ ctx, next }) => {
  const permission = await auth.api.hasPermission({
    headers: ctx.requestHeaders,
    body: {
      organizationId: ctx.organizationId,
      permissions: { integrations: ["manage"] },
    },
  });
  if (!permission.success) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Integration permission required" });
  }
  return next({ ctx });
});
