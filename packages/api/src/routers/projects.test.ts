import { describe, expect, it } from "vitest";

import { createProjectInput, projectIdInput } from "./projects";

describe("project tenant input", () => {
  it("accepts product fields", () => {
    expect(createProjectInput.parse({ name: "Launch" })).toEqual({ name: "Launch" });
  });

  it("rejects a client-supplied organization id", () => {
    expect(() =>
      createProjectInput.parse({ name: "Launch", organizationId: "another-tenant" }),
    ).toThrow();
  });

  it("rejects tenant identifiers from delete inputs", () => {
    expect(() =>
      projectIdInput.parse({ id: "project", organizationId: "another-tenant" }),
    ).toThrow();
  });
});
