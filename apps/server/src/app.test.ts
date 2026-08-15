import { describe, expect, it, vi } from "vitest";

import { createApp } from "./app";

describe("server application", () => {
  it("reports liveness and includes a request ID", async () => {
    const app = createApp();
    const response = await app.request("/health/live", {
      headers: { "X-Request-Id": "known-request-id" },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Request-Id")).toBe("known-request-id");
    await expect(response.json()).resolves.toMatchObject({ status: "ok", service: "server" });
  });

  it("reports readiness when the database check succeeds", async () => {
    const checkDatabase = vi.fn().mockResolvedValue(undefined);
    const app = createApp({ checkDatabase });
    const response = await app.request("/health/ready");

    expect(response.status).toBe(200);
    expect(checkDatabase).toHaveBeenCalledOnce();
    await expect(response.json()).resolves.toMatchObject({
      status: "ok",
      checks: { database: "ok" },
    });
  });

  it("returns 503 when the database is unavailable", async () => {
    const app = createApp({
      checkDatabase: vi.fn().mockRejectedValue(new Error("database credentials must stay private")),
    });
    const response = await app.request("/health/ready");
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toMatchObject({ status: "unavailable", checks: { database: "failed" } });
    expect(JSON.stringify(body)).not.toContain("credentials");
  });

  it("returns a sanitized error response for unexpected failures", async () => {
    const app = createApp();
    app.get("/test/unexpected-error", () => {
      throw new Error("sensitive internal detail");
    });

    const response = await app.request("/test/unexpected-error");
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    });
    expect(JSON.stringify(body)).not.toContain("sensitive internal detail");
  });

  it("returns a consistent not-found response", async () => {
    const app = createApp();
    const response = await app.request("/missing");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  });

  it("does not expose a webhook processor when billing is disabled", async () => {
    const app = createApp();
    const response = await app.request("/webhooks/stripe", { method: "POST", body: "{}" });

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "BILLING_DISABLED" },
    });
  });
});
