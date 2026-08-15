import { describe, expect, it } from "vitest";

import { getEntitlements, resolvePlanId } from "./plans";

describe("billing entitlements", () => {
  it("grants Pro only for the configured active price", () => {
    expect(resolvePlanId({ priceId: "price_pro", status: "active", proPriceId: "price_pro" })).toBe(
      "pro",
    );
    expect(
      resolvePlanId({ priceId: "price_pro", status: "trialing", proPriceId: "price_pro" }),
    ).toBe("pro");
  });

  it("falls back to free for inactive or unknown subscriptions", () => {
    expect(
      resolvePlanId({ priceId: "price_pro", status: "canceled", proPriceId: "price_pro" }),
    ).toBe("free");
    expect(
      resolvePlanId({ priceId: "price_other", status: "active", proPriceId: "price_pro" }),
    ).toBe("free");
  });

  it("returns concrete limits for enforcement", () => {
    expect(
      getEntitlements({ priceId: "price_pro", status: "active", proPriceId: "price_pro" }),
    ).toEqual({
      plan: "pro",
      maxProjects: 100,
      maxMembers: 100,
      auditLog: true,
    });
  });
});
