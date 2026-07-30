import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/api-error.js";

type ValidateTarget = "body" | "params" | "query";

export const validate =
  (schema: ZodSchema, target: ValidateTarget = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      next(ApiError.badRequest("Validation failed", [errors]));
      return;
    }
    req[target] = result.data;
    next();
  };
