import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./api-error.js";

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const signToken = (payload: Omit<JwtPayload, "iat" | "exp">): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
};
