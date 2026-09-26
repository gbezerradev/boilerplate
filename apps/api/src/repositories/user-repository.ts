import type {
  CreateUserData,
  EntityId,
  UpdateUserData,
  User,
} from "../lib/types";

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: EntityId): Promise<User | null>;
  update?(id: EntityId, data: UpdateUserData): Promise<User>;
  delete?(id: EntityId): Promise<void>;
}

export interface UserRepositoryCrud extends UserRepository {
  findById(id: EntityId): Promise<User | null>;
  update(id: EntityId, data: UpdateUserData): Promise<User>;
  delete(id: EntityId): Promise<void>;
}

export type IUserRepository = UserRepository;
