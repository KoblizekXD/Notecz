import { beforeAll, describe, expect, it } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { app, logger, prisma } from '../src';

const eden = treaty(app);
let session;

describe('Authentication', () => {
  beforeAll(async () => {
    logger.info('Removing test user, which might exist');
    await prisma.user
      .delete({ where: { email: 'test@test.com' } })
      .catch(() => {});
  });

  it('Allows signup', async () => {
    const resp = await eden.api.auth.signup.post({
      username: 'test',
      email: 'test@test.com',
      password: 'Password123',
    });
    expect(resp.status).toBe(201);
    session = (resp.headers as Headers).getSetCookie();
  });

  it('Does not allow duplicate signup', async () => {
    const resp = await eden.api.auth.signup.post({
      username: 'test',
      email: 'test@test.com',
      password: 'Password123',
    });
    expect(resp.status).toBe(409);
  });

  it('Correctly validates input data', async () => {
    const resp = await eden.api.auth.signup.post({
      username: 'test',
      email: 'test@test.com',
      password: 'p',
    });
    expect(resp.status).toBe(422);
  });

  it('Disallows login with incorrect user details', async () => {
    const resp = await eden.api.auth.signin.post({
      email: 'test@test.com',
      password: 'Password1234',
    });
    expect((resp.headers as Headers).get('set-cookie')).toSatisfy(
      (c) => c === null || c === undefined,
    );
  });

  it('Allows login', async () => {
    const resp = await eden.api.auth.signin.post({
      email: 'test@test.com',
      password: 'Password123',
    });
    expect(resp.status).toBe(200);
    session = (resp.headers as Headers).getSetCookie()[0];
    expect(session).toBeDefined();
  });

  it('Correctly identifies access to the route', async () => {
    let resp = await eden.api.notes.index.post(
      {
        title: 'Test note',
        content: 'Test content, this is test, again',
      },
      {
        headers: {
          cookie: session!,
        },
      },
    );
    expect(resp.status).toBe(201);
    resp = await eden.api.notes.index.post({
      title: 'Test note',
      content: 'Test content, this is test, again',
    });
    expect(resp.status).toBe(401);
  });

  it('Correctly logs out', async () => {
    const resp = await eden.api.auth.signout.post(
      {},
      { query: { all: true }, fetch: { headers: { cookie: session! } } },
    );

    expect(resp.status).toBe(200);
    expect(resp.data?.count).toBe(2);
  });
});
