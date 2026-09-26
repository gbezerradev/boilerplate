import { getPrisma } from "../lib/prisma";
import type { PrismaUserClient } from "../repositories/prisma/user-repository";
import { PrismaUserRepository } from "../repositories/prisma/user-repository";
import type { UserRepository } from "../repositories/user-repository";
import { CreateUserUseCase } from "../use-cases/users/create-user";
import { FindUserByIdUseCase } from "../use-cases/users/find-user-by-id";

export interface UserFactoryOptions {
  prisma?: PrismaUserClient;
  repository?: UserRepository;
}

/** Wire the production Prisma implementation at the application boundary. */
export function makeUserRepository(
  prisma: PrismaUserClient = getPrisma(),
): PrismaUserRepository {
  return new PrismaUserRepository(prisma);
}

export function makeCreateUserUseCase(
  options: UserFactoryOptions = {},
): CreateUserUseCase {
  return new CreateUserUseCase(
    options.repository ?? makeUserRepository(options.prisma),
  );
}

export function makeFindUserByIdUseCase(
  options: UserFactoryOptions = {},
): FindUserByIdUseCase {
  return new FindUserByIdUseCase(
    options.repository ?? makeUserRepository(options.prisma),
  );
}
