import { HTTP_STATUS } from "../config/constants.js";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: unknown[];

  constructor(
    statusCode: number,
    message: string,
    errors?: unknown[],
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, errors?: unknown[]): ApiError {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  static unauthorized(message: string = "Unauthorized"): ApiError {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = "Forbidden"): ApiError {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = "Internal server error"): ApiError {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, undefined, false);
  }
}
