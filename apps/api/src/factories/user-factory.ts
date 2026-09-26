import type {
  CreateUserUseCase,
  FindUserByIdUseCase,
  UserRepository,
} from "@boilerplate/core";
import {
  CreateUserUseCase as CreateUser,
  FindUserByIdUseCase as FindUserById,
} from "@boilerplate/core";
import { getRuntime } from "../lib/runtime";

export interface UserFactoryOptions {
  repository?: UserRepository;
}

export function makeUserRepository(): UserRepository {
  return getRuntime().userRepository;
}

export function makeCreateUserUseCase(
  options: UserFactoryOptions = {},
): CreateUserUseCase {
  return new CreateUser(options.repository ?? makeUserRepository());
}

export function makeFindUserByIdUseCase(
  options: UserFactoryOptions = {},
): FindUserByIdUseCase {
  return new FindUserById(options.repository ?? makeUserRepository());
}
