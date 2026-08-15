import { db } from "@boilerplate/db";
import { user } from "@boilerplate/db/schema/auth";
import { auditLog } from "@boilerplate/db/schema/operations";
import { and, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { auditReadProcedure, router } from "../index";

const listAuditInput = z
  .object({
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).default(0),
    action: z.string().min(1).max(100).optional(),
  })
  .strict()
  .default({ limit: 50, offset: 0 });

export const auditRouter = router({
  list: auditReadProcedure.input(listAuditInput).query(async ({ ctx, input }) => {
    const filter = and(
      eq(auditLog.organizationId, ctx.organizationId),
      input.action ? eq(auditLog.action, input.action) : undefined,
    );
    const [events, totalRows] = await Promise.all([
      db
        .select({
          id: auditLog.id,
          action: auditLog.action,
          resourceType: auditLog.resourceType,
          resourceId: auditLog.resourceId,
          metadata: auditLog.metadata,
          ipAddress: auditLog.ipAddress,
          createdAt: auditLog.createdAt,
          actorName: user.name,
          actorEmail: user.email,
        })
        .from(auditLog)
        .leftJoin(user, eq(user.id, auditLog.actorUserId))
        .where(filter)
        .orderBy(desc(auditLog.createdAt))
        .limit(input.limit)
        .offset(input.offset),
      db.select({ value: count() }).from(auditLog).where(filter),
    ]);

    return { events, total: totalRows[0]?.value ?? 0 };
  }),
});
