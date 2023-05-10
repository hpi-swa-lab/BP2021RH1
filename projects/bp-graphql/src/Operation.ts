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

export type Variables = Record<string, any>;

export type IsAllowedContext = {
  parameters: ParameterizedPermission;
  variables: Variables;
  db: DB;
  permissions: ParameterizedPermission[];
  user: UsersPermissionsUser;
};

export type IsAllowed = (context: IsAllowedContext) => Promise<boolean>;

export type Parameter = Exclude<
  keyof ParameterizedPermission,
  'id' | 'operation_name' | 'users_permissions_user'
>;

export type Operation = {
  document: GraphQLDocument;
  isAllowed: IsAllowed;
} & (
  | {
      group: GroupName;
    }
  | GroupSettings
);
