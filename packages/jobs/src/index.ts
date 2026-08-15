import { db } from "@boilerplate/db";
import { backgroundJob } from "@boilerplate/db/schema/operations";
import { and, asc, eq, inArray, lt, lte, or, sql } from "drizzle-orm";

export type JobPayload = Record<string, unknown>;
export type JobHandler = (payload: JobPayload, job: ClaimedJob) => Promise<void>;
export type ClaimedJob = typeof backgroundJob.$inferSelect;

export interface EnqueueJobInput {
  type: string;
  payload: JobPayload;
  organizationId?: string | null;
  queue?: string;
  idempotencyKey?: string;
  maxAttempts?: number;
  runAt?: Date;
}

export async function enqueueJob(input: EnqueueJobInput) {
  const [job] = await db
    .insert(backgroundJob)
    .values({
      id: crypto.randomUUID(),
      type: input.type,
      payload: input.payload,
      organizationId: input.organizationId ?? null,
      queue: input.queue ?? "default",
      idempotencyKey: input.idempotencyKey,
      maxAttempts: input.maxAttempts ?? 5,
      runAt: input.runAt ?? new Date(),
    })
    .onConflictDoNothing({ target: backgroundJob.idempotencyKey })
    .returning();

  if (job) return job;
  if (!input.idempotencyKey) throw new Error("Job could not be enqueued");

  const [existing] = await db
    .select()
    .from(backgroundJob)
    .where(eq(backgroundJob.idempotencyKey, input.idempotencyKey))
    .limit(1);
  return existing;
}

export async function claimJobs({
  workerId,
  queue = "default",
  limit = 10,
  now = new Date(),
  lockTimeoutMs = 5 * 60_000,
}: {
  workerId: string;
  queue?: string;
  limit?: number;
  now?: Date;
  lockTimeoutMs?: number;
}) {
  const staleAt = new Date(now.getTime() - lockTimeoutMs);

  return db.transaction(async (tx) => {
    const candidates = await tx
      .select()
      .from(backgroundJob)
      .where(
        and(
          eq(backgroundJob.queue, queue),
          lte(backgroundJob.runAt, now),
          or(
            eq(backgroundJob.status, "pending"),
            and(eq(backgroundJob.status, "processing"), lt(backgroundJob.lockedAt, staleAt)),
          ),
        ),
      )
      .orderBy(asc(backgroundJob.runAt), asc(backgroundJob.createdAt))
      .limit(limit)
      .for("update", { skipLocked: true });

    if (candidates.length === 0) return [];

    return tx
      .update(backgroundJob)
      .set({
        status: "processing",
        lockedAt: now,
        lockedBy: workerId,
        attempts: sql`${backgroundJob.attempts} + 1`,
        lastError: null,
      })
      .where(
        inArray(
          backgroundJob.id,
          candidates.map((job) => job.id),
        ),
      )
      .returning();
  });
}

export async function completeJob(jobId: string, workerId: string) {
  await db
    .update(backgroundJob)
    .set({ status: "succeeded", completedAt: new Date(), lockedAt: null, lockedBy: null })
    .where(and(eq(backgroundJob.id, jobId), eq(backgroundJob.lockedBy, workerId)));
}

export async function failJob(job: ClaimedJob, workerId: string, error: unknown) {
  const retry = job.attempts < job.maxAttempts;
  await db
    .update(backgroundJob)
    .set({
      status: retry ? "pending" : "failed",
      runAt: retry ? new Date(Date.now() + retryDelayMs(job.attempts)) : job.runAt,
      lastError: error instanceof Error ? error.message.slice(0, 2_000) : "Unknown job error",
      lockedAt: null,
      lockedBy: null,
    })
    .where(and(eq(backgroundJob.id, job.id), eq(backgroundJob.lockedBy, workerId)));
}

export function retryDelayMs(attempt: number) {
  return Math.min(60 * 60_000, 1_000 * 2 ** Math.max(0, attempt - 1));
}

export async function runJobBatch({
  workerId,
  handlers,
  batchSize = 10,
}: {
  workerId: string;
  handlers: Record<string, JobHandler>;
  batchSize?: number;
}) {
  const jobs = await claimJobs({ workerId, limit: batchSize });
  await Promise.all(
    jobs.map(async (job) => {
      const handler = handlers[job.type];
      if (!handler) {
        await failJob(job, workerId, new Error(`No handler registered for ${job.type}`));
        return;
      }
      try {
        await handler(job.payload, job);
        await completeJob(job.id, workerId);
      } catch (error) {
        await failJob(job, workerId, error);
      }
    }),
  );
  return jobs.length;
}
