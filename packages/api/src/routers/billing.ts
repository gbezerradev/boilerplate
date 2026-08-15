import {
  createCheckoutSession,
  createPortalSession,
  getOrganizationEntitlements,
  isBillingEnabled,
} from "@boilerplate/billing";
import { recordAuditEvent } from "@boilerplate/audit";
import { TRPCError } from "@trpc/server";

import { billingManageProcedure, organizationProcedure, router } from "../index";

export const billingRouter = router({
  status: organizationProcedure.query(async ({ ctx }) => ({
    enabled: isBillingEnabled(),
    entitlements: await getOrganizationEntitlements(ctx.organizationId),
  })),
  checkout: billingManageProcedure.mutation(async ({ ctx }) => {
    if (!isBillingEnabled()) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Billing is disabled" });
    }

    const url = await createCheckoutSession({
      organizationId: ctx.organizationId,
      email: ctx.session.user.email,
      name: ctx.session.user.name,
    });

    await recordAuditEvent({
      organizationId: ctx.organizationId,
      actorUserId: ctx.session.user.id,
      action: "billing.checkout_created",
      resourceType: "billing",
      ipAddress: ctx.requestHeaders.get("x-connection-ip"),
      userAgent: ctx.requestHeaders.get("user-agent"),
    });

    return { url };
  }),
  portal: billingManageProcedure.mutation(async ({ ctx }) => {
    if (!isBillingEnabled()) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Billing is disabled" });
    }

    const url = await createPortalSession(ctx.organizationId);
    await recordAuditEvent({
      organizationId: ctx.organizationId,
      actorUserId: ctx.session.user.id,
      action: "billing.portal_opened",
      resourceType: "billing",
      ipAddress: ctx.requestHeaders.get("x-connection-ip"),
      userAgent: ctx.requestHeaders.get("user-agent"),
    });
    return { url };
  }),
});
