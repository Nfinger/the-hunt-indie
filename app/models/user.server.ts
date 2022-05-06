import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAllUsers() {
  return prisma.user.findMany({ select: { id: true, createdAt: true } });
}

export async function createUser(userId: User["id"]) {

  return prisma.user.create({
    data: {
      id: userId,
    },
  });
}