import type { UserRepository } from "@boilerplate/core";
import { Hono } from "hono";
import { env } from "./env";
import { createRoutes } from "./http/routes";
import { getRuntime } from "./lib/runtime";
import { corsPlugin } from "./plugins/cors";

export type AuthHandler = (request: Request) => Response | Promise<Response>;

export interface AppOptions {
  authHandler?: AuthHandler;
  corsOrigin?: string;
  userRepository?: UserRepository;
}

const defaultAuthHandler: AuthHandler = (request) => {
  const handler = getRuntime().auth.handler;
  if (!handler) {
    throw new Error("Better Auth handler is not available");
  }
  return handler(request);
};

export function createApp(options: AppOptions = {}) {
  const app = new Hono();
  const authHandler = options.authHandler ?? defaultAuthHandler;

  app.use(
    "/api/auth/*",
    corsPlugin({ origin: options.corsOrigin ?? env.CORS_ORIGIN }),
  );

  app.get("/health", (context) =>
    context.json({
      status: "ok",
    }),
  );

  app.on(["GET", "POST"], "/api/auth/*", (context) =>
    authHandler(context.req.raw),
  );

  app.route(
    "/",
    createRoutes({
      userRepository: options.userRepository,
    }),
  );

  return app;
}

export const app = createApp();
