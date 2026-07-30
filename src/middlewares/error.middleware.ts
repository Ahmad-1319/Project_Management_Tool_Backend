import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    logger.warn(`[${err.statusCode}] ${req.method} ${req.path} — ${err.message}`);
    const response = new ApiResponse(err.statusCode, err.message, err.errors ?? null);
    res.status(err.statusCode).json(response.toJSON());
    return;
  }

  if (err instanceof ZodError) {
    const response = new ApiResponse(400, "Validation error", err.flatten().fieldErrors);
    res.status(400).json(response.toJSON());
    return;
  }

  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });

  const message = env.NODE_ENV === "production" ? "Internal server error" : err.message;
  const response = new ApiResponse(500, message, null);
  res.status(500).json(response.toJSON());
};
