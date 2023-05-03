import { getService as getUsersPermissionsService } from "@strapi/plugin-users-permissions/server/utils/index.js";
import { errors } from "@strapi/utils";
import { OperationDefinitionNode } from "graphql/language/ast";

const { UnauthorizedError } = errors;

const authenticate = async (ctx) => {
  const token = await getUsersPermissionsService("jwt").getToken(ctx);

  let permissions = [];

  if (token) {
    const { id } = token;

    // Invalid token
    if (id === undefined) {
      return { authenticated: false };
    }

    const user = await getUsersPermissionsService(
      "user"
    ).fetchAuthenticatedUser(id);

    // No user associated to the token
    if (!user) {
      return { error: "Invalid credentials" };
    }

    // User blocked
    if (user.blocked) {
      return { error: "Invalid credentials" };
    }

    ctx.state.user = user;

    const permissionsQuery = strapi.db.query(
      "api::parameterized-permission.parameterized-permission"
    );

    permissions = await permissionsQuery.findMany({
      where: {
        users_permissions_user: {
          id: { $eq: user.id },
        },
      },
    });
  } else {
    // TODO: get public permissions for user `null` or something
  }

  return {
    authenticated: true,
    ability: permissions,
  };
};

type ParameterizedPermission = {
  operation_name: string;
};

const verify = (auth, config) => {
  if ("operation" in config) {
    const permissions: ParameterizedPermission[] = auth.ability;

    const {
      operation,
      variables,
    }: { operation: OperationDefinitionNode; variables: Record<string, any> } =
      config;

    const operationName = operation.name.value;
    const authorizingPermissions = permissions.filter(
      (permission) => permission.operation_name === operationName
    );
    if (authorizingPermissions.length === 0) {
      throw new UnauthorizedError();
    }

    // TODO: check whether operation is known

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
