import { auth } from '@/app/api/[[...slugs]]/auth';
import { user } from '@/app/api/[[...slugs]]/user';
import { notes } from '@/app/api/[[...slugs]]/user/note';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import Elysia from 'elysia';
import { Lucia, TimeSpan } from 'lucia';
import pino from 'pino';
import { AppModule } from './authlib';
import swagger from '@elysiajs/swagger';
import { cookies } from 'next/headers';

export const prisma = new PrismaClient();
export const logger = pino();

export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  sessionExpiresIn: new TimeSpan(
    parseInt(process.env.TOKEN_EXP ?? '3600'),
    's',
  ),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}

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
};

export const verify = async (pass: string, hash: string) => {
  return await Bun.password.verify(pass, hash);
};

export const elysia = new Elysia({ prefix: '/api' })
  .use(AppModule)
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'Notecz API documentation',
          description: 'Development documentation for the Notecz public API',
          version: '1.0.0',
        },
        tags: [
          {
            name: 'Authentication',
            description:
              'Authentication endpoints. Authentication in Notecz is session based. Some requests might require session cookie to be present',
          },
          {
            name: 'Notes',
            description: 'Endpoints for interacting with notes',
          },
          {
            name: 'User',
            description:
              'Endpoints for interacting with users(primarily fetching information)',
          },
        ],
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'session',
            },
          },
        },
      },
    }),
  )
  .use(auth)
  .use(user)
  .use(notes);
