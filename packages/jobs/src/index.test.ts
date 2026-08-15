import { describe, expect, it } from "vitest";

import { retryDelayMs } from "./index";

describe("job retries", () => {
  it("uses capped exponential backoff", () => {
    expect(retryDelayMs(1)).toBe(1_000);
    expect(retryDelayMs(2)).toBe(2_000);
    expect(retryDelayMs(20)).toBe(60 * 60_000);
  });
});
