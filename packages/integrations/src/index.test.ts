import { describe, expect, it } from "vitest";

import { createWebhookSignature, isPrivateAddress } from "./index";

describe("webhook security", () => {
  it("blocks private and reserved network targets", () => {
    expect(isPrivateAddress("127.0.0.1")).toBe(true);
    expect(isPrivateAddress("10.0.0.1")).toBe(true);
    expect(isPrivateAddress("169.254.169.254")).toBe(true);
    expect(isPrivateAddress("8.8.8.8")).toBe(false);
    expect(isPrivateAddress("::1")).toBe(true);
  });

  it("creates stable versioned signatures", () => {
    expect(createWebhookSignature("secret", "123", "{}")).toMatch(/^v1=[a-f0-9]{64}$/);
    expect(createWebhookSignature("secret", "123", "{}")).toBe(
      createWebhookSignature("secret", "123", "{}"),
    );
  });
});
