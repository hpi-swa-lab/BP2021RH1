import { errors } from "@strapi/utils";
import type { Variables } from "bp-graphql";
import type {
  ParameterizedPermission,
  UsersPermissionsUser,
} from "bp-graphql/build/db-types";
import { OperationDefinitionNode } from "graphql/language/ast";
import { checkAllowed } from "./checkAllowed";
import { isIntrospectionQuery } from "./isIntrospectionQuery";
import { isSuperUserLoggingIn } from "./isSuperUserLoggingIn";
import { getJwtService, getUserService } from "./userService";
import { verifyOperation } from "./verifyOperation";

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

  let permissions = [];

  const permissionsQuery = strapi.db.query(
    "api::parameterized-permission.parameterized-permission"
  );
  const permissionsPopulate = ["users_permissions_user", "archive_tag"];

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

    permissions = await permissionsQuery.findMany({
      where: {
        users_permissions_user: {
          id: { $eq: user.id },
        },
      },
      populate: permissionsPopulate,
    });
  } else {
    permissions = await permissionsQuery.findMany({
      where: {
        users_permissions_user: {
          id: { $null: true },
        },
      },
      populate: permissionsPopulate,
    });
  }

  return {
    authenticated: true,
    credentials: user,
    ability: permissions,
  };
};

const verify = async (auth, config) => {
  if ("operation" in config) {
    const permissions: ParameterizedPermission[] = auth.ability;
    const user: UsersPermissionsUser | null = auth.credentials;

    if (user?.isSuperUser) {
      // allow everything, regardless of permissions
      // this is intended for bootstrapping and emergency purposes only
      return;
    }

    const {
      operation,
      variables,
    }: { operation: OperationDefinitionNode; variables: Variables } = config;

    if (await isSuperUserLoggingIn(operation, variables)) {
      // Let anyone attempt to login as a super user
      // as it can happen that the public user doesn't have
      // the permission to login and we still want super users
      // to gain access.
      // The function only checks whether a super user with the given
      // username exists, the actual password check is done by the
      // login mutation resolver. So this only allows the *attempt*
      // to login and doesn't let anyone pass through without them
      // knowing the super user's password.
      return;
    }

    if (isIntrospectionQuery(operation)) {
      // allow
      return;
    }

    const operationName = operation.name.value;
    const authorizingPermissions = permissions.filter(
      (permission) => permission.operation_name === operationName
    );
    if (authorizingPermissions.length === 0) {
      throw new UnauthorizedError();
    }

    verifyOperation(operation);

    await checkAllowed(
      operationName,
      authorizingPermissions,
      permissions,
      variables,
      user
    );
  } else {
    // regular graphql verify call, let it pass through unchecked
  }
};

export const authStrategy = {
  name: "parameterizedPermissions",
  authenticate,
  verify,
};
