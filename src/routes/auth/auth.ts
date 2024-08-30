import { Elysia, error, t } from 'elysia';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { findByEmail, createUser } from '../../util/userutil';
import { password } from 'bun';
import { lucia, prisma } from '../..';

export const auth = new Elysia()
  .post('/signup', async ({ body }) => {

    if (await findByEmail(body.email)) {
      return error('Conflict', { message: 'Email already used.' });
    }
    const user = await createUser({
      username: body.username,
      email: body.email,
      name: body.name,
      password: await password.hash(body.password)
    })
    
    return Response.json({
      session: (await lucia.createSession(user.id, {})).id,
      expiresIn: process.env.TOKEN_EXP
    }, { status: 201 })
  }, {
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
          description: 'User was created successfully, the response body will contain a JWT token',
          content: {
            'application/json': {
              schema: t.Object({
                token: t.String(),
                expiresIn: t.String()
              })
            }
          }
        },
        400: {
          description: 'Validation failed, the response body will contain an error message',
          content: {
            'application/json': {
              schema: t.Object({
                message: t.String({ default: 'Validation failed.' }),
                details: t.String()
              })
            }
          }
        }
      }
    }
  })
  .post('/signin', async ({ body }) => {
    const user = await findByEmail(body.email);

    if (!user || !await password.verify(body.password, user.password)) {
      return error('Unauthorized', { message: 'Invalid credentials.' });
    }

    return Response.json({
      session: (await lucia.createSession(user.id, {})).id,
      expiresIn: process.env.TOKEN_EXP
    }, { status: 201 })
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ minLength: 8, maxLength: 32 })
    }),
    detail: {
      tags: ['Authentication'],
      description: 'Checks credentials and signs in a user and returns a JWT token',
      responses: {
        200: {
          description: 'Request was successful, the response body will contain a JWT token',
          content: {
            'application/json': {
              schema: t.Object({
                token: t.String(),
                expiresIn: t.String()
              })
            }
          }
        },
        401: {
          description: 'The credentials were incorrect',
          content: {
            'application/json': {
              schema: t.Object({
                message: t.String({ default: 'Invalid credentials.' })
              })
            }
          }
        }
      }
    }
  })
  .post('/signout', ({ headers }) => {

  }, {
    headers: t.Object({
      authorization: t.String()
    }),
    detail: {
      tags: ['Authentication'],
      description: 'Signs out a user by invalidating their session',
      responses: {
        200: {
          description: 'Request was successful, the user was signed out'
        },
        401: {
          description: 'The session was invalid or expired',
          content: {
            'application/json': {
              schema: t.Object({
                message: t.String({ default: 'Invalid session.' })
              })
            }
          }
        }
      }
    }
  })