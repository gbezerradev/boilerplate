import { createContext } from "@boilerplate/api/context";
import { appRouter } from "@boilerplate/api/routers/index";
import { auth } from "@boilerplate/auth";
import {
  constructStripeEvent,
  isBillingEnabled,
  processStripeWebhookEvent,
} from "@boilerplate/billing";
import { db } from "@boilerplate/db";
import { env } from "@boilerplate/env/server";
import { trpcServer } from "@hono/trpc-server";
import { getConnInfo } from "@hono/node-server/conninfo";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId, type RequestIdVariables } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

const MAX_REQUEST_BODY_SIZE = 1024 * 1024;

type AppDependencies = {
  checkDatabase?: () => Promise<void>;
};

type AppEnvironment = {
  Variables: RequestIdVariables;
};

function errorBody(code: string, message: string, requestIdValue: string) {
  return {
    error: {
      code,
      message,
      requestId: requestIdValue,
    },
  };
}

async function defaultDatabaseCheck() {
  await db.execute(sql`select 1`);
}

export function createApp({ checkDatabase = defaultDatabaseCheck }: AppDependencies = {}) {
  const app = new Hono<AppEnvironment>();

  app.use("*", async (c, next) => {
    try {
      const connectionAddress = getConnInfo(c).remote.address;
      if (connectionAddress) c.req.raw.headers.set("X-Connection-Ip", connectionAddress);
    } catch {
      // app.request() has no network socket; authentication routes are not exercised in those tests.
    }

    await next();
  });
  app.use("*", requestId({ limitLength: 128 }));
  app.use(
    "*",
    secureHeaders({
      crossOriginResourcePolicy: "cross-origin",
    }),
  );
  app.use(
    "*",
    bodyLimit({
      maxSize: MAX_REQUEST_BODY_SIZE,
      onError: (c) =>
        c.json(
          errorBody(
            "PAYLOAD_TOO_LARGE",
            "Request body exceeds the allowed size",
            c.get("requestId"),
          ),
          413,
        ),
    }),
  );
  app.use("*", async (c, next) => {
    const startedAt = performance.now();

    await next();

    console.info(
      JSON.stringify({
        level: "info",
        message: "request.completed",
        requestId: c.get("requestId"),
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        durationMs: Number((performance.now() - startedAt).toFixed(2)),
      }),
    );
  });
  app.use(
    "/*",
    cors({
      origin: env.CORS_ORIGIN,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
      exposeHeaders: ["X-Request-Id"],
      credentials: true,
    }),
  );

  app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

  app.post("/webhooks/stripe", async (c) => {
    if (!isBillingEnabled()) {
      return c.json(
        errorBody("BILLING_DISABLED", "Billing is not configured", c.get("requestId")),
        503,
      );
    }

    const signature = c.req.header("stripe-signature");
    if (!signature) {
      return c.json(
        errorBody("INVALID_SIGNATURE", "Missing Stripe signature", c.get("requestId")),
        400,
      );
    }

    let event;
    try {
      event = await constructStripeEvent(await c.req.text(), signature);
    } catch {
      return c.json(
        errorBody("INVALID_SIGNATURE", "Invalid Stripe signature", c.get("requestId")),
        400,
      );
    }

    await processStripeWebhookEvent(event);
    return c.json({ received: true });
  });

  app.use(
    "/trpc/*",
    trpcServer({
      router: appRouter,
      createContext: (_opts, context) => createContext({ context }),
    }),
  );

  app.get("/health/live", (c) =>
    c.json({
      status: "ok",
      service: "server",
      uptimeSeconds: Math.floor(process.uptime()),
    }),
  );

  app.get("/health/ready", async (c) => {
    try {
      await checkDatabase();
      return c.json({ status: "ok", service: "server", checks: { database: "ok" } });
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "health.database.failed",
          requestId: c.get("requestId"),
          error: error instanceof Error ? error.message : "Unknown database health-check failure",
        }),
      );

      return c.json(
        {
          status: "unavailable",
          service: "server",
          checks: { database: "failed" },
          requestId: c.get("requestId"),
        },
        503,
      );
    }
  });

  app.get("/", (c) => c.text("OK"));

  app.notFound((c) => c.json(errorBody("NOT_FOUND", "Route not found", c.get("requestId")), 404));

  app.onError((error, c) => {
    console.error(
      JSON.stringify({
        level: "error",
        message: "request.failed",
        requestId: c.get("requestId"),
        method: c.req.method,
        path: c.req.path,
        error: error.message,
      }),
    );

    return c.json(
      errorBody("INTERNAL_SERVER_ERROR", "An unexpected error occurred", c.get("requestId")),
      500,
    );
  });

  return app;
}

export const app = createApp();

export default app;
