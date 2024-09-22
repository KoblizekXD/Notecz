import { Elysia, error, t } from 'elysia';
import { findByEmail, createUser, encode, verify } from '@/lib/util';
import { logger, lucia } from '@/lib/util';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/signup',
    async ({ body, set }) => {
      if (await findByEmail(body.email)) {
        return error('Conflict', { message: 'Email already used.' });
      }
      const user = await createUser({
        username: body.username,
        email: body.email,
        name: body.name,
        password: await encode(body.password),
      }).catch((e) => {
        if (e instanceof PrismaClientKnownRequestError) return e;
      });

      if (user instanceof PrismaClientKnownRequestError) {
        return error('Conflict', {
          message: 'Validation error.',
          details: user.message,
        });
      } else if (user) {
        const session = (await lucia.createSession(user.id, {})).id;
        const cookie = lucia.createSessionCookie(session);
        set.headers['set-cookie'] = cookie.serialize();
        logger.info(`New account created: ${user.username}(${user.id})`);
        return Response.json(
          {
            expiresIn: process.env.TOKEN_EXP,
          },
          { status: 201 },
        );
      }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3, maxLength: 16 }),
        email: t.String({ format: 'email' }),
        name: t.Optional(t.String({ minLength: 3, maxLength: 16 })),
        password: t.String({ minLength: 8, maxLength: 32 }),
      }),
      detail: {
        tags: ['Authentication'],
        responses: {
          201: {
            description:
              'User was created successfully, the session cookie has been set',
            content: {
              'application/json': {
                schema: t.Object({
                  expiresIn: t.String(),
                }),
              },
            },
          },
          400: {
            description:
              'Validation failed, the response body will contain an error message',
            content: {
              'application/json': {
                schema: t.Object({
                  message: t.String({ default: 'Validation failed.' }),
                  details: t.String(),
                }),
              },
            },
          },
          409: {
            description: 'The email is already in use',
            content: {
              'application/json': {
                schema: t.Object({
                  message: t.String({ default: 'Email already used.' }),
                }),
              },
            },
          },
        },
      },
    },
  )
  .post(
    '/signin',
    async ({ body, set }) => {
      const user = await findByEmail(body.email);

      if (!user || !(await verify(body.password, user.password))) {
        return error('Unauthorized', { message: 'Invalid credentials.' });
      }

      const session = (await lucia.createSession(user.id, {})).id;
      const cookie = lucia.createSessionCookie(session);
      set.headers['set-cookie'] = cookie.serialize();

      return Response.json(
        {
          expiresIn: process.env.TOKEN_EXP,
        },
        { status: 200 },
      );
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8, maxLength: 32 }),
      }),
      detail: {
        tags: ['Authentication'],
        description:
          'Checks credentials and signs in a user, setting a session cookie.',
        responses: {
          200: {
            description: 'Request was successful, the session cookie was set',
            content: {
              'application/json': {
                schema: t.Object({
                  expiresIn: t.String(),
                }),
              },
            },
          },
          401: {
            description: 'The credentials were incorrect',
            content: {
              'application/json': {
                schema: t.Object({
                  message: t.String({ default: 'Invalid credentials.' }),
                }),
              },
            },
          },
        },
      },
    },
  )
  .post(
    '/signout',
    async ({ cookie, query }) => {
      const session = cookie[lucia.sessionCookieName];

      if (session.value) {
        const userId = (await lucia.validateSession(session.value)).user?.id!;
        logger.info(`Signing out: ${session.value}(all: ${query.all})`);

        const sc = (await lucia.getUserSessions(userId)).length;

        if (query.all) {
          await lucia.invalidateUserSessions(userId);
        } else await lucia.invalidateSession(session.value);

        const blank = lucia.createBlankSessionCookie();

        session.set({
          value: blank.value,
          ...blank.attributes,
        });

        return {
          count: Math.abs(sc - (await lucia.getUserSessions(userId)).length),
        };
      }

      return error('Unauthorized', { message: 'You are not signed in.' });
    },
    {
      query: t.Object({
        all: t.Optional(t.Boolean()),
      }),
      detail: {
        tags: ['Authentication'],
        description: 'Signs out a user by invalidating their session',
        responses: {
          200: {
            description:
              'Request was successful, the user was signed out. The count of invalidated sessions is returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: {
                      type: 'number',
                      description: 'The count of invalidated sessions',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'The user was not signed in(or cookie was not set)',
          },
        },
        parameters: [
          {
            name: 'all',
            description:
              'If true, all sessions for the user will be invalidated(will be signed out from all devices)',
            in: 'query',
            schema: t.Boolean(),
          },
        ],
        security: [
          {
            cookieAuth: [],
          },
        ],
      },
    },
  );
