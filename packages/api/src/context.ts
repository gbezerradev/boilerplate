import { auth } from "@boilerplate/auth";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const requestHeaders = context.req.raw.headers;
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  const organizationId = session?.session.activeOrganizationId ?? null;
  const member = organizationId
    ? await auth.api.getActiveMember({
        headers: requestHeaders,
      })
    : null;

  return {
    session,
    requestHeaders,
    organizationId,
    member,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
