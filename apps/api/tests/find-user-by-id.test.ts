import { describe, expect, it } from "vitest";
import { NotFoundError, ValidationError } from "../src/lib/errors";
import type { User } from "../src/lib/types";
import type { UserRepository } from "../src/repositories/user-repository";
import { FindUserByIdUseCase } from "../src/use-cases/users/find-user-by-id";

const user: User = {
  id: "user-1",
  name: "Ada",
  email: "ada@example.com",
  emailVerified: false,
  image: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

function makeUserRepository(foundUser: User | null): UserRepository {
  return {
    create: async () => user,
    findByEmail: async () => null,
    findById: async () => foundUser,
  };
}

describe("FindUserByIdUseCase", () => {
  it("returns the user when it exists", async () => {
    const useCase = new FindUserByIdUseCase(makeUserRepository(user));

    await expect(useCase.execute("user-1")).resolves.toEqual(user);
  });

  it("raises not found when the user does not exist", async () => {
    const useCase = new FindUserByIdUseCase(makeUserRepository(null));

    await expect(useCase.execute("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("requires an id", async () => {
    const useCase = new FindUserByIdUseCase(makeUserRepository(null));

    await expect(useCase.execute(" ")).rejects.toBeInstanceOf(ValidationError);
  });
});
