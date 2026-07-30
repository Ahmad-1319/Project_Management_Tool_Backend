import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { HTTP_STATUS } from "../config/constants.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Account created successfully", result).toJSON()
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Login successful", result).toJSON()
  );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "User profile retrieved", user).toJSON()
  );
});
