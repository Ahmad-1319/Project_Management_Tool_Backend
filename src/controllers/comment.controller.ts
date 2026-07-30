import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { HTTP_STATUS } from "../config/constants.js";
import * as commentService from "../services/comment.service.js";

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const { content } = req.body;
  const comment = await commentService.createComment(taskId, content, req.user!.userId);
  res.status(HTTP_STATUS.CREATED).json(
    new ApiResponse(HTTP_STATUS.CREATED, "Comment added", comment).toJSON()
  );
});

export const getTaskComments = asyncHandler(async (req: Request, res: Response) => {
  const taskId = req.params.taskId as string;
  const comments = await commentService.getTaskComments(taskId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Comments retrieved", comments).toJSON()
  );
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const commentId = req.params.commentId as string;
  await commentService.deleteComment(commentId, req.user!.userId);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, "Comment deleted", null).toJSON()
  );
});
