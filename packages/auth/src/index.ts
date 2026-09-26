import type { PrismaDatabaseClient } from "@boilerplate/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export interface AuthOptions {
  prisma: PrismaDatabaseClient;
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
}

export function createAuth({
  prisma,
  secret,
  baseURL,
  trustedOrigins,
}: AuthOptions) {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins,
    secret,
    baseURL,
  });
}
