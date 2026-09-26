import type { UserRepository } from "@boilerplate/core";
import { Hono } from "hono";
import { createUserRoutes } from "./routes/user-routes";

export interface RoutesOptions {
  userRepository?: UserRepository;
}

export function createRoutes(options: RoutesOptions = {}) {
  const routes = new Hono();
  routes.route(
    "/api/v1",
    createUserRoutes({ userRepository: options.userRepository }),
  );
  return routes;
}

export const routes = createRoutes();
