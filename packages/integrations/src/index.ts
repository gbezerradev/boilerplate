import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import { db } from "@boilerplate/db";
import { webhookDelivery, webhookEndpoint } from "@boilerplate/db/schema/product";
import { env } from "@boilerplate/env/server";
import { enqueueJob, type JobHandler } from "@boilerplate/jobs";
import { and, eq } from "drizzle-orm";

export const webhookEventTypes = ["project.created", "project.deleted"] as const;
export type WebhookEventType = (typeof webhookEventTypes)[number];

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  organizationId: string;
  createdAt: string;
  data: Record<string, unknown>;
}

function encryptionKey() {
  return createHash("sha256").update(`boilerplate:webhooks:${env.BETTER_AUTH_SECRET}`).digest();
}

export function createWebhookSecret() {
  return `whsec_${randomBytes(32).toString("base64url")}`;
}

export function encryptWebhookSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function decryptWebhookSecret(value: string) {
  const payload = Buffer.from(value, "base64url");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), payload.subarray(0, 12));
  decipher.setAuthTag(payload.subarray(12, 28));
  return Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8");
}

export function createWebhookSignature(secret: string, timestamp: string, body: string) {
  return `v1=${createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex")}`;
}

export function isPrivateAddress(address: string) {
  if (isIP(address) === 4) {
    const [a = 0, b = 0] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  const normalized = address.toLowerCase();
  if (normalized.startsWith("::ffff:")) return isPrivateAddress(normalized.slice(7));
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith("2001:db8")
  );
}

export async function validateWebhookUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error("Webhook URLs must use HTTPS without embedded credentials");
  }
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    throw new Error("Private webhook hosts are not allowed");
  }
  const addresses = await lookup(hostname, { all: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Webhook host resolves to a private or reserved address");
  }
  return url.toString();
}

export async function publishWebhookEvent(event: WebhookEvent, targetEndpointId?: string) {
  const endpoints = await db
    .select()
    .from(webhookEndpoint)
    .where(
      and(
        eq(webhookEndpoint.organizationId, event.organizationId),
        eq(webhookEndpoint.active, true),
      ),
    );

  await Promise.all(
    endpoints
      .filter(
        (endpoint) =>
          endpoint.events.includes(event.type) &&
          (!targetEndpointId || endpoint.id === targetEndpointId),
      )
      .map(async (endpoint) => {
        const deliveryId = crypto.randomUUID();
        const [delivery] = await db
          .insert(webhookDelivery)
          .values({
            id: deliveryId,
            organizationId: event.organizationId,
            endpointId: endpoint.id,
            eventId: event.id,
            eventType: event.type,
          })
          .onConflictDoNothing()
          .returning({ id: webhookDelivery.id });
        if (!delivery) return;
        await enqueueJob({
          type: "webhook.deliver",
          organizationId: event.organizationId,
          idempotencyKey: `webhook:${event.id}:${endpoint.id}`,
          payload: { deliveryId, endpointId: endpoint.id, event },
        });
      }),
  );
}

export const deliverWebhookJob: JobHandler = async (payload) => {
  const deliveryId = typeof payload.deliveryId === "string" ? payload.deliveryId : undefined;
  const endpointId = typeof payload.endpointId === "string" ? payload.endpointId : undefined;
  const event = payload.event as WebhookEvent | undefined;
  if (!deliveryId || !endpointId || !event?.id || !event.type)
    throw new Error("Invalid webhook job");

  const [endpoint] = await db
    .select()
    .from(webhookEndpoint)
    .where(and(eq(webhookEndpoint.id, endpointId), eq(webhookEndpoint.active, true)))
    .limit(1);
  if (!endpoint) throw new Error("Webhook endpoint is missing or inactive");

  const url = await validateWebhookUrl(endpoint.url);
  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1_000).toString();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "boilerplate-webhooks/1.0",
        "x-webhook-id": event.id,
        "x-webhook-timestamp": timestamp,
        "x-webhook-signature": createWebhookSignature(
          decryptWebhookSecret(endpoint.secretEncrypted),
          timestamp,
          body,
        ),
      },
      body,
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Webhook returned status ${response.status}`);
    await db
      .update(webhookDelivery)
      .set({ status: "succeeded", responseStatus: response.status, completedAt: new Date() })
      .where(eq(webhookDelivery.id, deliveryId));
  } catch (error) {
    await db
      .update(webhookDelivery)
      .set({
        status: "failed",
        lastError: error instanceof Error ? error.message.slice(0, 2_000) : "Unknown error",
      })
      .where(eq(webhookDelivery.id, deliveryId));
    throw error;
  }
};
