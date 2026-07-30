import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { HTTP_STATUS } from "../config/constants.js";
import * as projectService from "../services/project.service.js";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body, req.user!.userId);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Project created successfully", project).toJSON()
  );
});

export const getMyProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.getUserProjects(req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Projects retrieved", projects).toJSON()
  );
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const project = await projectService.getProjectById(projectId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Project retrieved", project).toJSON()
  );
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const project = await projectService.updateProject(projectId, req.body, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Project updated successfully", project).toJSON()
  );
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  await projectService.deleteProject(projectId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Project deleted successfully", null).toJSON()
  );
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const member = await projectService.addProjectMember(projectId, req.body, req.user!.userId);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Member added successfully", member).toJSON()
  );
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const projectId = req.params.projectId as string;
  const memberId = req.params.memberId as string;
  await projectService.removeProjectMember(projectId, memberId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Member removed successfully", null).toJSON()
  );
});
