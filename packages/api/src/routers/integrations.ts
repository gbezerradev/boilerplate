import { recordAuditEvent } from "@boilerplate/audit";
import { db } from "@boilerplate/db";
import { webhookDelivery, webhookEndpoint } from "@boilerplate/db/schema/product";
import {
  createWebhookSecret,
  encryptWebhookSecret,
  publishWebhookEvent,
  validateWebhookUrl,
  webhookEventTypes,
} from "@boilerplate/integrations";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { integrationManageProcedure, integrationReadProcedure, router } from "../index";

const endpointInput = z
  .object({
    name: z.string().trim().min(2).max(80),
    url: z.url(),
    events: z.array(z.enum(webhookEventTypes)).min(1).max(webhookEventTypes.length),
  })
  .strict();
const endpointIdInput = z.object({ id: z.string().min(1) }).strict();

export const integrationsRouter = router({
  list: integrationReadProcedure.query(async ({ ctx }) => {
    const [endpoints, deliveries] = await Promise.all([
      db
        .select({
          id: webhookEndpoint.id,
          name: webhookEndpoint.name,
          url: webhookEndpoint.url,
          events: webhookEndpoint.events,
          active: webhookEndpoint.active,
          createdAt: webhookEndpoint.createdAt,
        })
        .from(webhookEndpoint)
        .where(eq(webhookEndpoint.organizationId, ctx.organizationId))
        .orderBy(desc(webhookEndpoint.createdAt)),
      db
        .select()
        .from(webhookDelivery)
        .where(eq(webhookDelivery.organizationId, ctx.organizationId))
        .orderBy(desc(webhookDelivery.createdAt))
        .limit(20),
    ]);
    return { endpoints, deliveries, eventTypes: webhookEventTypes };
  }),
  create: integrationManageProcedure.input(endpointInput).mutation(async ({ ctx, input }) => {
    const url = await validateWebhookUrl(input.url);
    const secret = createWebhookSecret();
    const [endpoint] = await db
      .insert(webhookEndpoint)
      .values({
        id: crypto.randomUUID(),
        organizationId: ctx.organizationId,
        name: input.name,
        url,
        events: [...new Set(input.events)],
        secretEncrypted: encryptWebhookSecret(secret),
      })
      .returning({
        id: webhookEndpoint.id,
        name: webhookEndpoint.name,
        url: webhookEndpoint.url,
        events: webhookEndpoint.events,
      });
    if (!endpoint) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    await recordAuditEvent({
      organizationId: ctx.organizationId,
      actorUserId: ctx.session.user.id,
      action: "webhook.created",
      resourceType: "webhook",
      resourceId: endpoint.id,
      metadata: { name: endpoint.name, events: endpoint.events },
    });
    return { ...endpoint, secret };
  }),
  delete: integrationManageProcedure.input(endpointIdInput).mutation(async ({ ctx, input }) => {
    const [deleted] = await db
      .delete(webhookEndpoint)
      .where(
        and(
          eq(webhookEndpoint.id, input.id),
          eq(webhookEndpoint.organizationId, ctx.organizationId),
        ),
      )
      .returning({ id: webhookEndpoint.id, name: webhookEndpoint.name });
    if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Webhook not found" });
    await recordAuditEvent({
      organizationId: ctx.organizationId,
      actorUserId: ctx.session.user.id,
      action: "webhook.deleted",
      resourceType: "webhook",
      resourceId: deleted.id,
      metadata: { name: deleted.name },
    });
    return { id: deleted.id };
  }),
  test: integrationManageProcedure.input(endpointIdInput).mutation(async ({ ctx, input }) => {
    const [endpoint] = await db
      .select({ id: webhookEndpoint.id })
      .from(webhookEndpoint)
      .where(
        and(
          eq(webhookEndpoint.id, input.id),
          eq(webhookEndpoint.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);
    if (!endpoint) throw new TRPCError({ code: "NOT_FOUND", message: "Webhook not found" });
    const eventId = crypto.randomUUID();
    await publishWebhookEvent(
      {
        id: eventId,
        type: "project.created",
        organizationId: ctx.organizationId,
        createdAt: new Date().toISOString(),
        data: { test: true },
      },
      endpoint.id,
    );
    return { eventId };
  }),
});
