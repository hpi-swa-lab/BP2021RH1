import { DB, ID } from './DB';
import { IsAllowed, IsAllowedContext, Variables } from './Operation';
import { Maybe, ParameterizedPermission } from './db-types';

export const always: IsAllowed = async () => true;

export const archiveId = (parameters: ParameterizedPermission | null) =>
  parameters?.archive_tag?.id;

export type KeysWithValue<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type VariableGetter<T> = keyof Variables | ((variables: Variables) => T);

export const getVariable =
  <T>(validator: (value: unknown) => value is T) =>
  (variables: Variables, getter: VariableGetter<T>): T => {
    if (typeof getter !== 'string') {
      return getter(variables);
    }
    return validate(variables[getter], validator, getter);
  };

export const validate = <T>(
  value: unknown,
  validator: (value: unknown) => value is T,
  valueName: string
): T => {
  if (validator(value)) {
    return value;
  }
  throw new TypeError(`'${valueName}' has the wrong type`);
};

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isIDLike = (value: unknown): value is IDLike =>
  typeof value === 'string' || typeof value === 'number' || value === null || value === undefined;

export const isIDLikeArray = (value: unknown): value is IDLike[] =>
  value instanceof Array && value.every(isIDLike);

export const getIDLikeVariable = getVariable(isIDLike);
export const getIDLikeArrayVariable = getVariable(isIDLikeArray);

type IDLike = string | number | null | undefined;

export const toId = (id: IDLike): ID => {
  if (typeof id === 'number') {
    return id;
  }
  if (!id) {
    return undefined;
  }
  const parsed = parseInt(id);
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
};

export const checkArchive =
  (variable: VariableGetter<IDLike>): IsAllowed =>
  async ({ variables, parameters }) =>
    archiveId(parameters) === toId(getIDLikeVariable(variables, variable));

type EntityToArchiveDBMethodName = KeysWithValue<DB, (id: ID) => Promise<ID>>;

const createCheckEntityFactory =
  (entityToArchiveDBMethodName: EntityToArchiveDBMethodName) =>
  (variable: VariableGetter<IDLike>): IsAllowed =>
  async ({ variables, parameters, db }) =>
    archiveId(parameters) ===
    (await db[entityToArchiveDBMethodName](toId(getIDLikeVariable(variables, variable))));

const checkMultipleArchives = (
  { parameters, permissions }: IsAllowedContext,
  requestedArchives: (number | undefined)[]
) => {
  const currentOperationName = parameters.operation_name;
  const permissionsForSameOperation = permissions.filter(
    permission => permission.operation_name === currentOperationName
  );
  const allowedArchives = permissionsForSameOperation.map(permission => archiveId(permission));
  return requestedArchives.every(archive => allowedArchives.includes(archive));
};

const createCheckMultipleEntitiesFactory =
  (entityToArchiveDBMethodName: EntityToArchiveDBMethodName) =>
  (variable: VariableGetter<IDLike[]>): IsAllowed =>
  async context => {
    const { variables, db } = context;
    const requestedArchives = await Promise.all(
      getIDLikeArrayVariable(variables, variable).map(id =>
        db[entityToArchiveDBMethodName](toId(id))
      )
    );
    return checkMultipleArchives(context, requestedArchives);
  };

const createCheckEntityFactories = (entityToArchiveDBMethodName: EntityToArchiveDBMethodName) =>
  [
    createCheckEntityFactory(entityToArchiveDBMethodName),
    createCheckMultipleEntitiesFactory(entityToArchiveDBMethodName),
  ] as const;

export const [checkPicture, checkMultiplePictures] = createCheckEntityFactories('pictureToArchive');

export const checkComment = createCheckEntityFactory('commentToArchive');

export const checkFaceTag = createCheckEntityFactory('faceTagToArchive');

export const checkLink = createCheckEntityFactory('linkToArchive');

const equalOrBothNullish = <T>(a: Maybe<T> | undefined, b: Maybe<T> | undefined) =>
  (a ?? null) === (b ?? null);

export const hasPermission = (
  variables: Omit<
    Partial<ParameterizedPermission>,
    'users_permissions_user' | 'id' | 'archive_tag'
  > & {
    archive_tag?: IDLike;
  },
  permissions: ParameterizedPermission[]
) =>
  permissions.find(
    permission =>
      equalOrBothNullish(permission.operation_name, variables.operation_name) &&
      equalOrBothNullish(archiveId(permission), toId(variables.archive_tag)) &&
      Boolean(permission.see_unpublished_collections) >=
        Boolean(variables.see_unpublished_collections) &&
      Boolean(permission.on_other_users) >= Boolean(variables.on_other_users)
  ) !== undefined;

export const checkUpload =
  (variable: VariableGetter<IDLike>): IsAllowed =>
  async context => {
    const { variables, db } = context;
    const pictures = await db.mediaToPictures(toId(getIDLikeVariable(variables, variable)));
    if (!pictures) {
      return false;
    }
    const requestedArchives = await Promise.all(
      pictures.map(picture => db.pictureToArchive(picture))
    );
    const requestedArchivesDeduped = Array.from(new Set(requestedArchives));
    return checkMultipleArchives(context, requestedArchivesDeduped);
  };

export const checkOnOtherUsers =
  (variable: VariableGetter<IDLike>): IsAllowed =>
  async ({ variables, user, parameters }) =>
    !!user &&
    (parameters.on_other_users || toId(getIDLikeVariable(variables, variable)) === user.id);
