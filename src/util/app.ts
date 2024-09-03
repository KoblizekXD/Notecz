import Elysia, { error as logErr } from "elysia";
import { Permission, User } from "@prisma/client";
import { logger, lucia, prisma } from "..";

export class AuthError extends Error {
  constructor(public required?: Permission[]) {
    super("Unauthorized");
  }
}

export class AuthManager {
  constructor(public authorization: string | undefined) {}

  /**
   * Checks if the user is authenticated.
   * @example
   * if (await authManager.authenticated()) {
   *  // User is authenticated.
   * }
   * @returns {boolean} Whether the user is authenticated.
   */
  public async authenticated(): Promise<boolean> {
    if (
      this.authorization !== undefined &&
      (await lucia.validateSession(this.authorization)).session
    )
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
    const user = await this.getAccessingUser();
    if (!user) {
      throw new AuthError();
    }

    if (
      permissions.length > 0 &&
      !permissions.some((permission) => user.permissions.includes(permission))
    ) {
      logger.warn(
        `User(${user.id}) does not have sufficient permissions(${permissions})`,
      );
      throw new AuthError(permissions);
    }
    return user;
  }

  /**
   * Gets the user accessing the route, this step also verifies the token.
   * @returns {Promise<User | null>} The user accessing the route.
   */
  public async getAccessingUser(): Promise<User | null> {
    if (!this.authorization) throw new AuthError();
    const accessing = await lucia.validateSession(this.authorization!);
    if (!accessing.user) throw new AuthError();

    return await prisma.user.findUnique({ where: { id: accessing.user.id } });
  }
}

export const AppModule = new Elysia({ seed: "auth_app_module" })
  .error({ AuthError })
  .onError({ as: "global" }, ({ code, error }) => {
    if (code === "AuthError")
      return logErr("Unauthorized", {
        message: "You are not authorized to access this route.",
        required: error.required,
      });
  })
  .derive({ as: "global" }, ({ headers: { authorization }, cookie }) => ({
    authManager: new AuthManager(
      cookie[lucia.sessionCookieName].value || authorization,
    ),
  }));
