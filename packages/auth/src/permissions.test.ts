import { describe, expect, it } from "vitest";

import { adminRole, memberRole, ownerRole } from "./permissions";

describe("organization roles", () => {
  it("allows every member to work with tenant data", () => {
    expect(memberRole.authorize({ data: ["read", "create", "update", "delete"] }).success).toBe(
      true,
    );
  });

  it("allows admins to read billing but not manage it", () => {
    expect(adminRole.authorize({ billing: ["read"] }).success).toBe(true);
    expect(adminRole.authorize({ billing: ["manage"] }).success).toBe(false);
  });

  it("allows only owners to manage billing", () => {
    expect(ownerRole.authorize({ billing: ["manage"] }).success).toBe(true);
    expect(memberRole.authorize({ billing: ["manage"] }).success).toBe(false);
  });
});
