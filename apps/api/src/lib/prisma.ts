import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";

let prisma: PrismaClient | undefined;

export function createPrismaClient(
  databaseUrl = env.DATABASE_URL,
): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

export function getPrisma(): PrismaClient {
  prisma ??= createPrismaClient();
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }
}
