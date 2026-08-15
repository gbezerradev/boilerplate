import { describe, expect, it } from "vitest";

import { createAuditEvent } from "./index";

describe("audit events", () => {
  it("removes sensitive metadata recursively and caps user-agent length", () => {
    const event = createAuditEvent({
      action: "resource.updated",
      resourceType: "resource",
      userAgent: "x".repeat(600),
      metadata: {
        name: "visible",
        accessToken: "hidden",
        nested: { password: "hidden", value: "visible" },
      },
    });

    expect(event.metadata).toEqual({ name: "visible", nested: { value: "visible" } });
    expect(event.userAgent).toHaveLength(500);
  });
});
