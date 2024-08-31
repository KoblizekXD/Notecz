import Elysia from "elysia";
import { PrismaClient } from "@prisma/client";

import { pino } from "pino";

import { auth } from "./routes/auth/auth";
import { AppModule } from "./util/app";
import { notes } from "./routes/user/notes";
import { user } from "./routes/user/user";
import swagger from "@elysiajs/swagger";
import { Lucia, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

export const prisma = new PrismaClient();
export const logger = pino();

export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  sessionExpiresIn: new TimeSpan(
    parseInt(
      process.env.TOKEN_EXP ??
        (() => {
          throw new Error("Token expiration was not set");
        })(),
    ),
    "s",
  ),
});

const app = new Elysia()
  .use(AppModule)
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Notecz API documentation",
          description: "Development documentation for the Notecz public API",
          version: "1.0.0",
        },
        tags: [
          {
            name: "Authentication",
            description:
              "Authentication endpoints. Authentication in Notecz is session based. Some requests might require session cookie to be present",
          },
          {
            name: "Notes",
            description: "Endpoints for interacting with notes",
          },
          {
            name: "User",
            description:
              "Endpoints for interacting with users(primarily fetching information)",
          },
        ],
        components: {
          securitySchemes: {
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "session",
            },
          },
        },
      },
    }),
  )
  .group("/api/auth", (app) => app.use(auth))
  .group("/api/notes", (app) => app.use(notes))
  .group("/api/users", (app) => app.use(user))
  .listen(3000);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
