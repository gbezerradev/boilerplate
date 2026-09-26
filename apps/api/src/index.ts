import { serve } from "@hono/node-server";
import "dotenv/config";
import { app } from "./app";
import { env } from "./env";
import { disconnectRuntime } from "./lib/runtime";

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`API listening on http://localhost:${env.PORT}`);

const shutdown = async () => {
  await disconnectRuntime();
  process.exit(0);
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
