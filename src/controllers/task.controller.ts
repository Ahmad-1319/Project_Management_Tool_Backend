import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { HTTP_STATUS } from "../config/constants.js";
import * as taskService from "../services/task.service.js";

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body, req.user!.userId);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Task created successfully", task).toJSON()
  );
});

export const getProjectTasks = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const tasks = await taskService.getProjectTasks(projectId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Tasks retrieved", tasks).toJSON()
  );
});

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const task = await taskService.getTaskById(taskId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Task retrieved", task).toJSON()
  );
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const task = await taskService.updateTask(taskId, req.body, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Task updated", task).toJSON()
  );
});

export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const task = await taskService.updateTaskStatus(taskId, req.body, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Task status updated", task).toJSON()
  );
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  await taskService.deleteTask(taskId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Task deleted successfully", null).toJSON()
  );
});
