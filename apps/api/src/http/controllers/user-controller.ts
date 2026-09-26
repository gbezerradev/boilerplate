import type {
  CreateUserUseCase,
  FindUserByIdUseCase,
  UserRepository,
} from "@boilerplate/core";
import { ValidationError } from "@boilerplate/core";
import type { Context } from "hono";
import {
  makeCreateUserUseCase,
  makeFindUserByIdUseCase,
} from "../../factories/user-factory";
import { respondWithError } from "../errors/http-error";
import { createUserSchema } from "../schemas/user.schema";

export interface CreateUserControllerOptions {
  useCase?: CreateUserUseCase;
  repository?: UserRepository;
}

export class CreateUserController {
  private readonly useCase: CreateUserUseCase;

  constructor(options: CreateUserControllerOptions = {}) {
    this.useCase =
      options.useCase ??
      makeCreateUserUseCase({ repository: options.repository });
  }

  async handle(context: Context): Promise<Response> {
    try {
      let body: unknown;
      try {
        body = await context.req.json<unknown>();
      } catch {
        throw new ValidationError("Request body must be valid JSON");
      }

      const input = createUserSchema.safeParse(body);

      if (!input.success) {
        throw new ValidationError("Invalid user data", input.error.flatten());
      }

      const user = await this.useCase.execute(input.data);
      return context.json(user, 201);
    } catch (error) {
      return respondWithError(context, error);
    }
  }
}

export class GetUserController {
  private readonly useCase: FindUserByIdUseCase;

  constructor(
    options: {
      useCase?: FindUserByIdUseCase;
      repository?: UserRepository;
    } = {},
  ) {
    this.useCase =
      options.useCase ??
      makeFindUserByIdUseCase({ repository: options.repository });
  }

  async handle(context: Context): Promise<Response> {
    try {
      const id = context.req.param("id")?.trim();
      if (!id) {
        throw new ValidationError("A user id is required");
      }

      const user = await this.useCase.execute(id);
      return context.json(user, 200);
    } catch (error) {
      return respondWithError(context, error);
    }
  }
}

export type UserController = CreateUserController | GetUserController;
