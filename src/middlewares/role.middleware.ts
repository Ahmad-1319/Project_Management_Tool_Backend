import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";
import { ProjectRole } from "../types/index.js";

export const requireProjectRole =
  (...allowedRoles: ProjectRole[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const { projectId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      next(ApiError.unauthorized());
      return;
    }

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) {
      next(ApiError.forbidden("You are not a member of this project"));
      return;
    }

    if (!allowedRoles.includes(member.role as ProjectRole)) {
      next(ApiError.forbidden("Insufficient permissions for this action"));
      return;
    }

    next();
  };
