export type EntityId = string;

export interface User {
  id: EntityId;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  id?: EntityId;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  emailVerified?: boolean;
  image?: string | null;
}
