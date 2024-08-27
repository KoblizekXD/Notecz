import { Elysia, error, t } from 'elysia';
import { jwt } from '@elysiajs/jwt'
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { findByEmail, createUser } from '../../util/userutil';
import { password } from 'bun';

export const auth = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET ?? (() => { throw new Error('JWT Secret was not found.') })(),
    exp: `${parseInt(process.env.TOKEN_EXP!) / 60 / 60 / 24}d`
  }))
  .post('/signup', async ({ body, jwt }) => {

    if (await findByEmail(body.email)) {
      return error('Conflict', { message: 'Email already used.' });
    }

    await createUser({
      username: body.username,
      email: body.email,
      name: body.name,
      password: await password.hash(body.password)
    }).catch(err => {
      console.error(err);
      if (err instanceof PrismaClientValidationError) {
        return error('Bad Request', { message: 'Validation failed.', details: err.message });
      } else return error('Internal Server Error', { message: 'An error occurred while creating the user.' });
    })

    return new Response(JSON.stringify({
      token: await jwt.sign({
        iss: 'notecz',
        sub: body.email,
        iat: new Date().getTime()
      }), expiresIn: process.env.TOKEN_EXP
    }), { status: 201 })
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
  .post('/signin', async ({ body, jwt, set }) => {
    const user = await findByEmail(body.email);

    if (!user || !await password.verify(body.password, user.password)) {
      return error('Unauthorized', { message: 'Invalid credentials.' });
    }

    return new Response(JSON.stringify({
      token: await jwt.sign({
        iss: 'notecz',
        sub: body.email,
        iat: new Date().getTime()
      }), expiresIn: parseInt(process.env.TOKEN_EXP!)
    }), { status: 200 })
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