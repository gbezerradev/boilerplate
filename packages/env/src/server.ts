import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    EMAIL_PROVIDER: z
      .enum(["console", "resend"])
      .default(process.env.NODE_ENV === "production" ? "resend" : "console"),
    EMAIL_FROM: z.string().min(3).default("Boilerplate <noreply@example.com>"),
    RESEND_API_KEY: z.string().min(1).optional(),
    EMAIL_DELIVERY_MODE: z
      .enum(["inline", "queued"])
      .default(process.env.NODE_ENV === "production" ? "queued" : "inline"),
    BILLING_PROVIDER: z.enum(["disabled", "stripe"]).default("disabled"),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
    STRIPE_PRICE_PRO: z.string().min(1).optional(),
    ADMIN_EMAILS: z.string().default(""),
    JOB_POLL_INTERVAL_MS: z.coerce.number().int().min(100).max(60_000).default(1_000),
    JOB_BATCH_SIZE: z.coerce.number().int().positive().max(100).default(10),
    STORAGE_PROVIDER: z.enum(["disabled", "s3"]).default("disabled"),
    S3_BUCKET: z.string().min(1).optional(),
    S3_REGION: z.string().min(1).default("us-east-1"),
    S3_ENDPOINT: z.url().optional(),
    S3_ACCESS_KEY_ID: z.string().min(1).optional(),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    ANALYTICS_PROVIDER: z.enum(["disabled", "console", "posthog"]).default("disabled"),
    POSTHOG_API_KEY: z.string().min(1).optional(),
    POSTHOG_HOST: z.url().default("https://us.i.posthog.com"),
    PORT: z.coerce.number().int().positive().max(65_535).default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
