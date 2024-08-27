import Elysia, { error } from "elysia";
import { Permission, PrismaClient } from "@prisma/client";

import { pino } from "pino";
import { jwt } from '@elysiajs/jwt'

import { auth } from "./routes/auth/auth";
import { AppModule } from "./util/app";
import { notes } from "./routes/user/notes";
import { user } from "./routes/user/user";
import swagger from "@elysiajs/swagger";

export const prisma = new PrismaClient();
export const logger = pino();

const app = new Elysia()
  .use(AppModule)
  .use(swagger({ documentation: {
    info: {
      title: 'Notecz API documentation',
      description: 'Development documentation for the Notecz public API',
      version: '1.0.0'
    },
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Notes', description: 'Endpoints for interacting with notes' },
      { name: 'User', description: 'Endpoints for interacting with users(primarily fetching information)' }
    ]
  } }))
  .group('/api/auth', app => app.use(auth))
  .group('/api/notes', app => app.use(notes))
  .group('/api/users', app => app.use(user))
  .listen(3000);
  
logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)