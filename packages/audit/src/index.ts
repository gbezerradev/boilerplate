import { db } from "@boilerplate/db";
import { auditLog } from "@boilerplate/db/schema/operations";

export interface AuditEventInput {
  organizationId?: string | null;
  actorUserId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export function createAuditEvent(input: AuditEventInput) {
  return {
    id: crypto.randomUUID(),
    organizationId: input.organizationId ?? null,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    resourceType: input.resourceType,
    resourceId: input.resourceId ?? null,
    metadata: sanitizeMetadata(input.metadata ?? {}),
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent?.slice(0, 500) ?? null,
  };
}

export async function recordAuditEvent(input: AuditEventInput) {
  const [event] = await db.insert(auditLog).values(createAuditEvent(input)).returning();
  return event;
}

function sanitizeMetadata(metadata: Record<string, unknown>) {
  return sanitizeObject(metadata);
}

function sanitizeObject(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !/(password|secret|token|authorization|cookie)/i.test(key))
      .map(([key, item]) => [key, sanitizeValue(item)]),
  );
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") return sanitizeObject(value as Record<string, unknown>);
  return value;
}
