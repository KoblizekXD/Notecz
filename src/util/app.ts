import Elysia, { error as logErr } from "elysia";
import { jwt, JWTPayloadSpec } from "@elysiajs/jwt";
import { Permission, User } from "@prisma/client";
import { prisma } from "..";

type jwtManager = {
  readonly sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>;
  readonly verify: (jwt?: string) => Promise<(Record<string, string | number> & JWTPayloadSpec) | false>;
}

export class AuthError extends Error {
  constructor(public required?: Permission[]) {
    super('Unauthorized');
  }
}

export class AuthManager {
  constructor(public authorization: string | undefined, public jwtManager: jwtManager) { }

  /**
   * Checks if the user is authenticated.
   * @example
   * if (await authManager.authenticated()) {
   *  // User is authenticated.
   * }
   * @returns {boolean} Whether the user is authenticated.
   */
  public async authenticated(): Promise<boolean> {
    if ((this.authorization !== undefined && await this.jwtManager.verify(this.authorization) !== false))
      return true;
    else throw new AuthError();
  }

  /**
   * Checks if the user is authorized && authenticated with permissions.
   * 
   * @param permissions permissions required to access the route.
   * @returns {boolean} Whether the user is authorized.
   */
  public async authorized(permissions: Permission[] = []): Promise<User> {
    const token = await this.jwtManager.verify(this.authorization);
    if (!token) throw new AuthError(permissions);

    const user = await prisma.user.findUnique({ where: { email: token.sub } });
    if (!user || user.permissions.every(item => permissions.includes(item))) throw new AuthError(permissions);

    return user;
  }

  /**
   * Gets the user accessing the route, this step also verifies the token.
   * @returns {Promise<User | null>} The user accessing the route.
   */
  public async getAccessingUser(): Promise<User | null> {
    const token = await this.jwtManager.verify(this.authorization);
    if (!token) throw new AuthError();

    return await prisma.user.findUnique({ where: { email: token.sub } });
  }
}

export const AppModule = new Elysia({ seed: 'auth_app_module' })
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET ?? (() => { throw new Error('JWT Secret was not found.') })(),
    exp: `${parseInt(process.env.TOKEN_EXP!) / 60 / 60 / 24}d`
  }))
  .error({ AuthError })
  .onError({ as: 'global' }, ({ code, error }) => {
    if (code === 'AuthError')
      return logErr('Unauthorized', { message: 'You are not authorized to access this route.', required: error.required });
  })
  .derive({ as: 'global' }, ({ headers: { authorization }, jwt }) => ({
    authManager: new AuthManager(authorization, jwt)
  }));