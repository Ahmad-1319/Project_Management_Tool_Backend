import rateLimit from "express-rate-limit";
import { ApiResponse } from "../utils/api-response.js";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const response = new ApiResponse(429, "Too many requests, please try again later.", null);
    res.status(429).json(response.toJSON());
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const response = new ApiResponse(429, "Too many authentication attempts, please try again later.", null);
    res.status(429).json(response.toJSON());
  },
});
