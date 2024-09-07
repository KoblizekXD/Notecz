import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import Elysia from "elysia";
import { Lucia, TimeSpan } from "lucia";
import pino from "pino";

export const prisma = new PrismaClient();
export const logger = pino();

export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  sessionExpiresIn: new TimeSpan(
    parseInt(
      process.env.TOKEN_EXP ??
        (() => {
          throw new Error('Token expiration was not set');
        })(),
    ),
    's',
  ),
});

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

export const encode = async (pass: string) => {
  return await Bun.password.hash(pass);
}

export const verify = async (pass: string, hash: string) => {
  return await Bun.password.verify(pass, hash);
}

export const elysia = new Elysia({ prefix: '/api' })