import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

import { auth } from "./auth/auth";

export const prisma = new PrismaClient();

const app = new Elysia()
  .group('/api/auth', app => app.use(auth))
  .listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);