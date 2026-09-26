import type { UserRepository } from "@boilerplate/core";
import { type Context, Hono } from "hono";
import {
  CreateUserController,
  GetUserController,
} from "../controllers/user-controller";

export type UserControllerHandler = (
  context: Context,
) => Response | Promise<Response>;

export interface UserRoutesOptions {
  createUserController?: UserControllerHandler;
  getUserController?: UserControllerHandler;
  userRepository?: UserRepository;
}

export function createUserRoutes(options: UserRoutesOptions = {}) {
  const routes = new Hono();
  let createUserController: CreateUserController | undefined;
  let getUserController: GetUserController | undefined;

  const createUser =
    options.createUserController ??
    ((context: Context) => {
      createUserController ??= new CreateUserController({
        repository: options.userRepository,
      });
      return createUserController.handle(context);
    });
  const getUser =
    options.getUserController ??
    ((context: Context) => {
      getUserController ??= new GetUserController({
        repository: options.userRepository,
      });
      return getUserController.handle(context);
    });

  routes.post("/users", createUser);
  routes.get("/users/:id", getUser);

  return routes;
}
