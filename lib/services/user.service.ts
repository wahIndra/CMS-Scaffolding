import { prisma } from "@/lib/db";
import argon2 from "argon2";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validators/user";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
};

export async function getAllUsers(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: pageSize, orderBy: { createdAt: "desc" }, select: userSelect }),
    prisma.user.count(),
  ]);
  return { users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: userSelect });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: userSelect });
}

export async function createUser(data: CreateUserInput) {
  const hashedPassword = await argon2.hash(data.password);
  return prisma.user.create({
    data: { ...data, password: hashedPassword },
    select: userSelect,
  });
}

export async function updateUser(id: string, data: Omit<UpdateUserInput, "id">) {
  const { password, ...rest } = data;
  const update: Record<string, unknown> = { ...rest };

  if (password && password.length > 0) {
    update.password = await argon2.hash(password);
  }

  return prisma.user.update({ where: { id }, data: update, select: userSelect });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
