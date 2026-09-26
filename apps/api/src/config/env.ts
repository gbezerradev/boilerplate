import "dotenv/config";
import { z } from "zod";

/**
 * Runtime configuration for the API.
 *
 * Defaults intentionally keep the application importable in tests and local
 * development. Production deployments should provide their own database URL,
 * auth secret, and public URLs through the environment.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().trim().min(1).default("file:./dev.db"),
  BETTER_AUTH_SECRET: z
    .string()
    .trim()
    .min(1)
    .default("local-development-secret-change-me"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:8787"),
  CORS_ORIGIN: z.string().url().default("http://localhost:3000"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(8787),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, unknown> = process.env): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error(
      `Invalid environment configuration: ${result.error.message}`,
    );
  }

  return result.data;
}

/** Parsed once so consumers share one consistent configuration object. */
export const env = parseEnv();

/** Alias that makes the configuration intent explicit at call sites. */
export const config = env;
