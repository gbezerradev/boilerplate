import {
  ConflictError,
  isAppError,
  RepositoryError,
  ValidationError,
} from "../../lib/errors";
import type { CreateUserData, User } from "../../lib/types";
import type { UserRepository } from "../../repositories/user-repository";

/** Creates a user while keeping persistence behind the repository contract. */
export class CreateUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(input: CreateUserData): Promise<User> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email) {
      throw new ValidationError("A user name and email are required");
    }

    try {
      const existing = await this.users.findByEmail(email);
      if (existing) {
        throw new ConflictError("A user with this email already exists");
      }

      return await this.users.create({
        id: input.id,
        name,
        email,
        emailVerified: input.emailVerified ?? false,
        image: input.image ?? null,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      });
    } catch (error) {
      if (isAppError(error)) {
        throw error;
      }

      throw new RepositoryError("Unable to persist the user", error);
    }
  }
}
