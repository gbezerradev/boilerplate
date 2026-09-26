import type { PrismaDatabaseClient } from "@boilerplate/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prismaAdapterConfig = {
  provider: "sqlite",
  usePlural: false,
} as const;

// The schema generator only needs the adapter configuration. It never executes
// database operations, so no Prisma client is created while loading this file.
const schemaPrisma = {} as PrismaDatabaseClient;

export const options = {
  database: prismaAdapter(schemaPrisma, prismaAdapterConfig),
  emailAndPassword: {
    enabled: true,
  },
};

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
    ...options,
    database: prismaAdapter(prisma, prismaAdapterConfig),
    trustedOrigins,
    secret,
    baseURL,
  });
}
