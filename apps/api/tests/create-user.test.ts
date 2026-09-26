import { describe, expect, it } from "vitest";
import { ConflictError } from "../src/lib/errors";
import type { User } from "../src/lib/types";
import type { UserRepository } from "../src/repositories/user-repository";
import { CreateUserUseCase } from "../src/use-cases/users/create-user";

function makeUserRepository(existingUser: User | null = null): UserRepository {
  return {
    create: async (data) => ({
      id: data.id ?? "user-1",
      name: data.name,
      email: data.email,
      emailVerified: data.emailVerified ?? false,
      image: data.image ?? null,
      createdAt: data.createdAt ?? new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: data.updatedAt ?? new Date("2026-01-01T00:00:00.000Z"),
    }),
    findByEmail: async () => existingUser,
    findById: async () => null,
  };
}

describe("CreateUserUseCase", () => {
  it("normalizes the email before creating a user", async () => {
    const useCase = new CreateUserUseCase(makeUserRepository());

    await expect(
      useCase.execute({ name: "Ada", email: "ADA@EXAMPLE.COM" }),
    ).resolves.toMatchObject({
      id: "user-1",
      email: "ada@example.com",
    });
  });

  it("rejects duplicate emails", async () => {
    const existingUser = {
      id: "user-1",
      name: "Ada",
      email: "ada@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies User;
    const useCase = new CreateUserUseCase(makeUserRepository(existingUser));

    await expect(
      useCase.execute({ name: "Another Ada", email: "ADA@EXAMPLE.COM" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
