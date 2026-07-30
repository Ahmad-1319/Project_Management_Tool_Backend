import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/api-error.js";
import { SALT_ROUNDS } from "../config/constants.js";
import type { RegisterInput, LoginInput } from "../validators/auth.validator.js";

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict("An account with this email already exists");

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { user, token };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const token = signToken({ userId: user.id, email: user.email });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
  });
  if (!user) throw ApiError.notFound("User not found");
  return user;
};
