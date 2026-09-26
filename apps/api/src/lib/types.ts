/** Framework-neutral identifier used by domain and application code. */
export type EntityId = string;

/** Domain representation of the Prisma User model. */
export interface User {
  id: EntityId;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Data accepted by a user repository when creating a user. */
export interface CreateUserData {
  id?: EntityId;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Data accepted by a user repository when changing a user. */
export interface UpdateUserData {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string | null;
}
