import { createAuditEvent } from "@boilerplate/audit";
import { safeCaptureEvent } from "@boilerplate/analytics";
import { db } from "@boilerplate/db";
import { auditLog } from "@boilerplate/db/schema/operations";
import { storedObject } from "@boilerplate/db/schema/product";
import {
  buildObjectKey,
  createDownloadUrl,
  createUploadUrl,
  deleteObject,
  inspectObject,
  isStorageEnabled,
  maxUploadBytes,
} from "@boilerplate/storage";
import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { organizationProcedure, router } from "../index";

const allowedContentTypes = new Set([
  "application/json",
  "application/pdf",
  "application/zip",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "text/plain",
]);

const uploadInput = z
  .object({
    name: z.string().trim().min(1).max(255),
    contentType: z.string().trim().min(1).max(100),
    size: z.number().int().positive().max(maxUploadBytes),
  })
  .strict();
const objectInput = z.object({ id: z.string().min(1) }).strict();

export const storageRouter = router({
  status: organizationProcedure.query(() => ({ enabled: isStorageEnabled(), maxUploadBytes })),
  list: organizationProcedure.query(({ ctx }) =>
    db
      .select()
      .from(storedObject)
      .where(
        and(eq(storedObject.organizationId, ctx.organizationId), eq(storedObject.status, "ready")),
      )
      .orderBy(desc(storedObject.createdAt)),
  ),
  createUpload: organizationProcedure.input(uploadInput).mutation(async ({ ctx, input }) => {
    if (!isStorageEnabled()) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Storage is disabled" });
    }
    if (!allowedContentTypes.has(input.contentType)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "This file type is not allowed" });
    }
    const id = crypto.randomUUID();
    const key = buildObjectKey(ctx.organizationId, id);
    await db.insert(storedObject).values({
      id,
      key,
      organizationId: ctx.organizationId,
      name: input.name,
      contentType: input.contentType,
      size: input.size,
      uploadedBy: ctx.session.user.id,
    });
    try {
      return {
        id,
        method: "PUT" as const,
        url: await createUploadUrl({
          key,
          contentType: input.contentType,
          organizationId: ctx.organizationId,
        }),
        headers: { "content-type": input.contentType },
      };
    } catch (error) {
      await db.delete(storedObject).where(eq(storedObject.id, id));
      throw error;
    }
  }),
  completeUpload: organizationProcedure.input(objectInput).mutation(async ({ ctx, input }) => {
    const [object] = await db
      .select()
      .from(storedObject)
      .where(
        and(
          eq(storedObject.id, input.id),
          eq(storedObject.organizationId, ctx.organizationId),
          eq(storedObject.status, "pending"),
        ),
      )
      .limit(1);
    if (!object) throw new TRPCError({ code: "NOT_FOUND", message: "Upload not found" });
    const actual = await inspectObject(object.key);
    if (actual.size !== object.size || actual.contentType !== object.contentType) {
      await deleteObject(object.key);
      await db.delete(storedObject).where(eq(storedObject.id, object.id));
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Uploaded file does not match its declaration",
      });
    }
    const [ready] = await db.transaction(async (tx) => {
      const rows = await tx
        .update(storedObject)
        .set({ status: "ready" })
        .where(eq(storedObject.id, object.id))
        .returning();
      await tx.insert(auditLog).values(
        createAuditEvent({
          organizationId: ctx.organizationId,
          actorUserId: ctx.session.user.id,
          action: "file.uploaded",
          resourceType: "file",
          resourceId: object.id,
          metadata: { name: object.name, size: object.size, contentType: object.contentType },
        }),
      );
      return rows;
    });
    void safeCaptureEvent({
      event: "file uploaded",
      distinctId: ctx.session.user.id,
      properties: { organizationId: ctx.organizationId, size: object.size },
    });
    return ready;
  }),
  download: organizationProcedure.input(objectInput).mutation(async ({ ctx, input }) => {
    const [object] = await db
      .select()
      .from(storedObject)
      .where(
        and(
          eq(storedObject.id, input.id),
          eq(storedObject.organizationId, ctx.organizationId),
          eq(storedObject.status, "ready"),
        ),
      )
      .limit(1);
    if (!object) throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
    return { url: await createDownloadUrl(object.key, object.name) };
  }),
  delete: organizationProcedure.input(objectInput).mutation(async ({ ctx, input }) => {
    const [object] = await db
      .select()
      .from(storedObject)
      .where(
        and(eq(storedObject.id, input.id), eq(storedObject.organizationId, ctx.organizationId)),
      )
      .limit(1);
    if (!object) throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
    await deleteObject(object.key);
    await db.transaction(async (tx) => {
      await tx.delete(storedObject).where(eq(storedObject.id, object.id));
      await tx.insert(auditLog).values(
        createAuditEvent({
          organizationId: ctx.organizationId,
          actorUserId: ctx.session.user.id,
          action: "file.deleted",
          resourceType: "file",
          resourceId: object.id,
          metadata: { name: object.name },
        }),
      );
    });
    return { id: object.id };
  }),
});
