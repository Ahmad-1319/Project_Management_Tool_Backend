import { prisma } from "../config/db.js";
import { ApiError } from "../utils/api-error.js";
import type { CreateProjectInput, UpdateProjectInput, AddMemberInput } from "../validators/project.validator.js";

export const createProject = async (input: CreateProjectInput, ownerId: string) => {
  return prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
      ownerId,
      members: {
        create: { userId: ownerId, role: "OWNER" },
      },
    },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } } },
  });
};

export const getUserProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { members: { some: { userId } } },
    include: {
      _count: { select: { tasks: true, members: true } },
      members: {
        take: 5,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProjectById = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member) throw ApiError.forbidden("You are not a member of this project");

  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      _count: { select: { tasks: true } },
    },
  });
};

export const updateProject = async (
  projectId: string,
  input: UpdateProjectInput,
  userId: string
) => {
  await ensureOwnerOrAdmin(projectId, userId);
  return prisma.project.update({ where: { id: projectId }, data: input });
};

export const deleteProject = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw ApiError.notFound("Project not found");
  if (project.ownerId !== userId) throw ApiError.forbidden("Only the project owner can delete this project");
  await prisma.project.delete({ where: { id: projectId } });
};

export const addProjectMember = async (
  projectId: string,
  input: AddMemberInput,
  requesterId: string
) => {
  await ensureOwnerOrAdmin(projectId, requesterId);

  const userToAdd = await prisma.user.findUnique({ where: { email: input.email } });
  if (!userToAdd) throw ApiError.notFound(`No user found with email: ${input.email}`);

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: userToAdd.id } },
  });
  if (existing) throw ApiError.conflict("User is already a member of this project");

  return prisma.projectMember.create({
    data: { projectId, userId: userToAdd.id, role: input.role },
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  });
};

export const removeProjectMember = async (
  projectId: string,
  memberId: string,
  requesterId: string
) => {
  await ensureOwnerOrAdmin(projectId, requesterId);
  await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId: memberId } },
  });
};

const ensureOwnerOrAdmin = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    throw ApiError.forbidden("Only project OWNER or ADMIN can perform this action");
  }
};
