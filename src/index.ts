import { Elysia } from "elysia";

import { auth } from "./auth/auth";

const app = new Elysia()
  .group('/api/auth', app => app.use(auth))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
