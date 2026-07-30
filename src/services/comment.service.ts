import { prisma } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";

export const createComment = async (taskId: string, content: string, authorId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw ApiError.notFound("Task not found");

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId: authorId } },
  });
  if (!member) throw ApiError.forbidden("You are not a member of this project");

  return prisma.comment.create({
    data: { content, taskId, authorId },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });
};

export const getTaskComments = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw ApiError.notFound("Task not found");

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId } },
  });
  if (!member) throw ApiError.forbidden("Access denied");

  return prisma.comment.findMany({
    where: { taskId },
    include: { author: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: "asc" },
  });
};

export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw ApiError.notFound("Comment not found");
  if (comment.authorId !== userId) throw ApiError.forbidden("You can only delete your own comments");
  await prisma.comment.delete({ where: { id: commentId } });
};
