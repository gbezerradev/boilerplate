import { Hono } from "hono";
import { createUserRoutes } from "./routes/user-routes";

/** Aggregates every HTTP route module in one place. */
export const routes = new Hono();

routes.route("/api/v1", createUserRoutes());
