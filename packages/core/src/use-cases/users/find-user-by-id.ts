import {
  isAppError,
  NotFoundError,
  RepositoryError,
  ValidationError,
} from "../../errors";
import type { UserRepository } from "../../repositories/user-repository";
import type { EntityId, User } from "../../types";

export class FindUserByIdUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(id: EntityId): Promise<User> {
    if (!id.trim()) {
      throw new ValidationError("A user id is required");
    }

    try {
      const user = await this.users.findById(id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      if (isAppError(error)) {
        throw error;
      }
      throw new RepositoryError("Unable to retrieve the user", error);
    }
  }
}
