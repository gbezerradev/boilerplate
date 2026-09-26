import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

export type PrismaDatabaseClient = PrismaClient;

export function createPrismaClient(databaseUrl: string): PrismaClient {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

export async function disconnectPrisma(
  prisma: PrismaDatabaseClient,
): Promise<void> {
  await prisma.$disconnect();
}
