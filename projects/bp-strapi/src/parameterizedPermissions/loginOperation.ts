import { Variables, loginOperation } from 'bp-graphql';
import { UsersPermissionsUser } from 'bp-graphql/build/db-types';
import { OperationDefinitionNode } from 'graphql/language/ast';
import { operationDefinitionsEqual } from './operationDefinitionsEqual';
import { parseOperation } from './parseOperation';
import { getUserService } from './userService';

const { default: login, usernameVariableName } = loginOperation;

const parsedLoginOperation = parseOperation(login);

export const isLoginOperation = (operation: OperationDefinitionNode) =>
  operationDefinitionsEqual(operation, parsedLoginOperation);

export const getUserTryingToLogin = async (
  variables: Variables
): Promise<UsersPermissionsUser | null> => {
  const loggingInAs = variables[usernameVariableName];
  const users = await getUserService().fetchAll({
    filters: {
      username: loggingInAs,
    },
  });
  if (users.length > 1) {
    throw new Error('multiple users with the same name');
  }
  return users[0] ?? null;
};
