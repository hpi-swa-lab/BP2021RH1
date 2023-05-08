import { getService as getUsersPermissionsService } from "@strapi/plugin-users-permissions/server/utils/index.js";
import { errors } from "@strapi/utils";
import type { UsersPermissionsUser } from "bp-graphql/build/db-types";
import { OperationDefinitionNode } from "graphql/language/ast";
import { isIntrospectionQuery } from "./isIntrospectionQuery";
import { verifyOperation } from "./verifyOperation";

const { UnauthorizedError } = errors;

const getToken = async (ctx): Promise<{ id: string | undefined } | null> => {
  try {
    return await getUsersPermissionsService("jwt").getToken(ctx);
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

    user = await getUsersPermissionsService("user").fetchAuthenticatedUser(id);

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

type ParameterizedPermission = {
  operation_name: string;
};

const verify = (auth, config) => {
  if ("operation" in config) {
    const permissions: ParameterizedPermission[] = auth.ability;
    const user: UsersPermissionsUser | null = auth.credentials;

    const {
      operation,
      variables,
    }: { operation: OperationDefinitionNode; variables: Record<string, any> } =
      config;

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

    // TODO: run custom check on authorizingPermissions, using variables
  } else {
    // regular graphql verify call, let it pass through unchecked
  }
};

export const authStrategy = {
  name: "parameterizedPermissions",
  authenticate,
  verify,
};
