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
}

export function createUserRoutes(options: UserRoutesOptions = {}) {
  const routes = new Hono();
  let createUserController: CreateUserController | undefined;
  let getUserController: GetUserController | undefined;

  const createUser =
    options.createUserController ??
    ((context: Context) => {
      createUserController ??= new CreateUserController();
      return createUserController.handle(context);
    });
  const getUser =
    options.getUserController ??
    ((context: Context) => {
      getUserController ??= new GetUserController();
      return getUserController.handle(context);
    });

  routes.post("/users", createUser);
  routes.get("/users/:id", getUser);

  return routes;
}
