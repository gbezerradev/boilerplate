import { NotFoundError } from "../../lib/errors";
import type {
  CreateUserData,
  EntityId,
  UpdateUserData,
  User,
} from "../../lib/types";
import type { UserRepository } from "../user-repository";

export class InMemoryUserRepository implements UserRepository {
  public readonly items: User[] = [];

  async create(data: CreateUserData): Promise<User> {
    const createdAt = data.createdAt ?? new Date();
    const user: User = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      email: data.email,
      emailVerified: data.emailVerified ?? false,
      image: data.image ?? null,
      createdAt,
      updatedAt: data.updatedAt ?? createdAt,
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null;
  }

  async findById(id: EntityId): Promise<User | null> {
    return this.items.find((user) => user.id === id) ?? null;
  }

  async update(id: EntityId, data: UpdateUserData): Promise<User> {
    const index = this.items.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundError("User not found");
    }

    const currentUser = this.items[index];
    const updatedUser: User = {
      ...currentUser,
      name: data.name ?? currentUser.name,
      email: data.email ?? currentUser.email,
      emailVerified: data.emailVerified ?? currentUser.emailVerified,
      image: data.image === undefined ? currentUser.image : data.image,
      updatedAt: new Date(),
    };

    this.items[index] = updatedUser;
    return updatedUser;
  }

  async delete(id: EntityId): Promise<void> {
    const index = this.items.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundError("User not found");
    }

    this.items.splice(index, 1);
  }
}
