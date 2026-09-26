import type {
  CreateUserData,
  EntityId,
  UpdateUserData,
  User,
  UserRepository,
} from "@boilerplate/core";
import type { PrismaClient, User as PrismaUser } from "@prisma/client";

export type PrismaUserClient = Pick<PrismaClient, "user">;

function toDomainUser(user: PrismaUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class PrismaUserRepository implements UserRepository {
  private readonly user;

  constructor(prisma: PrismaUserClient) {
    this.user = prisma.user;
  }

  async create(data: CreateUserData): Promise<User> {
    const createdAt = data.createdAt ?? new Date();
    const updatedAt = data.updatedAt ?? createdAt;
    const user = await this.user.create({
      data: {
        id: data.id ?? crypto.randomUUID(),
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified ?? false,
        image: data.image ?? null,
        createdAt,
        updatedAt,
      },
    });

    return toDomainUser(user);
  }

  async findById(id: EntityId): Promise<User | null> {
    const user = await this.user.findUnique({ where: { id } });
    return user ? toDomainUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.user.findUnique({ where: { email } });
    return user ? toDomainUser(user) : null;
  }

  async update(id: EntityId, data: UpdateUserData): Promise<User> {
    const user = await this.user.update({
      where: { id },
      data: {
        ...(data.name === undefined ? {} : { name: data.name }),
        ...(data.email === undefined ? {} : { email: data.email }),
        ...(data.emailVerified === undefined
          ? {}
          : { emailVerified: data.emailVerified }),
        ...(data.image === undefined ? {} : { image: data.image }),
        updatedAt: new Date(),
      },
    });

    return toDomainUser(user);
  }

  async delete(id: EntityId): Promise<void> {
    await this.user.delete({ where: { id } });
  }

  async getById(id: EntityId): Promise<User | null> {
    return this.findById(id);
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.findByEmail(email);
  }
}

export { toDomainUser };
