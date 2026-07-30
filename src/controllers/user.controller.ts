import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { HTTP_STATUS } from "../config/constants.js";
import * as notificationService from "../services/notification.service.js";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotifications(req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Notifications retrieved", notifications).toJSON()
  );
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId as string;
  await notificationService.markNotificationRead(notificationId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Notification marked as read", null).toJSON()
  );
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllNotificationsRead(req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "All notifications marked as read", null).toJSON()
  );
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") throw ApiError.badRequest("Email query param is required");

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, avatar: true },
  });
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "User lookup result", user).toJSON()
  );
});
