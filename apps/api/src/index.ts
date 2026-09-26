import { serve } from "@hono/node-server";
import "dotenv/config";
import { app } from "./app";
import { env } from "./config/env";

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`API listening on http://localhost:${env.PORT}`);
