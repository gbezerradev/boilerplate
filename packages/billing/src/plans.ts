import { env } from "@boilerplate/env/server";

export type PlanId = "free" | "pro";

export interface Entitlements {
  plan: PlanId;
  maxProjects: number;
  maxMembers: number;
  auditLog: boolean;
}

export const planEntitlements: Record<PlanId, Entitlements> = {
  free: {
    plan: "free",
    maxProjects: 3,
    maxMembers: 2,
    auditLog: false,
  },
  pro: {
    plan: "pro",
    maxProjects: 100,
    maxMembers: 100,
    auditLog: true,
  },
};

const entitledStatuses = new Set(["active", "trialing"]);

export function resolvePlanId({
  priceId,
  status,
  proPriceId = env.STRIPE_PRICE_PRO,
}: {
  priceId?: string | null;
  status?: string | null;
  proPriceId?: string;
}): PlanId {
  if (priceId && proPriceId && priceId === proPriceId && status && entitledStatuses.has(status)) {
    return "pro";
  }

  return "free";
}

export function getEntitlements(input: Parameters<typeof resolvePlanId>[0] = {}): Entitlements {
  return planEntitlements[resolvePlanId(input)];
}

export function getProPriceId() {
  if (!env.STRIPE_PRICE_PRO) {
    throw new Error("STRIPE_PRICE_PRO is required for Pro checkout");
  }

  return env.STRIPE_PRICE_PRO;
}
