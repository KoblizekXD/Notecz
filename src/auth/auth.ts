import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { jwt } from '@elysiajs/jwt'
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const auth = new Elysia()
.use(jwt({
  name: 'jwt',
  secret: process.env.JWT_SECRET ?? (() => { throw new Error('JWT Secret was not found.') })(),
  exp: `${parseInt(process.env.TOKEN_EXPIRE!) / 60 / 60 / 24}d`
}))
.post('/signup', async ({body, jwt}) => {
  
  await prisma.user.create({
    data: {
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password
    }
  }).catch(err => {
    if (err instanceof PrismaClientValidationError) {
      return new Response(err.message, { status: 400 })
    } else return new Response(err, { status: 500 })
  })
  return new Response(JSON.stringify({ token: await jwt.sign({
    iss: 'notecz',
    sub: body.email,
    iat: new Date().getTime()
  }), expiresIn: process.env.TOKEN_EXP }), { status: 201 })
}, {
  body: t.Object({
    username:    t.String({ minLength: 3, maxLength: 16 }),
    email:       t.String({ format: 'email' }),
    name:        t.MaybeEmpty(t.String({ minLength: 3, maxLength: 16 })),
    password:    t.String({ minLength: 8, maxLength: 32 }),
  })
})
.post('/signin', async ({body, jwt}) => {
  
}, {
  body: t.Object({
    email: t.String(),
    password: t.String()
  })
})