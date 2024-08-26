import Elysia, { error } from "elysia";
import { Permission, PrismaClient } from "@prisma/client";

import { pino } from "pino";
import { jwt } from '@elysiajs/jwt'

import { auth } from "./routes/auth/auth";
import { AppModule } from "./util/app";
import { notes } from "./routes/user/notes";
import { user } from "./routes/user/user";

export const prisma = new PrismaClient();
export const logger = pino();

const app = new Elysia()
  .use(AppModule)
  .group('/api/auth', app => app.use(auth))
  .group('/api/notes', app => app.use(notes))
  .group('/api/users', app => app.use(user))
  .listen(3000);
  
logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)