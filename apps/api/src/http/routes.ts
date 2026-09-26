import { Hono } from "hono";
import { createUserRoutes } from "./routes/user-routes";

export const routes = new Hono();

routes.route("/api/v1", createUserRoutes());
