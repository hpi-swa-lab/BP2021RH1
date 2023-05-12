import { errors } from "@strapi/utils";
import type { Variables } from "bp-graphql";
import type { UsersPermissionsUser } from "bp-graphql/build/db-types";
import { OperationDefinitionNode } from "graphql/language/ast";
import { canRunOperation } from "./canRunOperation";
import { getUserPermissions } from "./getUserPermissions";
import { getJwtService, getUserService } from "./userService";

const { UnauthorizedError } = errors;

const getToken = async (ctx): Promise<{ id: string | undefined } | null> => {
  try {
    return await getJwtService().getToken(ctx);
  } catch {
    throw new UnauthorizedError();
  }
};

const authenticate = async (ctx) => {
  let token = await getToken(ctx);

  let user: UsersPermissionsUser | null = null;

  if (token) {
    const { id } = token;

    // Invalid token
    if (id === undefined) {
      return { authenticated: false };
    }

    user = await getUserService().fetchAuthenticatedUser(id);

    // No user associated to the token
    if (!user) {
      return { error: "Invalid credentials" };
    }

    // User blocked
    if (user.blocked) {
      return { error: "Invalid credentials" };
    }

    ctx.state.user = user;
  }

  const permissions = await getUserPermissions(user);

  return {
    authenticated: true,
    credentials: user,
    ability: permissions,
  };
};

const verify = async (auth, config) => {
  if ("operation" in config) {
    const {
      operation,
      variables,
    }: { operation: OperationDefinitionNode; variables: Variables } = config;

    if (!(await canRunOperation(auth, operation, variables))) {
      throw new UnauthorizedError();
    }
  } else {
    // regular graphql verify call, let it pass through unchecked
  }
};

export const authStrategy = {
  name: "parameterizedPermissions",
  authenticate,
  verify,
};
