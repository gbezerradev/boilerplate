import {
  sendOrganizationInvitationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@boilerplate/email";
import { env } from "@boilerplate/env/server";
import { runJobBatch, type JobHandler } from "@boilerplate/jobs";
import { deliverWebhookJob } from "@boilerplate/integrations";
import { z } from "zod";

const authEmailSchema = z.object({ to: z.email(), name: z.string(), url: z.url() });
const invitationSchema = z.object({
  to: z.email(),
  url: z.url(),
  organizationName: z.string(),
  inviterName: z.string(),
});

const handlers: Record<string, JobHandler> = {
  "webhook.deliver": deliverWebhookJob,
  "email.password-reset": async (payload) => sendPasswordResetEmail(authEmailSchema.parse(payload)),
  "email.verification": async (payload) => sendVerificationEmail(authEmailSchema.parse(payload)),
  "email.organization-invitation": async (payload) =>
    sendOrganizationInvitationEmail(invitationSchema.parse(payload)),
};

const workerId = `${process.env.HOSTNAME ?? "local"}:${process.pid}:${crypto.randomUUID()}`;
let stopping = false;

async function work() {
  while (!stopping) {
    try {
      const processed = await runJobBatch({
        workerId,
        handlers,
        batchSize: env.JOB_BATCH_SIZE,
      });
      if (processed > 0) continue;
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          event: "worker.batch_failed",
          message: error instanceof Error ? error.message : "Unknown worker error",
        }),
      );
    }
    await new Promise((resolve) => setTimeout(resolve, env.JOB_POLL_INTERVAL_MS));
  }
}

function stop(signal: string) {
  stopping = true;
  console.info(JSON.stringify({ level: "info", event: "worker.stopping", signal, workerId }));
}

process.once("SIGINT", () => stop("SIGINT"));
process.once("SIGTERM", () => stop("SIGTERM"));

console.info(JSON.stringify({ level: "info", event: "worker.started", workerId }));
await work();
