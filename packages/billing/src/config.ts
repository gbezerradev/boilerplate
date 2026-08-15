import { env } from "@boilerplate/env/server";

export function isBillingEnabled() {
  return env.BILLING_PROVIDER === "stripe";
}

export function assertBillingConfiguration() {
  if (!isBillingEnabled()) {
    throw new Error("Billing is disabled");
  }

  const missing = [
    ["STRIPE_SECRET_KEY", env.STRIPE_SECRET_KEY],
    ["STRIPE_WEBHOOK_SECRET", env.STRIPE_WEBHOOK_SECRET],
    ["STRIPE_PRICE_PRO", env.STRIPE_PRICE_PRO],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing Stripe configuration: ${missing.join(", ")}`);
  }
}
