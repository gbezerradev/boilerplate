import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { isAppError } from "../../lib/errors";

/** Converts application errors into the stable HTTP error contract. */
export function respondWithError(context: Context, error: unknown): Response {
  if (isAppError(error)) {
    return context.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
      },
      error.statusCode as ContentfulStatusCode,
    );
  }

  return context.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    },
    500,
  );
}
