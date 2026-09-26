import type {
  CreateUserData,
  EntityId,
  UpdateUserData,
  User,
} from "../lib/types";

/**
 * Persistence boundary for users. Application code depends on this contract,
 * never on Prisma or another database client.
 */
export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: EntityId): Promise<User | null>;
  update?(id: EntityId, data: UpdateUserData): Promise<User>;
  delete?(id: EntityId): Promise<void>;
}

/** A stricter contract useful to callers that need all CRUD operations. */
export interface UserRepositoryCrud extends UserRepository {
  findById(id: EntityId): Promise<User | null>;
  update(id: EntityId, data: UpdateUserData): Promise<User>;
  delete(id: EntityId): Promise<void>;
}

export type IUserRepository = UserRepository;
