import { createAuth } from "@boilerplate/auth";
import type { UserRepository } from "@boilerplate/core";
import {
  createPrismaClient,
  disconnectPrisma,
  type PrismaDatabaseClient,
  PrismaUserRepository,
} from "@boilerplate/database";
import { env } from "../env";

export interface ApiRuntime {
  prisma: PrismaDatabaseClient;
  userRepository: UserRepository;
  auth: ReturnType<typeof createAuth>;
}

let runtime: ApiRuntime | undefined;

export function getRuntime(): ApiRuntime {
  runtime ??= (() => {
    const prisma = createPrismaClient(env.DATABASE_URL);
    return {
      prisma,
      userRepository: new PrismaUserRepository(prisma),
      auth: createAuth({
        prisma,
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: [env.CORS_ORIGIN],
      }),
    };
  })();

  return runtime;
}

export async function disconnectRuntime(): Promise<void> {
  if (!runtime) {
    return;
  }

  const currentRuntime = runtime;
  runtime = undefined;
  await disconnectPrisma(currentRuntime.prisma);
}
