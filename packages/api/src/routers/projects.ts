import { getOrganizationEntitlements } from "@boilerplate/billing";
import { createAuditEvent } from "@boilerplate/audit";
import { safeCaptureEvent } from "@boilerplate/analytics";
import { db } from "@boilerplate/db";
import { auditLog } from "@boilerplate/db/schema/operations";
import { project } from "@boilerplate/db/schema/project";
import { publishWebhookEvent, type WebhookEventType } from "@boilerplate/integrations";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { organizationProcedure, router } from "../index";

export const createProjectInput = z
  .object({
    name: z.string().trim().min(2).max(120),
  })
  .strict();

export const projectIdInput = z.object({ id: z.string().min(1) }).strict();

function emitProjectEvent(input: {
  type: WebhookEventType;
  organizationId: string;
  userId: string;
  project: { id: string; name?: string };
}) {
  void safeCaptureEvent({
    event: input.type.replace(".", " "),
    distinctId: input.userId,
    properties: { organizationId: input.organizationId, projectId: input.project.id },
  });
  void publishWebhookEvent({
    id: crypto.randomUUID(),
    type: input.type,
    organizationId: input.organizationId,
    createdAt: new Date().toISOString(),
    data: { project: input.project },
  }).catch((error) => {
    console.error(
      JSON.stringify({
        level: "error",
        event: "webhook.publish_failed",
        message: error instanceof Error ? error.message : "Unknown integration error",
      }),
    );
  });
}

export const projectsRouter = router({
  list: organizationProcedure.query(({ ctx }) => {
    return db
      .select()
      .from(project)
      .where(eq(project.organizationId, ctx.organizationId))
      .orderBy(desc(project.createdAt));
  }),
  create: organizationProcedure.input(createProjectInput).mutation(async ({ ctx, input }) => {
    const entitlements = await getOrganizationEntitlements(ctx.organizationId);

    const created = await db.transaction(async (tx) => {
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${ctx.organizationId}, 0))`,
      );
      const [usage] = await tx
        .select({ value: count() })
        .from(project)
        .where(eq(project.organizationId, ctx.organizationId));

      if ((usage?.value ?? 0) >= entitlements.maxProjects) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your ${entitlements.plan} plan allows ${entitlements.maxProjects} projects`,
        });
      }

      const [createdProject] = await tx
        .insert(project)
        .values({
          id: crypto.randomUUID(),
          organizationId: ctx.organizationId,
          name: input.name,
          createdBy: ctx.session.user.id,
        })
        .returning();

      if (!createdProject) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await tx.insert(auditLog).values(
        createAuditEvent({
          organizationId: ctx.organizationId,
          actorUserId: ctx.session.user.id,
          action: "project.created",
          resourceType: "project",
          resourceId: createdProject.id,
          metadata: { name: createdProject.name },
          ipAddress: ctx.requestHeaders.get("x-connection-ip"),
          userAgent: ctx.requestHeaders.get("user-agent"),
        }),
      );

      return createdProject;
    });
    emitProjectEvent({
      type: "project.created",
      organizationId: ctx.organizationId,
      userId: ctx.session.user.id,
      project: { id: created.id, name: created.name },
    });
    return created;
  }),
  delete: organizationProcedure.input(projectIdInput).mutation(async ({ ctx, input }) => {
    const deleted = await db.transaction(async (tx) => {
      const [deletedProject] = await tx
        .delete(project)
        .where(and(eq(project.id, input.id), eq(project.organizationId, ctx.organizationId)))
        .returning({ id: project.id, name: project.name });

      if (!deletedProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      await tx.insert(auditLog).values(
        createAuditEvent({
          organizationId: ctx.organizationId,
          actorUserId: ctx.session.user.id,
          action: "project.deleted",
          resourceType: "project",
          resourceId: deletedProject.id,
          metadata: { name: deletedProject.name },
          ipAddress: ctx.requestHeaders.get("x-connection-ip"),
          userAgent: ctx.requestHeaders.get("user-agent"),
        }),
      );

      return deletedProject;
    });
    emitProjectEvent({
      type: "project.deleted",
      organizationId: ctx.organizationId,
      userId: ctx.session.user.id,
      project: deleted,
    });
    return { id: deleted.id };
  }),
});
