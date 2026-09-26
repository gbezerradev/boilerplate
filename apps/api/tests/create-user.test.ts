import { beforeEach, describe, expect, it } from "vitest";
import { ConflictError } from "../src/lib/errors";
import { InMemoryUserRepository } from "../src/repositories/in-memory/user-repository";
import { CreateUserUseCase } from "../src/use-cases/users/create-user";

describe("CreateUserUseCase", () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  it("normalizes the email before creating a user", async () => {
    const useCase = new CreateUserUseCase(repository);

    await expect(
      useCase.execute({ id: "user-1", name: "Ada", email: "ADA@EXAMPLE.COM" }),
    ).resolves.toMatchObject({
      id: "user-1",
      email: "ada@example.com",
    });
  });

  it("rejects duplicate emails", async () => {
    await repository.create({
      id: "user-1",
      name: "Ada",
      email: "ada@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const useCase = new CreateUserUseCase(repository);

    await expect(
      useCase.execute({ name: "Another Ada", email: "ADA@EXAMPLE.COM" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
