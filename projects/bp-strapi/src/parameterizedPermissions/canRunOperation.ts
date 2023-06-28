import { OperationName, Variables } from 'bp-graphql';
import { OperationDefinitionNode } from 'graphql/language/ast';
import { ParameterizedPermissionsAuth } from '../types';
import { checkAllowed } from './checkAllowed';
import { getUserPermissions } from './getUserPermissions';
import { isEssential } from './isEssential';
import { isIntrospectionQuery } from './isIntrospectionQuery';
import { getUserTryingToLogin, isLoginOperation } from './loginOperation';
import { verifyOperation } from './verifyOperation';

export const canRunWithSomeVariables = Symbol('canRunWithSomeVariables');

export const canRunOperation = async (
  auth: ParameterizedPermissionsAuth,
  operation: OperationDefinitionNode,
  variables: Variables | typeof canRunWithSomeVariables
) => {
  let { ability: permissions, credentials: user } = auth;

  if (isIntrospectionQuery(operation)) {
    // allow
    return true;
  }

  if (variables !== canRunWithSomeVariables && isLoginOperation(operation)) {
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

  if (!verifyOperation(operation)) {
    return false;
  }

  const operationName = operation.name!.value as OperationName;

  if (isEssential(operationName)) {
    return true;
  }

  const authorizingPermissions = permissions.filter(
    permission => permission.operation_name === operationName
  );
  if (variables === canRunWithSomeVariables) {
    return authorizingPermissions.length >= 1;
  }
  if (authorizingPermissions.length === 0) {
    return false;
  }

  return await checkAllowed(operationName, authorizingPermissions, permissions, variables, user);
};
