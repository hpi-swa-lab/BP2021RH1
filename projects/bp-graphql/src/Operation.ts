import { DB } from './DB';
import { ParameterizedPermission, UsersPermissionsUser } from './db-types';
import * as groups from './groups';
import * as operations from './operations';

export enum OperationType {
  query = 'query',
  mutation = 'mutation',
}

type GraphQLDocument = {
  source: string;
  name: string;
  type: OperationType;
};

const operationTypeAndName = (source: string): { type: OperationType; name: string } => {
  const match = source.match(/\s*(query|mutation) ([a-zA-Z]+)/);
  if (!match) {
    throw new Error('unknown operation type');
  }
  return {
    type: match[1] as OperationType,
    name: match[2],
  };
};

export const graphql = (parts: TemplateStringsArray): GraphQLDocument => {
  // signature disallows interpolation
  const source = parts[0];
  const { type, name } = operationTypeAndName(source);
  return {
    source,
    name,
    type,
  };
};

export const sections = [
  'picture',
  'collection',
  'tags',
  'comment',
  'archive',
  'games',
  'user',
] as const;

type Section = (typeof sections)[number];

export type GroupSettings = {
  section: Section;
  needsParameters: Parameter[];
};

export type Group = {
  name: string;
} & GroupSettings;

export type GroupName = keyof typeof groups;

export type Operations = typeof operations;

export type OperationName = keyof Operations;

export type OperationWithoutGroupName = Exclude<
  {
    [Name in OperationName]: [Name, Operations[Name]];
  }[OperationName],
  [string, { group: unknown }]
>[0];

export type PermissionName = GroupName | OperationWithoutGroupName;

export type Variables = Record<string, unknown>;

export type IsAllowedContext = {
  /**
   * the permission object that is currently checked
   */
  parameters: ParameterizedPermission;
  variables: Variables;
  db: DB;
  /**
   * all permissions the user has
   */
  permissions: ParameterizedPermission[];
  user: UsersPermissionsUser | null;
};

export type IsAllowed = (context: IsAllowedContext) => Promise<boolean>;

export type Parameter = Exclude<
  keyof ParameterizedPermission,
  'id' | 'operation_name' | 'users_permissions_user'
>;

export type Operation = {
  document: GraphQLDocument;
  /**
   * This function is executed only after it was checked that the user has
   * at least one permission to run the operation. The function is called
   * with each permission (see `IsAllowedContext.parameters`). It is intended
   * as a means to check whether the variables match the parameters,
   * the user has some other permission or to check other conditions in addition
   * to the initial check.
   */
  isAllowed: IsAllowed;
} & (
  | {
      group: GroupName;
    }
  | GroupSettings
);
