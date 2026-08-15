import { describe, expect, it } from "vitest";

import { isInRollout } from "./index";

describe("feature flag rollouts", () => {
  it("is deterministic and honors boundary percentages", () => {
    expect(isInRollout("flag", "subject", 0)).toBe(false);
    expect(isInRollout("flag", "subject", 100)).toBe(true);
    expect(isInRollout("flag", "subject", 42)).toBe(isInRollout("flag", "subject", 42));
  });
});
