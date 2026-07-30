import { prisma } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";
import type { CreateTaskInput, UpdateTaskInput, UpdateTaskStatusInput } from "../validators/task.validator.js";

const TASK_SELECT = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  position: true,
  dueDate: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
  assignee: { select: { id: true, name: true, avatar: true } },
  createdBy: { select: { id: true, name: true, avatar: true } },
  _count: { select: { comments: true } },
} as const;

export const createTask = async (input: CreateTaskInput, createdById: string) => {
  const lastTask = await prisma.task.findFirst({
    where: { projectId: input.projectId, status: "TODO" },
    orderBy: { position: "desc" },
  });
  const position = (lastTask?.position ?? 0) + 1000;

  return prisma.task.create({
    data: { ...input, createdById, position },
    select: TASK_SELECT,
  });
};

export const getProjectTasks = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) throw ApiError.forbidden("Access denied to this project");

  return prisma.task.findMany({
    where: { projectId },
    select: TASK_SELECT,
    orderBy: [{ status: "asc" }, { position: "asc" }],
  });
};

export const getTaskById = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw ApiError.notFound("Task not found");

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: task.projectId, userId } },
  });
  if (!member) throw ApiError.forbidden("Access denied");

  return prisma.task.findUnique({ where: { id: taskId }, select: TASK_SELECT });
};

export const updateTask = async (taskId: string, input: UpdateTaskInput, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw ApiError.notFound("Task not found");
  await ensureTaskAccess(task.projectId, userId);
  return prisma.task.update({ where: { id: taskId }, data: input, select: TASK_SELECT });
};

export const updateTaskStatus = async (
  taskId: string,
  input: UpdateTaskStatusInput,
  userId: string
) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw ApiError.notFound("Task not found");
  await ensureTaskAccess(task.projectId, userId);

  return prisma.task.update({
    where: { id: taskId },
    data: { status: input.status, position: input.position },
    select: TASK_SELECT,
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw ApiError.notFound("Task not found");
  await ensureTaskAccess(task.projectId, userId);
  await prisma.task.delete({ where: { id: taskId } });
};

const ensureTaskAccess = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) throw ApiError.forbidden("Access denied");
};
