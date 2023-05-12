import { errors } from "@strapi/utils";
import type { Variables } from "bp-graphql";
import type {
  ParameterizedPermission,
  UsersPermissionsUser,
} from "bp-graphql/build/db-types";
import { OperationDefinitionNode } from "graphql/language/ast";
import { checkAllowed } from "./checkAllowed";
import { getUserPermissions } from "./getUserPermissions";
import { isIntrospectionQuery } from "./isIntrospectionQuery";
import { getUserTryingToLogin, isLoginOperation } from "./loginOperation";
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

export const canRunOperation = async (
  auth: {
    ability: ParameterizedPermission[];
    credentials: UsersPermissionsUser | null;
  },
  operation: OperationDefinitionNode,
  variables: Variables
) => {
  let { ability: permissions, credentials: user } = auth;

  if (isIntrospectionQuery(operation)) {
    // allow
    return true;
  }

  if (isLoginOperation(operation)) {
    // Act as if the (currently not logged in) user has the permissions
    // of the user as which they are trying to login.
    // With this code, only users who have the permission to run the login
    // operation are allowed to login. Otherwise, the only way to control
    // whether someone can login is to give the public user the permission
    // to login.
    // This has the added benefit of super users always being able to login,
    // because of the next if statement.
    // This is not a loophole to get anyone's permissions since the permissions
    // are only granted in case of the login operation and only for the remainder
    // of this function (user and permissions are local variables). Also, the
    // actual resolver of the login operation still checks for the correct password.
    user = await getUserTryingToLogin(variables);
    permissions = await getUserPermissions(user);
  }

  if (user?.isSuperUser) {
    // allow everything, regardless of permissions
    // this is intended for bootstrapping and emergency purposes only
    return true;
  }

  const operationName = operation.name.value;
  const authorizingPermissions = permissions.filter(
    (permission) => permission.operation_name === operationName
  );
  if (authorizingPermissions.length === 0) {
    return false;
  }

  if (!verifyOperation(operation)) {
    return false;
  }

  return await checkAllowed(
    operationName,
    authorizingPermissions,
    permissions,
    variables,
    user
  );
};

export const authStrategy = {
  name: "parameterizedPermissions",
  authenticate,
  verify,
};
