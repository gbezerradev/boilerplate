import { type ErrorCode, isAppError } from "@boilerplate/core";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const statusByErrorCode: Record<ErrorCode, ContentfulStatusCode> = {
  VALIDATION_ERROR: 400,
  CONFLICT: 409,
  NOT_FOUND: 404,
  REPOSITORY_ERROR: 500,
  INTERNAL_ERROR: 500,
};

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
      statusByErrorCode[error.code],
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
