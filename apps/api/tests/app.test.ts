import { describe, expect, it, vi } from "vitest";
import type { AuthHandler } from "../src/app";
import { createApp } from "../src/app";

describe("API app", () => {
  it("reports a healthy status", async () => {
    const app = createApp();
    const response = await app.request("http://localhost/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });

  it("mounts Better Auth under /api/auth/*", async () => {
    const authHandler = vi.fn<AuthHandler>((request) => {
      expect(request.method).toBe("GET");
      expect(new URL(request.url).pathname).toBe("/api/auth/session");
      return Response.json({ authenticated: false });
    });
    const app = createApp({ authHandler });

    const response = await app.request("http://localhost/api/auth/session");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ authenticated: false });
    expect(authHandler).toHaveBeenCalledOnce();
  });

  it("sets CORS headers for the Next app on auth routes", async () => {
    const app = createApp({
      authHandler: () => Response.json({ ok: true }),
      corsOrigin: "http://localhost:3000",
    });

    const response = await app.request("http://localhost/api/auth/session", {
      headers: {
        Origin: "http://localhost:3000",
      },
    });

    expect(response.headers.get("access-control-allow-origin")).toBe(
      "http://localhost:3000",
    );
    expect(response.headers.get("access-control-allow-credentials")).toBe(
      "true",
    );
  });

  it("registers the versioned user routes", async () => {
    const app = createApp();
    const response = await app.request("http://localhost/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Ada" }),
    });

    expect(response.status).toBe(400);
  });
});
