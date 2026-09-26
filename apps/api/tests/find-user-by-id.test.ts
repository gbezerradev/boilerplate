import { beforeEach, describe, expect, it } from "vitest";
import { NotFoundError, ValidationError } from "../src/lib/errors";
import { InMemoryUserRepository } from "../src/repositories/in-memory/user-repository";
import { FindUserByIdUseCase } from "../src/use-cases/users/find-user-by-id";

describe("FindUserByIdUseCase", () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it("returns the user when it exists", async () => {
    const user = await repository.create({
      id: "user-1",
      name: "Ada",
      email: "ada@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const useCase = new FindUserByIdUseCase(repository);

    await expect(useCase.execute("user-1")).resolves.toEqual(user);
  });

  it("raises not found when the user does not exist", async () => {
    const useCase = new FindUserByIdUseCase(repository);

    await expect(useCase.execute("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("requires an id", async () => {
    const useCase = new FindUserByIdUseCase(repository);

    await expect(useCase.execute(" ")).rejects.toBeInstanceOf(ValidationError);
  });
});
