import { DB, ID } from './DB';
import { IsAllowed, Variables } from './Operation';
import { Maybe, ParameterizedPermission } from './db-types';

export const always: IsAllowed = async () => true;

export const archiveId = (parameters: ParameterizedPermission) => parameters.archive_tag?.id;

export type KeysWithValue<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

export type VariableGetter<T> = KeysWithValue<Variables, T> | ((variables: Variables) => T);

export const getVariable = <T>(variables: Variables, getter: VariableGetter<T>): T => {
  if (typeof getter === 'string') {
    return variables[getter];
  } else {
    return getter(variables);
  }
};

type IDLike = string | number | null | undefined;

const toId = (id: IDLike): ID => {
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
    archiveId(parameters) === toId(getVariable(variables, variable));

type EntityToArchiveDBMethodName = KeysWithValue<DB, (id: ID) => Promise<ID>>;

const createCheckEntityFactory =
  (entityToArchiveDBMethodName: EntityToArchiveDBMethodName) =>
  (variable: VariableGetter<IDLike>): IsAllowed =>
  async ({ variables, parameters, db }) =>
    archiveId(parameters) ===
    (await db[entityToArchiveDBMethodName](toId(getVariable(variables, variable))));

const createCheckMultipleEntitiesFactory =
  (entityToArchiveDBMethodName: EntityToArchiveDBMethodName) =>
  (variable: VariableGetter<IDLike[]>): IsAllowed =>
  async ({ variables, parameters, db, permissions }) => {
    const currentOperationName = parameters.operation_name;
    const permissionsForSameOperation = permissions.filter(
      permission => permission.operation_name === currentOperationName
    );
    const allowedArchives = permissionsForSameOperation.map(permission => archiveId(permission));
    const requestedArchives = await Promise.all(
      getVariable(variables, variable).map(id => db[entityToArchiveDBMethodName](toId(id)))
    );
    return requestedArchives.every(archive => allowedArchives.includes(archive));
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
  variables: { operationName: Maybe<string> | undefined; archiveId: IDLike },
  permissions: ParameterizedPermission[]
) =>
  permissions.find(
    permission =>
      equalOrBothNullish(permission.operation_name, variables.operationName) &&
      equalOrBothNullish(archiveId(permission), toId(variables.archiveId))
  ) !== undefined;
