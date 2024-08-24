import Elysia, { error } from "elysia";
import { Permission, PrismaClient } from "@prisma/client";

import { pino } from "pino";
import { jwt } from '@elysiajs/jwt'

import { auth } from "./auth/auth";
import { AppModule } from "./util/app";

export const prisma = new PrismaClient();
export const logger = pino();
export const jwtConfig = jwt({
  name: 'jwt',
  secret: process.env.JWT_SECRET ?? (() => { throw new Error('JWT Secret was not found.') })(),
  exp: `${parseInt(process.env.TOKEN_EXP!) / 60 / 60 / 24}d`
})

const app = new Elysia()
  .use(AppModule)
  .group('/api/auth', app => app.use(auth))
  .listen(3000);
  
logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)