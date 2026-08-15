import { env } from "@boilerplate/env/server";
import Stripe from "stripe";

import { assertBillingConfiguration } from "./config";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  assertBillingConfiguration();
  stripeClient ??= new Stripe(env.STRIPE_SECRET_KEY!);
  return stripeClient;
}

export async function constructStripeEvent(
  payload: string,
  signature: string,
  overrides?: { client: Stripe; webhookSecret: string },
) {
  const client = overrides?.client ?? getStripeClient();
  const webhookSecret = overrides?.webhookSecret ?? env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    assertBillingConfiguration();
    throw new Error("STRIPE_WEBHOOK_SECRET is required");
  }

  return client.webhooks.constructEventAsync(payload, signature, webhookSecret);
}
