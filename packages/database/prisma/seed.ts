import "dotenv/config";
import { createPrismaClient, disconnectPrisma } from "../src/client";

const prisma = createPrismaClient(process.env.DATABASE_URL ?? "file:./dev.db");

try {
  await prisma.user.upsert({
    where: { email: "seed@example.com" },
    update: {
      name: "Seed User",
      emailVerified: true,
      image: null,
      updatedAt: new Date(),
    },
    create: {
      id: "seed-user",
      name: "Seed User",
      email: "seed@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
} finally {
  await disconnectPrisma(prisma);
}
