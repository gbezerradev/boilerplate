import { relations } from "drizzle-orm";
import { index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { organization, user } from "./auth";

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "set null",
    }),
    actorUserId: text("actor_user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_log_organization_created_at_idx").on(table.organizationId, table.createdAt),
    index("audit_log_actor_user_id_idx").on(table.actorUserId),
    index("audit_log_action_idx").on(table.action),
  ],
);

export const backgroundJob = pgTable(
  "background_job",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "set null",
    }),
    queue: text("queue").default("default").notNull(),
    type: text("type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    status: text("status").default("pending").notNull(),
    idempotencyKey: text("idempotency_key"),
    attempts: integer("attempts").default(0).notNull(),
    maxAttempts: integer("max_attempts").default(5).notNull(),
    runAt: timestamp("run_at").defaultNow().notNull(),
    lockedAt: timestamp("locked_at"),
    lockedBy: text("locked_by"),
    lastError: text("last_error"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("background_job_idempotency_key_uidx").on(table.idempotencyKey),
    index("background_job_claim_idx").on(table.queue, table.status, table.runAt),
    index("background_job_organization_id_idx").on(table.organizationId),
  ],
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  organization: one(organization, {
    fields: [auditLog.organizationId],
    references: [organization.id],
  }),
  actor: one(user, {
    fields: [auditLog.actorUserId],
    references: [user.id],
  }),
}));

export const backgroundJobRelations = relations(backgroundJob, ({ one }) => ({
  organization: one(organization, {
    fields: [backgroundJob.organizationId],
    references: [organization.id],
  }),
}));
