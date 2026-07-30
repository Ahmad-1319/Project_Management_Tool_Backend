import { prisma } from "../config/db.js";
import type { NotificationType } from "../types/index.js";

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string
) => {
  return prisma.notification.create({
    data: { userId, type, title, message },
  });
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
};

export const markNotificationRead = async (notificationId: string, userId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

export const markAllNotificationsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};
