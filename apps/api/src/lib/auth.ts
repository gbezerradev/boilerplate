import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "../config/env";
import { getPrisma } from "./prisma";

/**
 * Build Better Auth only when the auth endpoint is used. This keeps the app
 * factory usable in tests without requiring a live database or auth secret.
 */
export function getAuth() {
  return betterAuth({
    database: prismaAdapter(getPrisma(), {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [env.CORS_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
  });
}
