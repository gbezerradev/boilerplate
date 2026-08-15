import { describe, expect, it } from "vitest";

import { buildObjectKey } from "./index";

describe("storage keys", () => {
  it("builds tenant-prefixed opaque keys", () => {
    expect(buildObjectKey("org_123", "a1b2-c3")).toBe("organizations/org_123/objects/a1b2-c3");
  });

  it("rejects traversal and ambiguous identifiers", () => {
    expect(() => buildObjectKey("../other", "object")).toThrow();
  });
});
