export type ErrorCode =
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "NOT_FOUND"
  | "REPOSITORY_ERROR"
  | "INTERNAL_ERROR";

export interface AppErrorOptions {
  cause?: unknown;
  details?: unknown;
  statusCode?: number;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = "INTERNAL_ERROR",
    options: AppErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "The supplied data is invalid", details?: unknown) {
    super(message, "VALIDATION_ERROR", { details, statusCode: 400 });
    this.name = "ValidationError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "The requested resource conflicts with existing data") {
    super(message, "CONFLICT", { statusCode: 409 });
    this.name = "ConflictError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(message, "NOT_FOUND", { statusCode: 404 });
    this.name = "NotFoundError";
  }
}

export class RepositoryError extends AppError {
  constructor(message = "The repository operation failed", cause?: unknown) {
    super(message, "REPOSITORY_ERROR", { cause, statusCode: 500 });
    this.name = "RepositoryError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
