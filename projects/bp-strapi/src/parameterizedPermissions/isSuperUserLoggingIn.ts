import { Variables, loginOperation } from "bp-graphql";
import { OperationDefinitionNode } from "graphql/language/ast";
import { operationDefinitionsEqual } from "./operationDefinitionsEqual";
import { parseOperation } from "./parseOperation";
import { getUserService } from "./userService";

const { default: login, usernameVariableName } = loginOperation;

const parsedLoginOperation = parseOperation(login);

// see the comment below the call in authStrategy.ts for an explanation
export const isSuperUserLoggingIn = async (
  operation: OperationDefinitionNode,
  variables: Variables
) => {
  if (!operationDefinitionsEqual(operation, parsedLoginOperation)) {
    return false;
  }
  const loggingInAs = variables[usernameVariableName];
  const users = await getUserService().fetchAll({
    where: {
      username: loggingInAs,
    },
  });
  return users.some((user) => user.isSuperUser);
};
