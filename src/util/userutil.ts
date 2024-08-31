import { type Prisma } from "@prisma/client";
import { prisma } from "..";

export const createUser = async (user: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: user,
  });
};

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};
