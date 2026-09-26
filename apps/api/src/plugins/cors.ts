import { cors } from "hono/cors";

export interface CorsPluginOptions {
  origin: string;
}

/** HTTP framework plugin kept separate from controllers and application code. */
export function corsPlugin(options: CorsPluginOptions) {
  return cors({
    origin: options.origin,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  });
}
